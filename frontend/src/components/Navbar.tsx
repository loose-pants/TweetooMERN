import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Twitter, Home, Shield, Edit, LogOut, User, LogIn, UserPlus, Menu, X, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="glass-dark sticky top-0 z-50 border-b border-primary-500/20 animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-bold gradient-text-primary hover:scale-105 transition-all duration-300 animate-fade-in-right"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-indigo-glow animate-float">
                <Twitter className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <span className="hidden sm:inline">Twittoo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-primary-500/20 text-primary-300 shadow-glow-sm border border-primary-500/30' 
                  : 'text-gray-300 hover:bg-primary-500/10 hover:text-primary-300 hover:shadow-md'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Role-based navigation */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isActive('/admin') 
                        ? 'bg-red-500/20 text-red-300 shadow-glow-sm border border-red-500/30' 
                        : 'text-gray-300 hover:bg-red-500/10 hover:text-red-300 hover:shadow-md'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                {(user?.role === 'editor' || user?.role === 'admin') && (
                  <Link
                    to="/editor"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isActive('/editor') 
                        ? 'bg-accent-500/20 text-accent-300 shadow-glow-sm border border-accent-500/30' 
                        : 'text-gray-300 hover:bg-accent-500/10 hover:text-accent-300 hover:shadow-md'
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden lg:inline">Editor</span>
                  </Link>
                )}

                {/* User info and logout */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-600/50">
                  <div className="flex items-center space-x-2 text-sm animate-fade-in-left">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-indigo-glow">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-800 animate-pulse"></div>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-gray-200 font-medium">{user?.username}</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                        user?.role === 'admin' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : user?.role === 'editor'
                          ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                          : 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 transform hover:scale-105"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login and Register for unauthenticated users */}
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive('/login') 
                      ? 'bg-primary-500/20 text-primary-300 shadow-glow-sm border border-primary-500/30' 
                      : 'text-gray-300 hover:bg-primary-500/10 hover:text-primary-300 hover:shadow-md'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">Login</span>
                </Link>
                
                <Link
                  to="/register"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isActive('/register') 
                      ? 'bg-accent-500/20 text-accent-300 shadow-glow-sm border border-accent-500/30' 
                      : 'text-gray-300 hover:bg-accent-500/10 hover:text-accent-300 hover:shadow-md'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden lg:inline">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-primary-500/10 transition-all duration-300 transform hover:scale-105"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500/20 animate-slide-down">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive('/') 
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                    : 'text-gray-300 hover:bg-primary-500/10'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive('/admin') 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'text-gray-300 hover:bg-red-500/10'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {(user?.role === 'editor' || user?.role === 'admin') && (
                    <Link
                      to="/editor"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive('/editor') 
                          ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' 
                          : 'text-gray-300 hover:bg-accent-500/10'
                      }`}
                    >
                      <Edit className="h-5 w-5" />
                      <span>Editor Panel</span>
                    </Link>
                  )}

                  <div className="px-4 py-3 border-t border-gray-600/50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-indigo-glow">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{user?.username}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          user?.role === 'admin' 
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : user?.role === 'editor'
                            ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                            : 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                        }`}>
                          {user?.role}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive('/login') 
                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30' 
                        : 'text-gray-300 hover:bg-primary-500/10'
                    }`}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive('/register') 
                        ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' 
                        : 'text-gray-300 hover:bg-accent-500/10'
                    }`}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;