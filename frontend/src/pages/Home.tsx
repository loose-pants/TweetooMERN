import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { tweetAPI } from '../services/api';
import TweetCard from '../components/TweetCard';
import TweetForm from '../components/TweetForm';
import { Twitter, RefreshCw, MessageCircle, TrendingUp, Users, Sparkles, Zap, Star } from 'lucide-react';

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

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { showError } = useNotification();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTweets = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      else setIsRefreshing(true);
      
      const response = await tweetAPI.getTweets();
      setTweets(response.data.data);
    } catch (error: any) {
      showError('Failed to load tweets', error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleTweetCreated = (newTweet: Tweet) => {
    setTweets(prev => [newTweet, ...prev]);
  };

  const handleTweetUpdated = (updatedTweet: Tweet) => {
    setTweets(prev => prev.map(tweet => 
      tweet._id === updatedTweet._id ? updatedTweet : tweet
    ));
  };

  const handleTweetDeleted = (tweetId: string) => {
    setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
  };

  const handleRefresh = () => {
    fetchTweets(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="loading-spinner h-12 w-12 border-4 border-primary-300/30 border-t-primary-500 rounded-full mx-auto mb-4"></div>
            <div className="absolute inset-0 h-12 w-12 border-4 border-accent-300/30 border-t-accent-500 rounded-full mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-300 font-medium animate-pulse">Loading amazing tweets...</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Header */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-indigo-glow transform transition-all duration-300 hover:scale-110 hover:shadow-purple-glow animate-float">
                <Twitter className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text-primary animate-fade-in-right">
                Welcome to Twittoo
              </h1>
              <p className="text-gray-300 mt-2 text-lg animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
                Share your thoughts with the universe ✨
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-6 py-3 text-gray-300 hover:text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 glass-card border border-primary-500/20"
            title="Refresh tweets"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl hover:shadow-indigo-glow transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-primary-500/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-indigo-glow">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Tweets</p>
              <p className="text-2xl font-bold text-gray-100">{tweets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl hover:shadow-purple-glow transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-accent-500/20" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-purple-glow">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Trending</p>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
                <p className="text-2xl font-bold text-gray-100">Hot</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl hover:shadow-indigo-glow transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up border border-primary-500/20" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-indigo-glow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-gray-100">{new Set(tweets.map(t => t.user?.username)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet Form - Only show if authenticated */}
      {isAuthenticated && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <TweetForm onTweetCreated={handleTweetCreated} />
        </div>
      )}

      {/* Not authenticated message */}
      {!isAuthenticated && (
        <div className="glass-card p-8 mb-8 text-center rounded-2xl animate-fade-in-up border border-primary-500/20" style={{ animationDelay: '0.3s' }}>
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-indigo-glow animate-float">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 text-primary-300/20 animate-ping">
              <MessageCircle className="h-20 w-20" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3 gradient-text">Join the Conversation</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Sign up or log in to share your thoughts and connect with others in the digital cosmos.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a href="/register" className="btn-primary transform hover:scale-105 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Sign Up Free</span>
            </a>
            <a href="/login" className="btn-outline transform hover:scale-105">
              Log In
            </a>
          </div>
        </div>
      )}

      {/* Tweet Feed */}
      <div className="space-y-6">
        {tweets.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl animate-fade-in-up border border-primary-500/20">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <Twitter className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 text-gray-500/10 animate-pulse">
                <Twitter className="h-24 w-24" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No tweets yet</h3>
            <p className="text-gray-400 text-lg">
              {isAuthenticated 
                ? "Be the first to share something amazing! ✨"
                : "Sign up to start sharing your thoughts! 🚀"
              }
            </p>
          </div>
        ) : (
          tweets.map((tweet, index) => (
            <div
              key={tweet._id}
              className="stagger-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TweetCard
                tweet={tweet}
                onUpdate={handleTweetUpdated}
                onDelete={handleTweetDeleted}
              />
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 py-12 border-t border-gray-700/50 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-indigo-glow">
              <Twitter className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-primary">Twittoo</span>
          </div>
          <p className="text-gray-400 mb-2">
            Built with ❤️ using React, Node.js, and modern web technologies
          </p>
          <p className="text-sm text-gray-500">
            {tweets.length} tweet{tweets.length !== 1 ? 's' : ''} shared so far • Join the cosmic community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;