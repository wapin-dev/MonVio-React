import React from 'react';
import { PlusIcon, CheckIcon, XIcon, EditIcon, TrashIcon } from 'lucide-react';
const PresetManagement = () => {
  // Sample data
  const categoryPresets = [{
    id: 1,
    name: 'Catégories standard',
    description: 'Ensemble de catégories de base pour la gestion budgétaire',
    count: 8,
    isApplied: true
  }, {
    id: 2,
    name: 'Catégories détaillées',
    description: 'Ensemble complet de catégories avec sous-catégories',
    count: 15,
    isApplied: false
  }, {
    id: 3,
    name: 'Budget étudiant',
    description: 'Catégories adaptées aux étudiants',
    count: 6,
    isApplied: false
  }, {
    id: 4,
    name: 'Budget familial',
    description: 'Catégories pour les dépenses familiales',
    count: 12,
    isApplied: false
  }];
  const transactionPresets = [{
    id: 1,
    name: 'Factures mensuelles',
    description: 'Transactions récurrentes pour les factures mensuelles',
    count: 5,
    isApplied: true
  }, {
    id: 2,
    name: 'Abonnements',
    description: 'Transactions pour les abonnements courants',
    count: 7,
    isApplied: false
  }, {
    id: 3,
    name: 'Dépenses automobiles',
    description: "Transactions liées à l'entretien automobile",
    count: 4,
    isApplied: false
  }];
  const sampleCategories = [{
    name: 'Logement',
    icon: '🏠',
    budget: 900
  }, {
    name: 'Alimentation',
    icon: '🛒',
    budget: 500
  }, {
    name: 'Transport',
    icon: '🚗',
    budget: 200
  }, {
    name: 'Loisirs',
    icon: '🎭',
    budget: 300
  }, {
    name: 'Santé',
    icon: '⚕️',
    budget: 150
  }, {
    name: 'Factures',
    icon: '📄',
    budget: 400
  }, {
    name: 'Vêtements',
    icon: '👕',
    budget: 100
  }, {
    name: 'Éducation',
    icon: '📚',
    budget: 200
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Préréglages</h1>
      </div>
      {/* Category Presets */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">
                Préréglages de catégories
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Utilisez des ensembles prédéfinis de catégories pour configurer
                rapidement votre budget.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <PlusIcon size={16} className="mr-2" />
                Nouveau préréglage
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Nom
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Catégories
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categoryPresets.map(preset => <tr key={preset.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {preset.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {preset.description}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {preset.count} catégories
                        </td>
                        <td className="px-3 py-4 text-sm">
                          {preset.isApplied ? <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckIcon size={12} className="mr-1" />
                              Appliqué
                            </span> : <button className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                              Appliquer
                            </button>}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <EditIcon size={16} />
                            <span className="sr-only">
                              Modifier {preset.name}
                            </span>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon size={16} />
                            <span className="sr-only">
                              Supprimer {preset.name}
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
      {/* Transaction Presets */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">
                Préréglages de transactions
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Utilisez des ensembles prédéfinis de transactions récurrentes
                pour gagner du temps.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
                <PlusIcon size={16} className="mr-2" />
                Nouveau préréglage
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Nom
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Transactions
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactionPresets.map(preset => <tr key={preset.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {preset.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {preset.description}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {preset.count} transactions
                        </td>
                        <td className="px-3 py-4 text-sm">
                          {preset.isApplied ? <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckIcon size={12} className="mr-1" />
                              Appliqué
                            </span> : <button className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                              Appliquer
                            </button>}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <EditIcon size={16} />
                            <span className="sr-only">
                              Modifier {preset.name}
                            </span>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon size={16} />
                            <span className="sr-only">
                              Supprimer {preset.name}
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
      {/* Preview */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Aperçu des catégories standard
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Voici les catégories incluses dans le préréglage "Catégories
            standard".
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {sampleCategories.map(category => <div key={category.name} className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md text-lg">
                    {category.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Budget: {category.budget} €
                    </p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Create New Preset */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Créer un nouveau préréglage
          </h2>
          <form className="mt-6 space-y-6">
            <div>
              <label htmlFor="preset-type" className="block text-sm font-medium text-gray-700">
                Type de préréglage
              </label>
              <select id="preset-type" name="preset-type" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <option>Préréglage de catégories</option>
                <option>Préréglage de transactions</option>
              </select>
            </div>
            <div>
              <label htmlFor="preset-name" className="block text-sm font-medium text-gray-700">
                Nom du préréglage
              </label>
              <input type="text" name="preset-name" id="preset-name" className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="ex: Mes catégories personnalisées" />
            </div>
            <div>
              <label htmlFor="preset-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea id="preset-description" name="preset-description" rows={3} className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" placeholder="Décrivez brièvement ce préréglage..."></textarea>
            </div>
            <div className="flex justify-end">
              <button type="button" className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Annuler
              </button>
              <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Créer et configurer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default PresetManagement;