import React from 'react';
import { SaveIcon, UserIcon, BellIcon, LockIcon, LogOutIcon, CreditCardIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  
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
                <button className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
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
              <form className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input type="text" name="first-name" id="first-name" defaultValue={user?.first_name || 'Inconnue'} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Nom de famille
                    </label>
                    <input type="text" name="last-name" id="last-name" defaultValue={user?.last_name || 'Inconnue'} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input type="email" name="email" id="email" defaultValue={user?.email || 'jean.dupont@example.com'} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                    <SaveIcon size={16} className="mr-2" />
                    Enregistrer
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
              <form className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="monthly-income" className="block text-sm font-medium text-gray-700">
                      Revenu mensuel net
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input type="text" name="monthly-income" id="monthly-income" defaultValue={user?.monthly_income?.toString() || '0'} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-3 pr-12" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="income-frequency" className="block text-sm font-medium text-gray-700">
                      Fréquence
                    </label>
                    <select id="income-frequency" name="income-frequency" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <option>Mensuel</option>
                      <option>Bimensuel</option>
                      <option>Hebdomadaire</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="additional-income" className="block text-sm font-medium text-gray-700">
                      Revenus complémentaires (optionnel)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input type="text" name="additional-income" id="additional-income" defaultValue="300" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-3 pr-12" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="additional-frequency" className="block text-sm font-medium text-gray-700">
                      Fréquence des revenus complémentaires
                    </label>
                    <select id="additional-frequency" name="additional-frequency" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <option>Mensuel</option>
                      <option>Trimestriel</option>
                      <option>Annuel</option>
                      <option>Irrégulier</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                    <SaveIcon size={16} className="mr-2" />
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Preferences */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Préférences</h2>
              <form className="mt-6 space-y-6">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Devise
                  </label>
                  <select id="currency" name="currency" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                    <option>CHF</option>
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
                  <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                    <SaveIcon size={16} className="mr-2" />
                    Enregistrer
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