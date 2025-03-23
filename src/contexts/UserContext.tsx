
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends UserCredentials {
  name: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('invoice_app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: UserCredentials) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you'd call an API
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials against a backend
      // For now, we'll just create a mock user
      const mockUser = {
        id: Math.random().toString(36).substring(2, 9),
        email: credentials.email,
        name: credentials.email.split('@')[0]
      };
      
      setUser(mockUser);
      localStorage.setItem('invoice_app_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, you'd call an API
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create a user in the backend
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        email: credentials.email,
        name: credentials.name
      };
      
      setUser(newUser);
      localStorage.setItem('invoice_app_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('invoice_app_user');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
