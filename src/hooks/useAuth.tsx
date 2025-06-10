import { createContext, useContext, ReactNode } from 'react';
import { useProfile } from './useApi';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: profile, isLoading } = useProfile();
  const token = (typeof window !== 'undefined') ? localStorage.getItem('auth_token') : null;
  // Attempt to hydrate user from cache/localStorage for instant UI feedback
  let initialUser: User | null = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        initialUser = JSON.parse(stored);
      } catch {}
    }
  }

  const user = token ? ((profile as User | null) ?? initialUser) : null;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated }}>
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
