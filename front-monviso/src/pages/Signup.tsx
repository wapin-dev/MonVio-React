import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, CheckIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    signup
  } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    try {
      setError('');
      setIsSubmitting(true);
      await signup(name, email, password);
    } catch (err) {
      setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return {
      strength: 0,
      label: ''
    };
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    const labels = ['Faible', 'Moyen', 'Fort', 'Très fort'];
    return {
      strength,
      label: labels[strength - 1] || ''
    };
  };
  const passwordStrength = getPasswordStrength();
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
            Créer un compte
          </h2>
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm relative z-10">
              {error}
            </div>}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nom complet
              </label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" placeholder="Jean Dupont" />
            </div>
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
              {password && <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-400">
                      Force du mot de passe:
                    </div>
                    <div className={`text-xs font-medium ${passwordStrength.strength <= 1 ? 'text-red-400' : passwordStrength.strength === 2 ? 'text-yellow-400' : passwordStrength.strength === 3 ? 'text-green-400' : 'text-emerald-400'}`}>
                      {passwordStrength.label}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.strength <= 1 ? 'bg-red-500' : passwordStrength.strength === 2 ? 'bg-yellow-500' : passwordStrength.strength === 3 ? 'bg-green-500' : 'bg-emerald-500'}`} style={{
                  width: `${passwordStrength.strength * 25}%`
                }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full mr-1.5 flex items-center justify-center ${password.length >= 8 ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                        {password.length >= 8 && <CheckIcon size={12} />}
                      </div>
                      <span className={password.length >= 8 ? 'text-gray-300' : 'text-gray-500'}>
                        8+ caractères
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full mr-1.5 flex items-center justify-center ${password.match(/[A-Z]/) ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                        {password.match(/[A-Z]/) && <CheckIcon size={12} />}
                      </div>
                      <span className={password.match(/[A-Z]/) ? 'text-gray-300' : 'text-gray-500'}>
                        Majuscule
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full mr-1.5 flex items-center justify-center ${password.match(/[0-9]/) ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                        {password.match(/[0-9]/) && <CheckIcon size={12} />}
                      </div>
                      <span className={password.match(/[0-9]/) ? 'text-gray-300' : 'text-gray-500'}>
                        Chiffre
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`w-3.5 h-3.5 rounded-full mr-1.5 flex items-center justify-center ${password.match(/[^A-Za-z0-9]/) ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                        {password.match(/[^A-Za-z0-9]/) && <CheckIcon size={12} />}
                      </div>
                      <span className={password.match(/[^A-Za-z0-9]/) ? 'text-gray-300' : 'text-gray-500'}>
                        Caractère spécial
                      </span>
                    </div>
                  </div>
                </div>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                Confirmer le mot de passe
              </label>
              <input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" placeholder="••••••••" />
              {password && confirmPassword && <div className="mt-1 flex items-center">
                  {password === confirmPassword ? <span className="text-xs text-green-400 flex items-center">
                      <CheckIcon size={12} className="mr-1" /> Les mots de passe
                      correspondent
                    </span> : <span className="text-xs text-red-400">
                      Les mots de passe ne correspondent pas
                    </span>}
                </div>}
            </div>
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                J'accepte les{' '}
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                  politique de confidentialité
                </a>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 text-sm font-medium shadow-xl shadow-blue-700/20 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
            </button>
            <div className="text-center text-sm text-gray-400">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default Signup;