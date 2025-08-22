import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, budgetService } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  monthly_income?: number;
  setup_completed?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Récupérer les informations de l'utilisateur
          const response = await budgetService.getUserProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          // Si le token est invalide, déconnecter l'utilisateur
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Appeler l'API pour se connecter
      const authResponse = await authService.login(username, password);
      
      // Récupérer les informations de l'utilisateur
      const userResponse = await budgetService.getUserProfile();
      setUser(userResponse.data);
      
      navigate('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Appeler l'API pour créer un compte
      await authService.register(username, email, password);
      
      // Se connecter automatiquement après l'inscription
      await login(username, password);
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
    navigate('/get-started');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};