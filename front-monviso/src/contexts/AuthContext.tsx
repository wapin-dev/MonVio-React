import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, budgetService, onboardingService, dashboardService } from '../services/api';

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : parseFloat(value);
};

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  monthly_income?: number;
}

interface IncomeItem {
  id: number;
  name: string;
  amount: number;
  type: string;
  frequency: string;
  is_primary?: boolean;
}

interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  type: string;
  frequency: string;
  category_id?: number | null;
  category_name?: string | null;
}

interface SavingsGoalItem {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  type: string;
  priority: string;
}

interface FinancialData {
  monthly_income: number;
  total_income: number;
  total_expenses: number;
  total_fixed_expenses: number;
  total_variable_expenses: number;
  remaining_budget: number;
  incomes: IncomeItem[];
  fixed_expenses: ExpenseItem[];
  variable_expenses: ExpenseItem[];
  savings_goals: SavingsGoalItem[];
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
  completeOnboarding: () => Promise<void>;
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

  const refreshFinancialData = async () => {
    try {
      const response = await dashboardService.getFinancialData();
      setFinancialData(normalizeFinancialData(response.data));
    } catch (error) {
      console.error('Error refreshing financial data:', error);
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const response = await onboardingService.checkOnboardingStatus();
      setNeedsOnboarding(!response.data.onboarding_completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setNeedsOnboarding(true); // Default to showing onboarding if check fails
    }
  };

  const completeOnboarding = async () => {
    setNeedsOnboarding(false);
    try {
      const userResponse = await budgetService.getUserProfile();
      setUser(userResponse.data);
      await refreshFinancialData();
    } catch (error) {
      console.error('Error refreshing data after onboarding:', error);
    }
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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userResponse = await budgetService.getUserProfile();
          setUser(userResponse.data);
          await checkOnboardingStatus();
          const financialResponse = await dashboardService.getFinancialData();
          setFinancialData(normalizeFinancialData(financialResponse.data));
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

const normalizeExpense = (expense: any): ExpenseItem => ({
  id: expense.id,
  name: expense.name,
  amount: toNumber(expense.amount),
  type: expense.type,
  frequency: expense.frequency,
  category_id: expense.category_id ?? expense.category ?? null,
  category_name: expense.category_name ?? null,
});

const normalizeFinancialData = (data: any): FinancialData => ({
  monthly_income: toNumber(data?.monthly_income ?? data?.total_income ?? 0),
  total_income: toNumber(data?.total_income ?? data?.monthly_income ?? 0),
  total_expenses: toNumber(data?.total_expenses ?? 0),
  total_fixed_expenses: toNumber(data?.total_fixed_expenses ?? 0),
  total_variable_expenses: toNumber(data?.total_variable_expenses ?? 0),
  remaining_budget: toNumber(data?.remaining_budget ?? 0),
  incomes: (data?.incomes || []).map((income: any) => ({
    id: income.id,
    name: income.name,
    amount: toNumber(income.amount),
    type: income.type,
    frequency: income.frequency,
    is_primary: income.is_primary
  })),
  fixed_expenses: (data?.fixed_expenses || []).map(normalizeExpense),
  variable_expenses: (data?.variable_expenses || []).map(normalizeExpense),
  savings_goals: (data?.savings_goals || []).map((goal: any) => ({
    id: goal.id,
    name: goal.name,
    target_amount: toNumber(goal.target_amount),
    current_amount: toNumber(goal.current_amount),
    target_date: goal.target_date ?? null,
    type: goal.type,
    priority: goal.priority
  }))
});