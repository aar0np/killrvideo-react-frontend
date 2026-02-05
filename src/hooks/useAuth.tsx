import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { useProfile } from './useApi';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  guidedTourEnabled: boolean;
  toggleGuidedTour: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authVersion, setAuthVersion] = useState(0);
  const [guidedTourEnabled, setGuidedTourEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('killrvideo_guided_tour_enabled');
      return stored === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handler = () => setAuthVersion((v) => v + 1);
    window.addEventListener('auth-change', handler);
    return () => window.removeEventListener('auth-change', handler);
  }, []);

  const toggleGuidedTour = useCallback(() => {
    setGuidedTourEnabled((prev) => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('killrvideo_guided_tour_enabled', String(newValue));
      }
      return newValue;
    });
  }, []);

  const { data: profile, isLoading } = useProfile();
  const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;

  // Cache initial user from localStorage with stable reference (lazy init runs once)
  const [cachedInitialUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const user = token ? ((profile as User | null) ?? cachedInitialUser) : null;
  const isAuthenticated = !!token && !!user;

  const contextValue = useMemo(
    () => ({ user, isLoading, isAuthenticated, guidedTourEnabled, toggleGuidedTour }),
    [user, isLoading, isAuthenticated, guidedTourEnabled, toggleGuidedTour]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
