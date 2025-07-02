import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { tweetAPI } from '../services/api';
import { Send, User, Image, Smile, MapPin, Calendar, Crown, Shield, Sparkles, Zap } from 'lucide-react';

interface Tweet {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    username: string;
    role: string;
  } | null;
}

interface TweetFormProps {
  onTweetCreated: (tweet: Tweet) => void;
}

const TweetForm: React.FC<TweetFormProps> = ({ onTweetCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      showError('Tweet content cannot be empty');
      return;
    }

    if (content.length > 280) {
      showError('Tweet content cannot exceed 280 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await tweetAPI.createTweet(content.trim());
      onTweetCreated(response.data.data);
      setContent('');
      setIsFocused(false);
      showSuccess('Tweet posted successfully!', 'Your thoughts are now shared with the cosmos 🌟');
    } catch (error: any) {
      showError('Failed to post tweet', error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'editor':
        return 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'editor':
        return <Shield className="h-3 w-3" />;
      default:
        return <Sparkles className="h-3 w-3" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="card p-6 mb-8 animate-fade-in-up relative overflow-hidden border border-primary-500/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-indigo-glow transform transition-all duration-300 hover:scale-110 hover:shadow-purple-glow animate-float">
              <User className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-dark-800 animate-pulse"></div>
          </div>

          {/* Tweet Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:outline-none resize-none transition-all duration-300 bg-dark-800/50 backdrop-blur-sm placeholder-gray-400 text-lg text-gray-100 ${
                    isFocused 
                      ? 'border-primary-500 shadow-indigo-glow bg-dark-800/70' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  rows={isFocused ? 4 : 3}
                  maxLength={280}
                  placeholder="What's happening in your universe?"
                  disabled={isLoading}
                />
                
                {/* Character count indicator */}
                <div className={`absolute bottom-3 right-3 text-sm font-medium transition-all duration-300 ${
                  content.length > 280 
                    ? 'text-red-400' 
                    : content.length > 250 
                    ? 'text-yellow-400' 
                    : content.length > 0 
                    ? 'text-primary-400' 
                    : 'text-gray-500'
                }`}>
                  {content.length}/280
                </div>
              </div>

              {/* User info and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Posting as:</span>
                    <span className="font-semibold text-gray-200">{user?.username}</span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${getRoleBadgeColor(user?.role || 'user')}`}>
                      {getRoleIcon(user?.role || 'user')}
                      <span>{user?.role}</span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  {isFocused && (
                    <div className="flex items-center space-x-2 animate-fade-in-right">
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all duration-300 transform hover:scale-110"
                        title="Add image"
                      >
                        <Image className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all duration-300 transform hover:scale-110"
                        title="Add emoji"
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all duration-300 transform hover:scale-110"
                        title="Add location"
                      >
                        <MapPin className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-full transition-all duration-300 transform hover:scale-110"
                        title="Schedule"
                      >
                        <Calendar className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !content.trim() || content.length > 280}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>Post Tweet</span>
                      </>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Progress bar for character count */}
        {content.length > 0 && (
          <div className="mt-4 animate-fade-in">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  content.length > 280 
                    ? 'bg-red-500' 
                    : content.length > 250 
                    ? 'bg-yellow-500' 
                    : 'bg-gradient-to-r from-primary-500 to-accent-500'
                }`}
                style={{ width: `${Math.min((content.length / 280) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetForm;