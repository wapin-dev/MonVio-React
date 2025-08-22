import React from 'react';
import { PlusIcon, AlertCircleIcon, ChevronRightIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const BudgetManagement = () => {
  // Sample data
  const categories = [{
    id: 1,
    name: 'Logement',
    budget: 900,
    spent: 850,
    remaining: 50,
    percentage: 94,
    icon: '🏠',
    color: '#3b82f6'
  }, {
    id: 2,
    name: 'Alimentation',
    budget: 500,
    spent: 420,
    remaining: 80,
    percentage: 84,
    icon: '🛒',
    color: '#10b981'
  }, {
    id: 3,
    name: 'Transport',
    budget: 200,
    spent: 180,
    remaining: 20,
    percentage: 90,
    icon: '🚗',
    color: '#f59e0b'
  }, {
    id: 4,
    name: 'Loisirs',
    budget: 300,
    spent: 350,
    remaining: -50,
    percentage: 117,
    icon: '🎭',
    color: '#8b5cf6'
  }, {
    id: 5,
    name: 'Santé',
    budget: 150,
    spent: 75,
    remaining: 75,
    percentage: 50,
    icon: '⚕️',
    color: '#ec4899'
  }, {
    id: 6,
    name: 'Factures',
    budget: 400,
    spent: 390,
    remaining: 10,
    percentage: 98,
    icon: '📄',
    color: '#ef4444'
  }];
  const chartData = categories.map(category => ({
    name: category.name,
    Budget: category.budget,
    Dépensé: category.spent
  }));
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion du budget</h1>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <PlusIcon size={16} className="mr-2" />
          Nouvelle catégorie
        </button>
      </div>
      {/* Budget Overview */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Aperçu du budget mensuel
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={value => `${value} €`} />
                <Bar dataKey="Budget" fill="#3b82f6" />
                <Bar dataKey="Dépensé" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Budget Categories */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Catégories budgétaires
          </h2>
          <div className="mt-6 space-y-4">
            {categories.map(category => <div key={category.id} className="rounded-md border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md text-lg">
                      {category.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Budget: {category.budget} € | Dépensé: {category.spent}{' '}
                        €
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-right">
                      <p className={`text-sm font-medium ${category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.remaining >= 0 ? `Reste: ${category.remaining} €` : `Dépassé de: ${Math.abs(category.remaining)} €`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.percentage}% utilisé
                      </p>
                    </div>
                    <div className="w-24">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className={`h-2 rounded-full ${category.percentage >= 100 ? 'bg-red-600' : category.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{
                      width: `${Math.min(category.percentage, 100)}%`
                    }}></div>
                      </div>
                    </div>
                    <ChevronRightIcon size={20} className="ml-4 text-gray-400" />
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Budget Tips */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Conseils budgétaires
          </h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon size={20} className="text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention au budget Loisirs
                  </h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    Vous avez dépassé votre budget Loisirs de 50€. Pensez à
                    ajuster vos dépenses pour le reste du mois.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon size={20} className="text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Conseil: Règle des 50/30/20
                  </h3>
                  <p className="mt-2 text-sm text-blue-700">
                    Essayez d'allouer 50% de votre budget aux besoins
                    essentiels, 30% aux envies et 20% à l'épargne pour une
                    gestion financière équilibrée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BudgetManagement;