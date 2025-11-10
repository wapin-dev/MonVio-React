// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCcwIcon,
  WalletIcon,
  TrendingDownIcon,
  PiggyBankIcon,
  CrownIcon,
  ArrowRightIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

interface AggregatedExpense {
  name: string;
  total: number;
  frequency: string;
  type: 'fixed' | 'variable';
}

interface ChartDatum {
  name: string;
  spent: number;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  });

const BudgetManagement: React.FC = () => {
  const { financialData, refreshFinancialData, isLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      if (!initialized && !financialData) {
        setIsRefreshing(true);
        await refreshFinancialData();
        setIsRefreshing(false);
        setInitialized(true);
      }
    };
    bootstrap();
  }, [financialData, initialized, refreshFinancialData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFinancialData();
    setIsRefreshing(false);
  };

  const expenses = useMemo(() => {
    if (!financialData) return [];
    return [...(financialData.fixed_expenses || []), ...(financialData.variable_expenses || [])];
  }, [financialData]);

  const aggregatedExpenses = useMemo<AggregatedExpense[]>(() => {
    const map = new Map<string, AggregatedExpense>();

    expenses.forEach((expense) => {
      const key = expense.name || `cat-${expense.id}`;
      const previous = map.get(key);
      const total = (previous?.total || 0) + (expense.amount || 0);
      const normalizedType: 'fixed' | 'variable' = expense.type === 'fixed' ? 'fixed' : 'variable';
      const frequency = expense.frequency || previous?.frequency || 'unique';

      map.set(key, {
        name: expense.name || previous?.name || 'Autre',
        total,
        frequency,
        type: normalizedType
      });
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [expenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
    [expenses]
  );

  const topCategory = aggregatedExpenses[0];

  const chartData = useMemo<ChartDatum[]>(
    () => aggregatedExpenses.slice(0, 6).map((item) => ({ name: item.name, spent: Math.round(item.total) })),
    [aggregatedExpenses]
  );

  if (isLoading && !financialData) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/60 to-gray-900/60 px-6 py-4 text-gray-300 shadow-xl">
          Chargement du suivi budgétaire...
        </div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-red-200 shadow-xl">
          Impossible de récupérer vos données budgétaires.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-3xl font-bold text-transparent">
            Suivi budgétaire mensuel
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Visualisez vos dépenses totales et identifiez la catégorie la plus consommatrice ce mois-ci.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcwIcon size={18} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-blue-900/10 p-6 text-blue-100 shadow-xl">
          <WalletIcon className="mb-4 h-10 w-10 text-blue-200/80" />
          <p className="text-sm font-medium uppercase tracking-wide text-blue-200/70">
            Budget mensuel disponible
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(financialData.monthly_income || financialData.total_income || 0)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-100/80">
            Revenus déclarés
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-purple-900/10 p-6 text-purple-100 shadow-xl">
          <TrendingDownIcon className="mb-4 h-10 w-10 text-purple-200/80" />
          <p className="text-sm font-medium uppercase tracking-wide text-purple-200/70">
            Dépenses mensuelles
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(totalSpent)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-100/80">
            Fixes: {formatCurrency(financialData.total_fixed_expenses || 0)} • Variables: {formatCurrency(financialData.total_variable_expenses || 0)}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/20 to-cyan-900/10 p-6 text-cyan-100 shadow-xl">
          <PiggyBankIcon className="mb-4 h-10 w-10 text-cyan-200/80" />
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-200/70">
            Budget restant
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency((financialData.monthly_income || financialData.total_income || 0) - totalSpent)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-100/80">
            Objectif épargne: {formatCurrency((financialData.monthly_income || 0) * 0.2)}
          </span>
        </div>

        {topCategory && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-amber-900/10 p-6 text-amber-100 shadow-xl">
            <CrownIcon className="mb-4 h-10 w-10 text-amber-200/80" />
            <p className="text-sm font-medium uppercase tracking-wide text-amber-200/70">
              Catégorie la plus dépensière
            </p>
            <p className="mt-2 text-2xl font-semibold">{topCategory.name}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-100/80">
              {formatCurrency(topCategory.total)}
              <span className="text-amber-100/60">
                {topCategory.type === 'fixed' ? 'Dépense fixe' : 'Dépense variable'}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Répartition des dépenses</h2>
              <p className="text-sm text-gray-400">Top 6 catégories ce mois-ci.</p>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="name" stroke="#cbd5f5" tick={{ fill: '#cbd5f5', fontSize: 12 }} interval={0} angle={-20} dy={10} />
                <YAxis
                  stroke="#cbd5f5"
                  tickFormatter={(value: number) => `${Math.round(value)}`}
                  tick={{ fill: '#cbd5f5', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Montant dépensé'] as [string, string]}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#e2e8f0'
                  }}
                />
                <Bar dataKey="spent" name="Dépensé" fill="#f472b6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Synthèse budgétaire</h2>
              <p className="text-sm text-gray-400">Analyse rapide de votre consommation.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm text-slate-100">
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300/80">Taux d’utilisation</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {((totalSpent / (financialData.monthly_income || financialData.total_income || 1)) * 100).toFixed(0)}%
                </p>
              </div>
              <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-200">
                {formatCurrency(totalSpent)} / {formatCurrency(financialData.monthly_income || financialData.total_income || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300/80">Dépenses fixes</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(financialData.total_fixed_expenses || 0)}
                </p>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">
                {financialData.fixed_expenses.length || 0} postes
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300/80">Dépenses variables</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {formatCurrency(financialData.total_variable_expenses || 0)}
                </p>
              </div>
              <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-100">
                {financialData.variable_expenses.length || 0} postes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Détails des dépenses</h2>
            <p className="text-sm text-gray-400">Liste des catégories suivies ce mois-ci.</p>
          </div>
          <span className="hidden rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100 sm:inline-flex">
            {aggregatedExpenses.length} catégories
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {aggregatedExpenses.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-600/60 bg-gray-800/30 p-8 text-center text-sm text-gray-400">
              Ajoutez vos dépenses fixes et variables pour suivre leur évolution ici.
            </div>
          )}
          {aggregatedExpenses.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5 text-slate-100 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{item.name}</h3>
                  <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                    item.type === 'fixed' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-pink-500/20 text-pink-200'
                  }`}>
                    {item.type === 'fixed' ? 'Dépense fixe' : 'Dépense variable'} • {item.frequency === 'monthly' ? 'Mensuel' : item.frequency === 'weekly' ? 'Hebdomadaire' : 'Occasionnel'}
                  </span>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-white">{formatCurrency(item.total)}</p>
                  <button className="mt-1 inline-flex items-center text-slate-300 transition hover:text-white">
                    Voir les transactions
                    <ArrowRightIcon size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetManagement;