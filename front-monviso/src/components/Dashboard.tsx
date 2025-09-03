import React, { useEffect, useState } from 'react';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, PiggyBankIcon, AlertCircleIcon, ArrowRightIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface FinancialData {
  monthly_income: number;
  total_income: number;
  total_expenses: number;
  total_fixed_expenses: number;
  total_variable_expenses: number;
  remaining_budget: number;
  incomes: Income[];
  fixed_expenses: Expense[];
  variable_expenses: Expense[];
  savings_goals: SavingsGoal[];
}

interface Income {
  id: number;
  name: string;
  amount: number;
  type: string;
  frequency: string;
  is_primary: boolean;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
  frequency: string;
  type: string;
}

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  type: string;
  priority: string;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface BarDataItem {
  name: string;
  amount: number;
  color: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [barData, setBarData] = useState<BarDataItem[]>([]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardService.getFinancialData();
      setFinancialData(response.data);

      // Create pie chart data from expenses
      const fixedColors = [
        '#6366f1', // indigo-500
        '#a78bfa', // purple-400
        '#f472b6', // pink-400
        '#facc15', // yellow-400
        '#34d399', // green-400
        '#f87171', // red-400
        '#60a5fa', // blue-400
      ];
      const variableColors = [
        '#3b82f6', // blue-500
        '#06b6d4', // cyan-500
        '#f59e42', // orange-400
        '#fbbf24', // yellow-400
        '#10b981', // emerald-500
        '#818cf8', // indigo-400
        '#c084fc', // purple-400
      ];

      const pieData = [
        ...response.data.fixed_expenses.map((expense: Expense, i: number) => ({
          name: expense.name,
          value: expense.amount,
          color: fixedColors[i % fixedColors.length],
        })),
        ...response.data.variable_expenses.map((expense: Expense, i: number) => ({
          name: expense.name,
          value: expense.amount,
          color: variableColors[i % variableColors.length],
        })),
      ];
      setPieData(pieData);

      // Create bar chart data (revenues, fixed expenses, variable expenses)
    const barData = [
      { name: 'Revenus', amount: response.data.total_income, color: '#a78bfa', type: 'revenus'},
      { name: 'Dépenses fixes', amount: response.data.total_fixed_expenses, color: '#f472b6', type: 'depenses_fixes' },
      { name: 'Dépenses variables', amount: response.data.total_variable_expenses, color: '#6366f1', type: 'depenses_variables' }
    ];
      setBarData(barData);

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const chartColors = {
    budget: '#60a5fa',
    expenses: '#f87171',
    income: '#34d399',
    savings: '#a78bfa',
    background: 'rgba(15, 23, 42, 0.6)',
    gridLines: 'rgba(148, 163, 184, 0.2)',
    text: '#e2e8f0'
  };
 console.log(financialData?.fixed_expenses);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
          Tableau de bord
        </h1>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-300">Période:</span>
          <select className="rounded-lg border-0 bg-gray-800/50 backdrop-blur-md py-1.5 px-4 text-gray-100 focus:border-blue-500 focus:ring-blue-500 shadow-lg shadow-black/10">
            <option>Ce mois</option>
            <option>Mois précédent</option>
            <option>Les 3 derniers mois</option>
            <option>Cette année</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-500/10 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20">
                <DollarSignIcon size={20} className="text-blue-100" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Solde actuel
                  </dt>
                  <dd className="text-lg font-semibold text-white">
                    {financialData?.remaining_budget?.toFixed(2) || '0.00'} €
                  </dd>

                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-red-500/10 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/20">
                <TrendingDownIcon size={20} className="text-red-100" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Dépenses du mois
                  </dt>
                  <dd className="text-lg font-semibold text-white">
                    {financialData ? financialData.total_expenses.toFixed(2) : 0} €
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-green-500/10 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-600/20">
                <TrendingUpIcon size={20} className="text-green-100" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Revenus du mois
                  </dt>
                  <dd className="text-lg font-semibold text-white">
                    {financialData?.monthly_income ? financialData.monthly_income.toFixed(2) : '0.00'} €
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl"></div>
            <div className="flex items-center relative z-10">
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-600/20">
                <PiggyBankIcon size={20} className="text-purple-100" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">
                    Économies
                  </dt>
                  <dd className="text-lg font-semibold text-white">
                  {financialData ? (financialData.remaining_budget * 0.20).toFixed(2) : '0.00'} €
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Expense Distribution */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="px-4 py-5 sm:p-6 relative">
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
            <h3 className="text-lg font-medium text-gray-100 relative z-10">
              Répartition des dépenses
            </h3>
            <div className="mt-4 flex flex-col items-center relative z-10">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                    name,
                    percent
                  }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0, 0, 0, 0.2)" strokeWidth={0} />)}
                    </Pie>
                    <Tooltip contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    borderColor: 'rgba(100, 116, 139, 0.3)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(8px)',
                    color: '#60a5fa',
                    fontWeight: 'bold'
                  }} formatter={value => [`${value} €`, null]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                {pieData.map(item => <div key={item.name} className="flex items-center">
                    <div className="h-3 w-3 rounded-full shadow-lg" style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 10px ${item.color}80`
                }}></div>
                    <span className="ml-2 text-xs text-gray-300">
                      {item.name}: {item.value} €
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
        {/* Monthly Budget vs Expenses */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="px-4 py-5 sm:p-6 relative">
            <div className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-green-500/10 blur-3xl"></div>
            <h3 className="text-lg font-medium text-gray-100 relative z-10">
              Budget vs Dépenses
            </h3>
            <div className="mt-4 relative z-10">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridLines} />
                    <XAxis dataKey="name" stroke={chartColors.text} />
                    <YAxis stroke={chartColors.text} />
                    <Tooltip contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      borderColor: 'rgba(100, 116, 139, 0.3)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                      backdropFilter: 'blur(8px)',
                      color: '#e2e8f0'
                    }} 
                      formatter={(value: any, name: any, props: any) => {
                        const item = barData.find((item) => item.name === props.payload.name);
                        const color = item ? item.color : 'white';
                        return [`${value} €`, <span style={{ color }}>{props.payload.name}</span>];
                      }} />
                    <Bar dataKey="amount" name="Montants">
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Alerts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="px-4 py-5 sm:p-6 relative">
            <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-blue-500/5 blur-3xl"></div>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-lg font-medium text-gray-100">
                Transactions récentes
              </h3>
              <Link to="/transactions" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                Voir tout <ArrowRightIcon size={16} className="ml-1" />
              </Link>
            </div>
            <div className="mt-4 flow-root relative z-10">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700/30">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0">
                          Description
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                          Catégorie
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">
                          Montant
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30 bg-transparent">
                      {[...financialData?.incomes ?? [], ...financialData?.fixed_expenses ?? [], ...financialData?.variable_expenses ?? []].map((item: Income | Expense) =>  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-0">
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            {item.type == 'salary' ? 'Revenu' : 'Dépense'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            {item.frequency == 'monthly' ? 'Mensuel' : item.frequency == 'yearly' ? 'Annuel' : 'Unique'}
                          </td>
                          <td className={`whitespace-nowrap px-3 py-4 text-sm text-right ${item.type === 'salary' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}`}>
                            {item.type === 'salary' ? `+${item.amount.toFixed(2)} €` : `- ${Math.abs(item.amount).toFixed(2)} €`}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Alerts & Tips */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700/50 shadow-xl">
          <div className="px-4 py-5 sm:p-6 relative">
            <div className="absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-yellow-500/5 blur-3xl"></div>
            <h3 className="text-lg font-medium text-gray-100 relative z-10">
              Alertes & Conseils
            </h3>
            <div className="mt-4 space-y-4 relative z-10">
              {financialData && financialData.fixed_expenses.map((expense: Expense) => (
                <div key={expense.id} className="rounded-xl bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 p-4 shadow-lg shadow-yellow-500/5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircleIcon size={20} className="text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-200">
                        Vous avez dépassé votre budget {expense.name} de {expense.amount}€
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 p-4 shadow-lg shadow-blue-500/5">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <PiggyBankIcon size={20} className="text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-200">
                      Conseil: Essayez de mettre de côté 10% de vos revenus
                      mensuels pour vos économies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;