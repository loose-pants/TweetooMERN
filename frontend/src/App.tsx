import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import EditorPanel from './pages/EditorPanel';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/NotificationContainer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gradient-to-br from-dark-950 via-primary-950 to-dark-900 relative overflow-hidden">
            {/* Animated aurora background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-primary-600/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent-500/20 via-primary-500/20 to-accent-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
              <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-primary-400/10 via-accent-400/10 to-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-to-br from-accent-400/15 via-primary-400/15 to-accent-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '5s' }}></div>
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-transparent to-dark-950/50 pointer-events-none"></div>
            
            <div className="relative z-10">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/editor" 
                    element={
                      <ProtectedRoute roles={['editor', 'admin']}>
                        <EditorPanel />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
            <NotificationContainer />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;