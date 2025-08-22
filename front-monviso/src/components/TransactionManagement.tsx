import React, { useState } from 'react';
import { PlusIcon, FilterIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, EditIcon } from 'lucide-react';
const TransactionManagement = () => {
  const [showFilters, setShowFilters] = useState(false);
  // Sample data
  const transactions = [{
    id: 1,
    description: 'Supermarché Casino',
    amount: -87.45,
    category: 'Alimentation',
    date: '2023-06-15',
    paymentMethod: 'Carte Bancaire'
  }, {
    id: 2,
    description: 'Loyer Appartement',
    amount: -850.0,
    category: 'Logement',
    date: '2023-06-10',
    paymentMethod: 'Prélèvement'
  }, {
    id: 3,
    description: 'Salaire',
    amount: 2400.0,
    category: 'Revenus',
    date: '2023-06-05',
    paymentMethod: 'Virement'
  }, {
    id: 4,
    description: 'SNCF',
    amount: -47.8,
    category: 'Transport',
    date: '2023-06-03',
    paymentMethod: 'Carte Bancaire'
  }, {
    id: 5,
    description: 'Restaurant Le Petit Bistro',
    amount: -35.9,
    category: 'Restauration',
    date: '2023-06-02',
    paymentMethod: 'Carte Bancaire'
  }, {
    id: 6,
    description: 'Cinéma Pathé',
    amount: -12.5,
    category: 'Loisirs',
    date: '2023-06-01',
    paymentMethod: 'Carte Bancaire'
  }, {
    id: 7,
    description: 'Pharmacie',
    amount: -23.4,
    category: 'Santé',
    date: '2023-05-28',
    paymentMethod: 'Carte Bancaire'
  }, {
    id: 8,
    description: 'EDF',
    amount: -78.35,
    category: 'Factures',
    date: '2023-05-25',
    paymentMethod: 'Prélèvement'
  }, {
    id: 9,
    description: 'Abonnement Internet',
    amount: -39.99,
    category: 'Factures',
    date: '2023-05-22',
    paymentMethod: 'Prélèvement'
  }, {
    id: 10,
    description: 'Prime',
    amount: 300.0,
    category: 'Revenus',
    date: '2023-05-20',
    paymentMethod: 'Virement'
  }];
  const categories = ['Toutes les catégories', 'Alimentation', 'Logement', 'Transport', 'Loisirs', 'Santé', 'Factures', 'Revenus', 'Restauration'];
  const paymentMethods = ['Tous les moyens', 'Carte Bancaire', 'Espèces', 'Virement', 'Prélèvement', 'Chèque'];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
          Gestion des transactions
        </h1>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-700/20 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
          <PlusIcon size={16} className="mr-2" />
          Nouvelle transaction
        </button>
      </div>
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="text" placeholder="Rechercher des transactions..." className="block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md pl-10 pr-4 py-2.5 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10" />
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center rounded-xl bg-gray-800/50 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-gray-100 shadow-lg shadow-black/10 border border-gray-700/50 hover:bg-gray-700/50 transition-colors">
              <FilterIcon size={16} className="mr-2 text-blue-400" />
              Filtres
              {showFilters ? <ChevronUpIcon size={16} className="ml-2 text-gray-400" /> : <ChevronDownIcon size={16} className="ml-2 text-gray-400" />}
            </button>
            <select className="rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2.5 px-4 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-black/10">
              <option>Ce mois</option>
              <option>Mois précédent</option>
              <option>Les 3 derniers mois</option>
              <option>Cette année</option>
              <option>Personnalisé</option>
            </select>
          </div>
        </div>
        {/* Expanded filters */}
        {showFilters && <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-800/30 backdrop-blur-md p-5 sm:grid-cols-2 md:grid-cols-4 border border-gray-700/50 shadow-lg shadow-black/10">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-300">
                Catégorie
              </label>
              <select id="category-filter" className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10">
                {categories.map(category => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="payment-method-filter" className="block text-sm font-medium text-gray-300">
                Moyen de paiement
              </label>
              <select id="payment-method-filter" className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10">
                {paymentMethods.map(method => <option key={method}>{method}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="min-amount" className="block text-sm font-medium text-gray-300">
                Montant minimum
              </label>
              <input type="number" id="min-amount" className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" placeholder="0" />
            </div>
            <div>
              <label htmlFor="max-amount" className="block text-sm font-medium text-gray-300">
                Montant maximum
              </label>
              <input type="number" id="max-amount" className="mt-1 block w-full rounded-xl border-0 bg-gray-800/50 backdrop-blur-md py-2 px-3 text-gray-100 focus:ring-2 focus:ring-blue-500/50 shadow-md shadow-black/10" placeholder="5000" />
            </div>
          </div>}
      </div>
      {/* Transactions table */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/30">
            <thead className="bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Date
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Description
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Catégorie
                </th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Moyen de paiement
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
                  Montant
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30 bg-transparent">
              {transactions.map(transaction => <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-100">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {transaction.paymentMethod}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount >= 0 ? `+${transaction.amount.toFixed(2)} €` : `${transaction.amount.toFixed(2)} €`}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button className="text-blue-400 hover:text-blue-300 mr-3 transition-colors">
                      <EditIcon size={16} />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-800/50 px-4 py-3 flex items-center justify-between border-t border-gray-700/30">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
              Précédent
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700/50 text-sm font-medium rounded-xl text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-300">
                Affichage de{' '}
                <span className="font-medium text-gray-100">1</span> à{' '}
                <span className="font-medium text-gray-100">10</span> sur{' '}
                <span className="font-medium text-gray-100">20</span>{' '}
                transactions
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-xl border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  <span className="sr-only">Précédent</span>
                  <ChevronUpIcon size={16} className="rotate-90" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-700/50 bg-blue-600/50 text-sm font-medium text-blue-200 hover:bg-blue-700/50 transition-colors">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-xl border border-gray-700/50 bg-gray-800/50 text-sm font-medium text-gray-300 hover:bg-gray-700/50 transition-colors">
                  <span className="sr-only">Suivant</span>
                  <ChevronDownIcon size={16} className="rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default TransactionManagement;