import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, budgetService, onboardingService, dashboardService } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  monthly_income?: number;
}

interface FinancialData {
  monthly_income: number;
  total_income: number;
  total_expenses: number;
  total_fixed_expenses: number;
  total_variable_expenses: number;
  remaining_budget: number;
}

interface AuthContextType {
  user: User | null;
  financialData: FinancialData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  refreshFinancialData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const navigate = useNavigate();

  const checkOnboardingStatus = async () => {
    try {
      const response = await onboardingService.checkOnboardingStatus();
      setNeedsOnboarding(!response.data.onboarding_completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setNeedsOnboarding(true); // Default to showing onboarding if check fails
    }
  };

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('[AUTH] Attempting login with email:', email);
      const authResponse = await authService.login(email, password);
      console.log('[AUTH] Login successful, fetching profile...');
      
      const userResponse = await budgetService.getUserProfile();
      console.log('[AUTH] Profile fetched:', userResponse.data);
      setUser(userResponse.data);
      
      // Check onboarding status after successful login
      await checkOnboardingStatus();
      
      await refreshFinancialData();
      
      navigate('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      console.log('[AUTH] Attempting signup...');
      await authService.register(email, password, firstName, lastName);
      console.log('[AUTH] Signup successful, logging in...');
      
      // Auto-login after successful signup
      await login(email, password);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Appeler le service d'authentification pour se déconnecter
    authService.logout();
    setUser(null);
    setFinancialData(null);
    navigate('/get-started');
  };

  const refreshFinancialData = async () => {
    try {
      const response = await dashboardService.getFinancialData();
      setFinancialData(response.data);
    } catch (error) {
      console.error('Error refreshing financial data:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userResponse = await budgetService.getUserProfile();
          setUser(userResponse.data);
          await checkOnboardingStatus();
          await refreshFinancialData();
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value: AuthContextType = {
    user,
    financialData,
    isAuthenticated: !!user,
    isLoading,
    needsOnboarding,
    login,
    signup,
    logout,
    completeOnboarding,
    refreshFinancialData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};