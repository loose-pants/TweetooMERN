import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { tweetAPI } from '../services/api';
import TweetCard from '../components/TweetCard';
import { Edit, MessageCircle, RefreshCw, Filter } from 'lucide-react';

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

const EditorPanel: React.FC = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'recent' | 'edited'>('all');

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

  // Filter tweets based on selected filter
  const filteredTweets = tweets.filter(tweet => {
    switch (filter) {
      case 'recent':
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return new Date(tweet.createdAt) > oneDayAgo;
      case 'edited':
        return tweet.updatedAt !== tweet.createdAt;
      default:
        return true;
    }
  });

  const getFilterCount = (filterType: 'all' | 'recent' | 'edited') => {
    switch (filterType) {
      case 'recent':
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return tweets.filter(tweet => new Date(tweet.createdAt) > oneDayAgo).length;
      case 'edited':
        return tweets.filter(tweet => tweet.updatedAt !== tweet.createdAt).length;
      default:
        return tweets.length;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editor Panel</h1>
              <p className="text-gray-600 mt-1">Content moderation and management</p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Refresh tweets"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Total Tweets</p>
              <p className="text-2xl font-bold text-gray-900">{tweets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Recent (24h)</p>
              <p className="text-2xl font-bold text-blue-600">
                {getFilterCount('recent')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <Edit className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Edited</p>
              <p className="text-2xl font-bold text-purple-600">
                {getFilterCount('edited')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-1">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Tweets ({getFilterCount('all')})
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'recent'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Recent ({getFilterCount('recent')})
            </button>
            <button
              onClick={() => setFilter('edited')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === 'edited'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Edited ({getFilterCount('edited')})
            </button>
          </div>
        </div>
      </div>

      {/* Editor Permissions Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <Edit className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-800">Editor Permissions</h3>
            <p className="mt-1 text-sm text-purple-700">
              As an {user?.role}, you can edit and delete any tweet for content moderation purposes. 
              Use this power responsibly to maintain community guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Tweet Feed */}
      <div className="space-y-6">
        {filteredTweets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'No tweets found' : `No ${filter} tweets`}
            </h3>
            <p className="text-gray-500">
              {filter === 'recent' && 'No tweets posted in the last 24 hours.'}
              {filter === 'edited' && 'No tweets have been edited yet.'}
              {filter === 'all' && 'The platform is waiting for its first tweet!'}
            </p>
          </div>
        ) : (
          filteredTweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onUpdate={handleTweetUpdated}
              onDelete={handleTweetDeleted}
              showActions={true}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 py-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p className="text-sm">
            Content moderation panel for {user?.role}s
          </p>
          <p className="text-xs mt-1">
            Showing {filteredTweets.length} of {tweets.length} tweets
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;