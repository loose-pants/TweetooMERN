import React from 'react';
import { useNotification, Notification, NotificationType } from '../context/NotificationContext';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Sparkles } from 'lucide-react';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotification();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 shadow-glow-sm';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 shadow-glow-sm';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800 shadow-glow-sm';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800 shadow-glow-sm';
      default:
        return 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-purple-800 shadow-glow-sm';
    }
  };

  return (
    <div className={`max-w-sm w-full glass-card shadow-xl rounded-2xl pointer-events-auto border-2 ${getStyles(notification.type)} animate-slide-in-right transform hover:scale-105 transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 animate-bounce-gentle">
            {getIcon(notification.type)}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-semibold">
              {notification.title}
            </p>
            {notification.message && (
              <p className="mt-1 text-sm opacity-90">
                {notification.message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-300 transform hover:scale-110 hover:rotate-90"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      <div className="h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-400' :
            notification.type === 'error' ? 'bg-red-400' :
            notification.type === 'warning' ? 'bg-yellow-400' :
            'bg-blue-400'
          }`}
          style={{
            animation: `shrink ${notification.duration || 5000}ms linear`,
            transformOrigin: 'left'
          }}
        ></div>
      </div>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="flex flex-col space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <NotificationItem notification={notification} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Add custom keyframe for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
`;
document.head.appendChild(style);

export default NotificationContainer;