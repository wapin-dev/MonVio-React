import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    login
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate('/'); // Redirection après connexion réussie
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.error || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link to="/get-started" className="flex items-center text-gray-300 hover:text-white transition-colors">
          <ArrowLeftIcon size={16} className="mr-2" />
          Retour
        </Link>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 relative z-10">
            Connexion à monviso
          </h2>
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm relative z-10">
              {error}
            </div>}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Adresse email
              </label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" placeholder="votre@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300">
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                  Mot de passe oublié?
                </a>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 text-sm font-medium shadow-xl shadow-blue-700/20 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            <div className="text-center text-sm text-gray-400">
              Vous n'avez pas de compte?{' '}
              <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                S'inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>;
};

export default Login;