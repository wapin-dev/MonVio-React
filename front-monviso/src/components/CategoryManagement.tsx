import React from 'react';
import { PlusIcon, EditIcon, TrashIcon, ChevronDownIcon } from 'lucide-react';
const CategoryManagement = () => {
  // Sample data
  const categories = [{
    id: 1,
    name: 'Logement',
    icon: '🏠',
    budget: 900,
    color: '#3b82f6',
    transactions: 5
  }, {
    id: 2,
    name: 'Alimentation',
    icon: '🛒',
    budget: 500,
    color: '#10b981',
    transactions: 12
  }, {
    id: 3,
    name: 'Transport',
    icon: '🚗',
    budget: 200,
    color: '#f59e0b',
    transactions: 8
  }, {
    id: 4,
    name: 'Loisirs',
    icon: '🎭',
    budget: 300,
    color: '#8b5cf6',
    transactions: 4
  }, {
    id: 5,
    name: 'Santé',
    icon: '⚕️',
    budget: 150,
    color: '#ec4899',
    transactions: 2
  }, {
    id: 6,
    name: 'Factures',
    icon: '📄',
    budget: 400,
    color: '#ef4444',
    transactions: 6
  }, {
    id: 7,
    name: 'Vêtements',
    icon: '👕',
    budget: 100,
    color: '#6366f1',
    transactions: 3
  }, {
    id: 8,
    name: 'Éducation',
    icon: '📚',
    budget: 200,
    color: '#0ea5e9',
    transactions: 1
  }, {
    id: 9,
    name: 'Cadeaux',
    icon: '🎁',
    budget: 50,
    color: '#d946ef',
    transactions: 2
  }, {
    id: 10,
    name: 'Revenus',
    icon: '💰',
    budget: null,
    color: '#22c55e',
    transactions: 2
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des catégories
        </h1>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <PlusIcon size={16} className="mr-2" />
          Nouvelle catégorie
        </button>
      </div>
      {/* Category Management */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">
                Liste des catégories
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Gérez vos catégories de dépenses et de revenus pour mieux
                organiser votre budget.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div className="relative">
                <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500">
                  <option>Toutes les catégories</option>
                  <option>Catégories de dépenses</option>
                  <option>Catégories de revenus</option>
                </select>
                <ChevronDownIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Icône
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Nom
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Couleur
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Budget mensuel
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Transactions
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map(category => <tr key={category.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-md text-lg">
                              {category.icon}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {category.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            <div className="h-5 w-5 rounded-full mr-2" style={{
                          backgroundColor: category.color
                        }}></div>
                            <span className="text-gray-500">
                              {category.color}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {category.budget ? `${category.budget} €` : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {category.transactions}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <EditIcon size={16} />
                            <span className="sr-only">
                              Modifier {category.name}
                            </span>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon size={16} />
                            <span className="sr-only">
                              Supprimer {category.name}
                            </span>
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Category Form */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Ajouter une nouvelle catégorie
          </h2>
          <form className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                  Nom de la catégorie
                </label>
                <input type="text" name="category-name" id="category-name" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="ex: Alimentation" />
              </div>
              <div>
                <label htmlFor="category-icon" className="block text-sm font-medium text-gray-700">
                  Icône
                </label>
                <select id="category-icon" name="category-icon" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <option value="🏠">🏠 Maison</option>
                  <option value="🛒">🛒 Courses</option>
                  <option value="🚗">🚗 Transport</option>
                  <option value="🎭">🎭 Loisirs</option>
                  <option value="⚕️">⚕️ Santé</option>
                  <option value="📄">📄 Factures</option>
                  <option value="👕">👕 Vêtements</option>
                  <option value="📚">📚 Éducation</option>
                  <option value="🎁">🎁 Cadeaux</option>
                  <option value="💰">💰 Revenus</option>
                </select>
              </div>
              <div>
                <label htmlFor="category-type" className="block text-sm font-medium text-gray-700">
                  Type de catégorie
                </label>
                <select id="category-type" name="category-type" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <option value="expense">Dépense</option>
                  <option value="income">Revenu</option>
                </select>
              </div>
              <div>
                <label htmlFor="category-budget" className="block text-sm font-medium text-gray-700">
                  Budget mensuel (€)
                </label>
                <input type="number" name="category-budget" id="category-budget" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="ex: 500" />
              </div>
              <div>
                <label htmlFor="category-color" className="block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <div className="mt-1 flex items-center">
                  <input type="color" name="category-color" id="category-color" defaultValue="#3b82f6" className="h-8 w-8 rounded-md border-gray-300 cursor-pointer" />
                  <input type="text" name="category-color-hex" className="ml-2 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="#3b82f6" />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Annuler
              </button>
              <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default CategoryManagement;