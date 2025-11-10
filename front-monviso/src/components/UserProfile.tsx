import React, { useState, useEffect } from 'react';
import { SaveIcon, UserIcon, BellIcon, LockIcon, LogOutIcon, CreditCardIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { budgetService } from '../services/api';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  monthly_income: number;
  currency: string;
}

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    monthly_income: 0,
    currency: 'EUR'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        monthly_income: user.monthly_income || 0,
        currency: user.currency || 'EUR'
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await budgetService.updateUserProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email
      });
      
      setMessage({ type: 'success', text: 'Informations personnelles mises à jour avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des informations personnelles' });
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await budgetService.updateUserProfile({
        monthly_income: profileData.monthly_income,
        currency: profileData.currency
      });
      
      setMessage({ type: 'success', text: 'Informations financières mises à jour avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des revenus:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des informations financières' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await budgetService.updateUserProfile({
        currency: profileData.currency
      });
      
      setMessage({ type: 'success', text: 'Préférences mises à jour avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des préférences' });
    } finally {
      setLoading(false);
    }
  };
  
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profil utilisateur</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sidebar Navigation */}
        <div className="space-y-6 lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon size={32} className="text-gray-500" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {user?.username || 'Utilisateur'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <nav className="space-y-1">
                  <button className="flex w-full items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                    <UserIcon size={20} className="mr-3 text-blue-500" />
                    Informations personnelles
                  </button>
                </nav>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <button 
                  onClick={logout}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOutIcon size={20} className="mr-3 text-red-500" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Informations personnelles
              </h2>
              <form onSubmit={handlePersonalInfoSubmit} className="mt-6 space-y-6">
                {message && (
                  <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input 
                      type="text" 
                      name="first-name" 
                      id="first-name" 
                      value={profileData.first_name} 
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Nom de famille
                    </label>
                    <input 
                      type="text" 
                      name="last-name" 
                      id="last-name" 
                      value={profileData.last_name} 
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      value={profileData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SaveIcon size={16} className="mr-2" />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Income Information */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Revenus mensuels
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Ces informations nous aident à personnaliser votre expérience
                budgétaire.
              </p>
              <form onSubmit={handleIncomeSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="monthly-income" className="block text-sm font-medium text-gray-700">
                      Revenu mensuel net
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input 
                        type="number" 
                        name="monthly-income" 
                        id="monthly-income" 
                        value={profileData.monthly_income} 
                        onChange={(e) => handleInputChange('monthly_income', parseFloat(e.target.value) || 0)}
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-3 pr-12" 
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Devise
                    </label>
                    <select 
                      id="currency" 
                      name="currency" 
                      value={profileData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CHF">CHF</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SaveIcon size={16} className="mr-2" />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Preferences */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Préférences</h2>
              <form onSubmit={handlePreferencesSubmit} className="mt-6 space-y-6">
                <div>
                  <label htmlFor="pref-currency" className="block text-sm font-medium text-gray-700">
                    Devise
                  </label>
                  <select 
                    id="pref-currency" 
                    name="pref-currency" 
                    value={profileData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                    Format de date
                  </label>
                  <select id="date-format" name="date-format" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Langue
                  </label>
                  <select id="language" name="language" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                    <option>Deutsch</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SaveIcon size={16} className="mr-2" />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default UserProfile;