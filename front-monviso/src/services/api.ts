import axios from 'axios';

// Configuration de base d'Axios
const API_URL = '/api/';  // Ajustez selon votre configuration

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonctions pour l'authentification
export const authService = {
  login: async (username: string, password: string) => {
    console.log(' [DEBUG] authService.login appelé avec:', { username, password: '***' });
    const payload = { email: username, password };
    console.log(' [DEBUG] Payload envoyé au backend:', { email: username, password: '***' });
    
    const response = await api.post('auth/login/', payload);
    console.log(' [DEBUG] Réponse du backend:', response.status, response.data);
    
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    return await api.post('auth/register/', { 
      username, 
      email, 
      password 
    });
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await api.post('auth/token/refresh/', { refresh: refreshToken });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Fonctions pour les catégories
export const categoryService = {
  getAll: async () => {
    return await api.get('categories/');
  },
  
  getById: async (id: number) => {
    return await api.get(`categories/${id}/`);
  },
  
  create: async (category: any) => {
    return await api.post('categories/', category);
  },
  
  update: async (id: number, category: any) => {
    return await api.put(`categories/${id}/`, category);
  },
  
  delete: async (id: number) => {
    return await api.delete(`categories/${id}/`);
  }
};

// Fonctions pour les transactions
export const transactionService = {
  getAll: async () => {
    return await api.get('transactions/');
  },
  
  getById: async (id: number) => {
    return await api.get(`transactions/${id}/`);
  },
  
  create: async (transaction: any) => {
    return await api.post('transactions/', transaction);
  },
  
  update: async (id: number, transaction: any) => {
    return await api.put(`transactions/${id}/`, transaction);
  },
  
  delete: async (id: number) => {
    return await api.delete(`transactions/${id}/`);
  }
};

// Fonction pour obtenir le résumé du budget
export const budgetService = {
  getSummary: async () => {
    return await api.get('summary/');
  },
  
  getUserProfile: async () => {
    return await api.get('profile/');
  },
  
  updateUserProfile: async (profileData: any) => {
    return await api.patch('profile/', profileData);
  }
};

export default api;
