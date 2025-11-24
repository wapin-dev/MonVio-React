import React, { useEffect, useMemo, useState } from 'react';
import {
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  BarChart3,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { transactionService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const CATEGORY_PALETTE = ['#6366F1', '#22C55E', '#F97316', '#EC4899', '#0EA5E9', '#FACC15', '#94A3B8', '#A855F7', '#F43F5E', '#14B8A6'];

interface TransactionItem {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  frequency: string;
}

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : parseFloat(value);
};

const formatCurrency = (value: number): string =>
  toNumber(value).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  });

const ExpenseHistory: React.FC = () => {
  const { financialData } = useAuth();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dataView, setDataView] = useState<'all' | 'expenses' | 'income' | 'savings'>('all');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        
        // Charger les transactions manuelles
        const transactionsResponse = await transactionService.getAll();
        const manualTransactions: TransactionItem[] = (transactionsResponse.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          amount: toNumber(item.amount),
          type: item.type,
          date: item.date,
          category: item.category || 'Autres',
          frequency: item.frequency || 'unique'
        }));
        
        // Charger les données d'onboarding depuis financialData
        const onboardingTransactions: TransactionItem[] = [];
        const currentDate = new Date().toISOString().split('T')[0];
        
        if (financialData) {
          // Ajouter les revenus d'onboarding
          financialData.incomes?.forEach((income: any) => {
            onboardingTransactions.push({
              id: income.id,
              name: income.name,
              amount: toNumber(income.amount),
              type: 'income',
              date: currentDate,
              category: 'Revenus',
              frequency: income.frequency || 'mensuel'
            });
          });
          
          // Ajouter les dépenses fixes d'onboarding
          financialData.fixed_expenses?.forEach((expense: any) => {
            onboardingTransactions.push({
              id: expense.id,
              name: expense.name,
              amount: toNumber(expense.amount),
              type: 'expense',
              date: currentDate,
              category: expense.category_name || 'Dépenses fixes',
              frequency: expense.frequency || 'mensuel'
            });
          });
          
          // Ajouter les dépenses variables d'onboarding
          financialData.variable_expenses?.forEach((expense: any) => {
            onboardingTransactions.push({
              id: expense.id,
              name: expense.name,
              amount: toNumber(expense.amount),
              type: 'expense',
              date: currentDate,
              category: expense.category_name || 'Dépenses variables',
              frequency: expense.frequency || 'mensuel'
            });
          });
        }
        
        // Combiner toutes les transactions
        const allTransactions = [...onboardingTransactions, ...manualTransactions];
        setTransactions(allTransactions);
        setError(null);
        
        if (allTransactions.length > 0) {
          const newestYear = Math.max(
            ...allTransactions.map((transaction) => new Date(transaction.date).getFullYear())
          );
          setSelectedYear((prev) => prev ?? newestYear);
        }
      } catch (err) {
        console.error("Erreur de récupération de l'historique:", err);
        setError("Impossible de charger votre historique de dépenses pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [financialData]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach((transaction) => {
      years.add(new Date(transaction.date).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  useEffect(() => {
    if (!selectedYear && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        categories.add(transaction.category || 'Autres');
      });
    return Array.from(categories).sort();
  }, [transactions]);

  const categoryColors = useMemo(() => {
    const map = new Map<string, string>();
    allCategories.forEach((category, index) => {
      map.set(category, CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]);
    });
    return map;
  }, [allCategories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      if (selectedYear && transactionYear !== selectedYear) return false;
      if (dataView === 'expenses' && transaction.type !== 'expense') return false;
      if (dataView === 'income' && transaction.type !== 'income') return false;

      if (selectedCategories.length > 0 && transaction.type === 'expense') {
        return selectedCategories.includes(transaction.category || 'Autres');
      }

      return true;
    });
  }, [transactions, selectedYear, selectedCategories, dataView]);

  const monthlyData = useMemo(() => {
    const data = MONTH_LABELS.map((label, index) => {
      const monthTransactions = filteredTransactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date.getMonth() === index;
      });

      const income = monthTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const expenses = monthTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const savings = income - expenses;

      const payload: any = { month: label, income, expenses, savings };
      if (dataView === 'expenses') {
        payload.income = 0;
        payload.savings = -expenses;
      }
      if (dataView === 'income') {
        payload.expenses = 0;
        payload.savings = income;
      }
      if (dataView === 'savings') {
        payload.income = 0;
        payload.expenses = 0;
        payload.savings = savings;
      }

      return payload;
    });

    return data;
  }, [filteredTransactions, dataView]);

  const categoryData = useMemo(() => {
    const categories = selectedCategories.length > 0 ? selectedCategories : allCategories;
    return MONTH_LABELS.map((label, index) => {
      const entry: Record<string, number | string> = { month: label };
      categories.forEach((category) => {
        const value = filteredTransactions
          .filter((transaction) => {
            const date = new Date(transaction.date);
            return (
              transaction.type === 'expense' &&
              (transaction.category || 'Autres') === category &&
              date.getMonth() === index
            );
          })
          .reduce((sum, transaction) => sum + transaction.amount, 0);
        entry[category] = value;
      });
      return entry;
    });
  }, [filteredTransactions, allCategories, selectedCategories]);

  const totals = useMemo(() => {
    const totalIncome = monthlyData.reduce((sum, item) => sum + (item.income || 0), 0);
    const totalExpenses = monthlyData.reduce((sum, item) => sum + (item.expenses || 0), 0);
    const totalSavings = monthlyData.reduce((sum, item) => sum + (item.savings || 0), 0);
    return { totalIncome, totalExpenses, totalSavings };
  }, [monthlyData]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleExport = () => {
    const header = ['Date', 'Nom', 'Type', 'Montant', 'Catégorie', 'Fréquence'];
    const rows = filteredTransactions.map((transaction) => [
      new Date(transaction.date).toLocaleDateString('fr-FR'),
      transaction.name,
      transaction.type === 'income' ? 'Revenu' : 'Dépense',
      transaction.amount.toString().replace('.', ','),
      transaction.category,
      transaction.frequency
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(';'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historique-${selectedYear || 'tous'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-3xl font-bold text-transparent">
            Historique des dépenses
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Analysez vos flux financiers mois par mois et suivez l’évolution de vos catégories.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={filteredTransactions.length === 0}
          className="inline-flex items-center rounded-xl border border-blue-500/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} className="mr-2" />
          Exporter en CSV
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <select
                value={selectedYear ?? ''}
                onChange={(event) => setSelectedYear(Number(event.target.value) || null)}
                className="block w-full rounded-xl border border-slate-600/60 bg-slate-800/40 pl-10 pr-10 text-sm text-white focus:border-blue-400 focus:outline-none"
              >
                <option value="">Toutes les années</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="inline-flex items-center rounded-xl border border-slate-600/60 bg-slate-800/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
            >
              <Filter size={16} className="mr-2" />
              Filtres
              {showFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-400">Type de données</span>
            <div className="inline-flex rounded-xl border border-slate-600/60 bg-slate-800/40 p-1 text-xs text-slate-200">
              {[
                { key: 'all', label: 'Complet' },
                { key: 'expenses', label: 'Dépenses' },
                { key: 'income', label: 'Revenus' },
                { key: 'savings', label: 'Épargne' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setDataView(option.key as typeof dataView)}
                  className={`rounded-lg px-3 py-1 transition ${
                    dataView === option.key ? 'bg-blue-500/70 text-white' : 'hover:bg-slate-700/40'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-xl border border-slate-600/60 bg-slate-800/40 p-1 text-xs text-slate-200">
              <button
                onClick={() => setChartType('line')}
                className={`rounded-lg px-3 py-1 transition ${
                  chartType === 'line' ? 'bg-blue-500/70 text-white' : 'hover:bg-slate-700/40'
                }`}
              >
                Ligne
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`rounded-lg px-3 py-1 transition ${
                  chartType === 'bar' ? 'bg-blue-500/70 text-white' : 'hover:bg-slate-700/40'
                }`}
              >
                Barre
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-600/60 bg-slate-800/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">Catégories de dépenses</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSelectAllCategories}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    selectedCategories.length === 0
                      ? 'bg-blue-500/70 text-white'
                      : 'border border-slate-600/60 bg-slate-800/40 text-slate-200 hover:bg-slate-700/40'
                  }`}
                >
                  Toutes
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      selectedCategories.includes(category)
                        ? 'bg-blue-500/70 text-white'
                        : 'border border-slate-600/60 bg-slate-800/40 text-slate-200 hover:bg-slate-700/40'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Évolution des flux financiers</h2>
            <p className="text-sm text-gray-400">Comparaison revenus, dépenses et épargne pour {selectedYear ?? 'toutes les années'}.</p>
          </div>
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} />
                <YAxis stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} tickFormatter={(value) => `${Math.round(value)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#E2E8F0'
                  }}
                />
                <Legend />
                {dataView !== 'income' && dataView !== 'savings' && (
                  <Line type="monotone" dataKey="income" stroke="#3b82f6" name="Revenus" strokeWidth={2} />
                )}
                {dataView !== 'income' && (
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Dépenses" strokeWidth={2} />
                )}
                <Line type="monotone" dataKey="savings" stroke="#10b981" name="Épargne" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} />
                <YAxis stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} tickFormatter={(value) => `${Math.round(value)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#E2E8F0'
                  }}
                />
                <Legend />
                {dataView !== 'income' && dataView !== 'savings' && (
                  <Bar dataKey="income" fill="#3b82f6" name="Revenus" radius={[4, 4, 0, 0]} />
                )}
                {dataView !== 'income' && (
                  <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" radius={[4, 4, 0, 0]} />
                )}
                <Bar dataKey="savings" fill="#10b981" name="Épargne" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Répartition des dépenses par catégorie</h2>
        <p className="text-sm text-gray-400">Montants dépensés par mois pour chaque catégorie sélectionnée.</p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} />
                <YAxis stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} tickFormatter={(value) => `${Math.round(value)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#E2E8F0'
                  }}
                />
                <Legend />
                {(selectedCategories.length > 0 ? selectedCategories : allCategories).map((category) => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={categoryColors.get(category) || '#94A3B8'}
                    name={category}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} />
                <YAxis stroke="#CBD5F5" tick={{ fill: '#CBD5F5' }} tickFormatter={(value) => `${Math.round(value)}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#E2E8F0'
                  }}
                />
                <Legend />
                {(selectedCategories.length > 0 ? selectedCategories : allCategories).map((category) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    fill={categoryColors.get(category) || '#94A3B8'}
                    name={category}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white">Résumé {selectedYear ?? 'global'}</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-600/60">
          <div className="grid grid-cols-1 divide-y divide-slate-600/40 text-sm text-slate-200">
            <div className="grid grid-cols-3 gap-4 bg-slate-800/60 px-4 py-3 font-semibold uppercase tracking-wide text-xs text-slate-400">
              <span>Mois</span>
              <span className="text-right">Revenus</span>
              <span className="text-right">Dépenses</span>
            </div>
            {monthlyData.map((item) => (
              <div key={item.month} className="grid grid-cols-3 gap-4 px-4 py-3">
                <span className="font-medium text-white">{item.month}</span>
                <span className="text-right text-emerald-300">{formatCurrency(item.income || 0)}</span>
                <span className="text-right text-rose-300">{formatCurrency(item.expenses || 0)}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-4 bg-slate-800/60 px-4 py-3 font-semibold text-white">
              <span>Total</span>
              <span className="text-right text-emerald-300">{formatCurrency(totals.totalIncome)}</span>
              <span className="text-right text-rose-300">{formatCurrency(totals.totalExpenses)}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-3 text-white">
              <span>Solde</span>
              <span className="col-span-2 text-right text-blue-300">{formatCurrency(totals.totalIncome - totals.totalExpenses)}</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-slate-300">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Chargement des données historiques...
        </div>
      )}
    </div>
  );
};

export default ExpenseHistory;