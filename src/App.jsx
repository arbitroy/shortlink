import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link2, History, LogIn, LogOut, User } from 'lucide-react';
import DotGrid from './DotGrid';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import HistoryPage from './HistoryPage';
import NotFoundPage from './NotFoundPage';
import { api, storage, colors } from './utils';

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState({ count: 0, resetTime: 0 });
  const [currentView, setCurrentView] = useState('home');
  const [urlHistory, setUrlHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user and attempts from storage
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    
    const savedAttempts = storage.getAttempts();
    setAttempts(savedAttempts);
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.login(credentials);
      storage.setUser(response.user);
      setUser(response.user);
      setCurrentView('home');
      
      // Reset attempts for logged in users
      localStorage.removeItem('urlShortenerAttempts');
      setAttempts({ count: 0, resetTime: 0 });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    setUrlHistory([]);
    setCurrentView('home');
  };

  const handleShortenUrl = async (url) => {
    if (!user) {
      const currentAttempts = storage.incrementAttempts();
      setAttempts(currentAttempts);
      
      if (currentAttempts.count > 3) {
        setCurrentView('login');
        return null;
      }
    }
    
    try {
      const result = await api.shortenUrl(url);
      
      // Add to local history if logged in
      if (user) {
        setUrlHistory(prev => [result, ...prev]);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to shorten URL:', error);
      return null;
    }
  };

  const loadUrlHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.getUrlHistory();
      setUrlHistory(response.urls);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && currentView === 'history') {
      loadUrlHistory();
    }
  }, [user, currentView]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* DotGrid Background */}
      <div className="absolute inset-0 opacity-30" style={{ pointerEvents: 'auto' }}>
        <DotGrid
          dotSize={8}
          gap={20}
          baseColor={colors.primary}
          activeColor={colors.secondary}
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-gray-800 backdrop-blur-md" style={{ backgroundColor: 'rgba(42, 42, 42, 0.8)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition-opacity"
                >
                  <Link2 className="w-6 h-6" style={{ color: colors.accent }} />
                  <span>ShortLink</span>
                </button>
                
                {user && (
                  <button
                    onClick={() => setCurrentView('history')}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    style={{ color: currentView === 'history' ? colors.secondary : colors.textMuted }}
                  >
                    <History className="w-5 h-5" />
                    <span>History</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2" style={{ color: colors.textMuted }}>
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                      style={{ backgroundColor: colors.danger }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setCurrentView('login')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-80 transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <HomePage 
              onShortenUrl={handleShortenUrl}
              attempts={attempts}
              isAuthenticated={!!user}
            />
          )}
          
          {currentView === 'login' && (
            <LoginPage onLogin={handleLogin} loading={loading} />
          )}
          
          {currentView === 'history' && (
            <HistoryPage history={urlHistory} loading={loading} />
          )}
          
          {currentView === '404' && (
            <NotFoundPage onGoHome={() => setCurrentView('home')} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;