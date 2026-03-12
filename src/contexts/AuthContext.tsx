import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  institution?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, institution?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('edna_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock login - in real app, this would call Supabase auth
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            institution: 'Mock University',
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=2563eb&color=fff`
          };
          setUser(mockUser);
          localStorage.setItem('edna_user', JSON.stringify(mockUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const signup = async (email: string, password: string, name: string, institution?: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock signup - in real app, this would call Supabase auth
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password && name) {
          const mockUser: User = {
            id: Date.now().toString(),
            email,
            name,
            institution,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=2563eb&color=fff`
          };
          setUser(mockUser);
          localStorage.setItem('edna_user', JSON.stringify(mockUser));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edna_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
