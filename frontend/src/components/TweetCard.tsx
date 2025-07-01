import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { tweetAPI } from '../services/api';
import { Edit2, Trash2, User, Calendar, Save, X, Heart, MessageCircle, Share, MoreHorizontal, Crown, Shield, Sparkles } from 'lucide-react';

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

interface TweetCardProps {
  tweet: Tweet;
  onUpdate: (updatedTweet: Tweet) => void;
  onDelete: (tweetId: string) => void;
  showActions?: boolean;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onUpdate, onDelete, showActions = true }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50));

  // Check if user can modify this tweet
  const canModify = isAuthenticated && user && (
    user._id === tweet.user?._id || 
    user.role === 'editor' || 
    user.role === 'admin'
  );

  const handleEdit = async () => {
    if (!editContent.trim()) {
      showError('Tweet content cannot be empty');
      return;
    }

    if (editContent.length > 280) {
      showError('Tweet content cannot exceed 280 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await tweetAPI.updateTweet(tweet._id, editContent.trim());
      onUpdate(response.data.data);
      setIsEditing(false);
      setShowMenu(false);
      showSuccess('Tweet updated successfully');
    } catch (error: any) {
      showError('Failed to update tweet', error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) {
      return;
    }

    setIsLoading(true);
    try {
      await tweetAPI.deleteTweet(tweet._id);
      onDelete(tweet._id);
      showSuccess('Tweet deleted successfully');
    } catch (error: any) {
      showError('Failed to delete tweet', error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const cancelEdit = () => {
    setEditContent(tweet.content);
    setIsEditing(false);
    setShowMenu(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="tweet-card group animate-fade-in-up relative border border-primary-500/20">
      {/* User Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-indigo-glow transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-glow">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-800 animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-100 hover:text-primary-400 transition-colors duration-300">
                {tweet.user?.username || 'Unknown User'}
              </h3>
              <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${getRoleBadgeColor(tweet.user?.role || 'user')}`}>
                {getRoleIcon(tweet.user?.role || 'user')}
                <span>{tweet.user?.role || 'user'}</span>
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(tweet.createdAt)}</span>
              {tweet.updatedAt !== tweet.createdAt && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full animate-pulse border border-yellow-500/30">
                  edited
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        {showActions && canModify && !isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-primary-500/10 rounded-full transition-all duration-300 transform hover:scale-110"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-xl border border-primary-500/20 z-10 animate-scale-in">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-gray-300 hover:bg-primary-500/10 hover:text-primary-300 transition-all duration-300"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Tweet</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Tweet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tweet Content */}
      {isEditing ? (
        <div className="space-y-4 animate-fade-in">
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 bg-dark-800/50 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none transition-all duration-300 backdrop-blur-sm"
              rows={3}
              maxLength={280}
              placeholder="What's happening?"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-2">
              <div className={`text-sm transition-colors duration-300 ${editContent.length > 280 ? 'text-red-400' : editContent.length > 250 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {editContent.length}/280
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              disabled={isLoading || !editContent.trim() || editContent.length > 280}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              onClick={cancelEdit}
              disabled={isLoading}
              className="btn-outline flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-slate max-w-none">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
              {tweet.content}
            </p>
          </div>

          {/* Tweet Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isLiked 
                    ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 shadow-glow-sm' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`h-4 w-4 transition-all duration-300 ${isLiked ? 'fill-current animate-bounce' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300 transform hover:scale-105">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{Math.floor(Math.random() * 20)}</span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300 transform hover:scale-105">
                <Share className="h-4 w-4" />
                <span className="text-sm font-medium">{Math.floor(Math.random() * 10)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !isEditing && (
        <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="loading-spinner h-6 w-6 border-4 border-primary-300/30 border-t-primary-500 rounded-full"></div>
            <span className="text-gray-300 font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetCard;