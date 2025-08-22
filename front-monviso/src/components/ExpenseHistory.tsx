import React, { useState } from 'react';
import { DownloadIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon, CalendarIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
const ExpenseHistory = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState('line');
  // Sample data
  const monthlyData = [{
    month: 'Jan',
    expenses: 2800,
    income: 3000,
    savings: 200
  }, {
    month: 'Fév',
    expenses: 3200,
    income: 3000,
    savings: -200
  }, {
    month: 'Mar',
    expenses: 2900,
    income: 3000,
    savings: 100
  }, {
    month: 'Avr',
    expenses: 3100,
    income: 3200,
    savings: 100
  }, {
    month: 'Mai',
    expenses: 2700,
    income: 3000,
    savings: 300
  }, {
    month: 'Juin',
    expenses: 3400,
    income: 3500,
    savings: 100
  }, {
    month: 'Juil',
    expenses: 3000,
    income: 3000,
    savings: 0
  }, {
    month: 'Août',
    expenses: 2500,
    income: 3000,
    savings: 500
  }, {
    month: 'Sep',
    expenses: 2800,
    income: 3000,
    savings: 200
  }, {
    month: 'Oct',
    expenses: 3200,
    income: 3200,
    savings: 0
  }, {
    month: 'Nov',
    expenses: 3300,
    income: 3000,
    savings: -300
  }, {
    month: 'Déc',
    expenses: 3600,
    income: 4000,
    savings: 400
  }];
  const categoryData = [{
    month: 'Jan',
    Logement: 900,
    Alimentation: 600,
    Transport: 200,
    Loisirs: 300,
    Factures: 400,
    Santé: 100,
    Autres: 300
  }, {
    month: 'Fév',
    Logement: 900,
    Alimentation: 650,
    Transport: 250,
    Loisirs: 350,
    Factures: 400,
    Santé: 150,
    Autres: 500
  }, {
    month: 'Mar',
    Logement: 900,
    Alimentation: 580,
    Transport: 220,
    Loisirs: 280,
    Factures: 400,
    Santé: 120,
    Autres: 400
  }, {
    month: 'Avr',
    Logement: 900,
    Alimentation: 620,
    Transport: 230,
    Loisirs: 320,
    Factures: 420,
    Santé: 110,
    Autres: 500
  }, {
    month: 'Mai',
    Logement: 900,
    Alimentation: 590,
    Transport: 210,
    Loisirs: 270,
    Factures: 400,
    Santé: 80,
    Autres: 250
  }, {
    month: 'Juin',
    Logement: 900,
    Alimentation: 650,
    Transport: 260,
    Loisirs: 400,
    Factures: 450,
    Santé: 140,
    Autres: 600
  }];
  // Colors for categories
  const categoryColors = {
    Logement: '#3b82f6',
    Alimentation: '#10b981',
    Transport: '#f59e0b',
    Loisirs: '#8b5cf6',
    Factures: '#ef4444',
    Santé: '#ec4899',
    Autres: '#6b7280'
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Historique des dépenses
        </h1>
        <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50">
          <DownloadIcon size={16} className="mr-2" />
          Exporter
        </button>
      </div>
      {/* Filters and Controls */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CalendarIcon size={16} className="text-gray-400" />
              </div>
              <select className="block w-full rounded-md border-gray-300 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500">
                <option>Année 2023</option>
                <option>Année 2022</option>
                <option>Année 2021</option>
                <option>Personnalisé</option>
              </select>
              <ChevronDownIcon size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-2 text-gray-500" />
              Filtres
              {showFilters ? <ChevronUpIcon size={16} className="ml-2 text-gray-500" /> : <ChevronDownIcon size={16} className="ml-2 text-gray-500" />}
            </button>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-sm text-gray-500">Type de graphique:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button onClick={() => setChartType('line')} className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 focus:z-10`}>
                Ligne
              </button>
              <button onClick={() => setChartType('bar')} className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300 focus:z-10`}>
                Barre
              </button>
            </div>
          </div>
        </div>
        {/* Expanded filters */}
        {showFilters && <div className="grid grid-cols-1 gap-4 rounded-md bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                Catégories
              </label>
              <select id="category-filter" className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500">
                <option>Toutes les catégories</option>
                <option>Logement</option>
                <option>Alimentation</option>
                <option>Transport</option>
                <option>Loisirs</option>
                <option>Factures</option>
                <option>Santé</option>
                <option>Autres</option>
              </select>
            </div>
            <div>
              <label htmlFor="data-type" className="block text-sm font-medium text-gray-700">
                Type de données
              </label>
              <select id="data-type" className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500">
                <option>Dépenses et revenus</option>
                <option>Dépenses seulement</option>
                <option>Revenus seulement</option>
                <option>Économies</option>
              </select>
            </div>
            <div>
              <label htmlFor="aggregation" className="block text-sm font-medium text-gray-700">
                Agrégation
              </label>
              <select id="aggregation" className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500">
                <option>Mensuelle</option>
                <option>Trimestrielle</option>
                <option>Annuelle</option>
              </select>
            </div>
          </div>}
      </div>
      {/* Main Chart */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Évolution des dépenses et revenus
          </h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={value => `${value} €`} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#3b82f6" name="Revenus" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Dépenses" strokeWidth={2} />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" name="Économies" strokeWidth={2} />
                </LineChart> : <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={value => `${value} €`} />
                  <Legend />
                  <Bar dataKey="income" fill="#3b82f6" name="Revenus" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
                  <Bar dataKey="savings" fill="#10b981" name="Économies" />
                </BarChart>}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Category Breakdown Chart */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            Répartition par catégorie
          </h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? <LineChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={value => `${value} €`} />
                  <Legend />
                  {Object.keys(categoryColors).map(category => <Line key={category} type="monotone" dataKey={category} stroke={categoryColors[category]} name={category} strokeWidth={2} />)}
                </LineChart> : <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={value => `${value} €`} />
                  <Legend />
                  {Object.keys(categoryColors).map(category => <Bar key={category} dataKey={category} fill={categoryColors[category]} name={category} />)}
                </BarChart>}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Summary Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Résumé annuel</h2>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Mois
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Revenus
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Dépenses
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                        Économies
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyData.map(item => <tr key={item.month}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {item.month}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-green-600 font-medium">
                          +{item.income} €
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-600 font-medium">
                          -{item.expenses} €
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm text-right font-medium ${item.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.savings >= 0 ? `+${item.savings} €` : `${item.savings} €`}
                        </td>
                      </tr>)}
                    <tr className="bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-0">
                        Total
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-green-600 font-bold">
                        +
                        {monthlyData.reduce((sum, item) => sum + item.income, 0)}{' '}
                        €
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-red-600 font-bold">
                        -
                        {monthlyData.reduce((sum, item) => sum + item.expenses, 0)}{' '}
                        €
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-green-600 font-bold">
                        +
                        {monthlyData.reduce((sum, item) => sum + item.savings, 0)}{' '}
                        €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default ExpenseHistory;