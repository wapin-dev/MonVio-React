// @ts-nocheck
import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
import { categoryService } from '../services/api';

interface CategoryBudget {
  id: number;
  name: string;
  color?: string;
  icon?: string;
  type: 'income' | 'expense';
  monthly_budget?: string | number | null;
}

interface AggregatedExpense {
  id: number | 'uncategorized';
  name: string;
  total: number;
  frequency: string;
  type: 'fixed' | 'variable';
  monthlyBudget: number | null;
  color?: string;
  icon?: string;
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

const toNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : parseFloat(value);
};

const BudgetManagement: React.FC = () => {
  const { financialData, refreshFinancialData, isLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoadingCategories(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const bootstrap = async () => {
      if (!initialized && !financialData) {
        setIsRefreshing(true);
        await refreshFinancialData();
        await loadCategories();
        setIsRefreshing(false);
        setInitialized(true);
      }
    };
    bootstrap();
  }, [financialData, initialized, refreshFinancialData, loadCategories]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshFinancialData(), loadCategories()]);
    setIsRefreshing(false);
  };

  const expenses = useMemo(() => {
    if (!financialData) return [];
    return [...(financialData.fixed_expenses || []), ...(financialData.variable_expenses || [])];
  }, [financialData]);

  const expensesByCategory = useMemo(() => {
    const map = new Map<number | 'uncategorized', { total: number; frequency: string }>;
    expenses.forEach((expense) => {
      const key = expense.category_id ?? 'uncategorized';
      const existing = map.get(key);
      const total = (existing?.total || 0) + (expense.amount || 0);
      const frequency = expense.frequency || existing?.frequency || 'unique';
      map.set(key, { total, frequency });
    });
    return map;
  }, [expenses]);

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories]
  );

  const aggregatedExpenses = useMemo<AggregatedExpense[]>(() => {
    const list: AggregatedExpense[] = expenseCategories.map((category) => {
      const stats = expensesByCategory.get(category.id);
      const monthlyBudget = category.monthly_budget != null ? toNumber(category.monthly_budget) : null;
      return {
        id: category.id,
        name: category.name,
        total: stats?.total || 0,
        frequency: stats?.frequency || 'unique',
        type: 'fixed',
        monthlyBudget,
        color: category.color || '#6366F1',
        icon: category.icon || '💳'
      };
    });

    const uncategorized = expensesByCategory.get('uncategorized');
    if (uncategorized && uncategorized.total > 0) {
      list.push({
        id: 'uncategorized',
        name: 'Non catégorisé',
        total: uncategorized.total,
        frequency: uncategorized.frequency,
        type: 'variable',
        monthlyBudget: null,
        color: '#94A3B8',
        icon: '📦'
      });
    }

    // Include any expense that belongs to a category not present (e.g., deleted)
    expenses.forEach((expense) => {
      if (expense.category_id && !expenseCategories.find((cat) => cat.id === expense.category_id)) {
        const existing = list.find((item) => item.id === expense.category_id);
        if (existing) {
          existing.total += expense.amount || 0;
        } else {
          list.push({
            id: expense.category_id,
            name: expense.category_name || 'Catégorie inconnue',
            total: expense.amount || 0,
            frequency: expense.frequency || 'unique',
            type: 'variable',
            monthlyBudget: null,
            color: '#94A3B8',
            icon: '📦'
          });
        }
      }
    });

    return list.sort((a, b) => b.total - a.total);
  }, [expenseCategories, expensesByCategory, expenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
    [expenses]
  );

  const totalBudget = useMemo(
    () => aggregatedExpenses.reduce((sum, item) => sum + (item.monthlyBudget || 0), 0),
    [aggregatedExpenses]
  );

  const budgetDelta = totalBudget ? totalBudget - totalSpent : null;

  const monthlyIncome = useMemo(
    () => toNumber(financialData?.monthly_income ?? financialData?.total_income ?? 0),
    [financialData]
  );

  const topCategory = aggregatedExpenses[0];

  const chartData = useMemo<ChartDatum[]>(
    () => aggregatedExpenses.slice(0, 6).map((item) => ({ name: item.name, spent: Math.round(item.total) })),
    [aggregatedExpenses]
  );

  if ((isLoading && !financialData) || isLoadingCategories) {
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
            Visualisez vos budgets catégoriels, les montants dépensés et les postes à surveiller.
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
            Revenus mensuels
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(monthlyIncome)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-100/80">
            Basé sur votre profil
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 to-indigo-900/10 p-6 text-indigo-100 shadow-xl">
          <PiggyBankIcon className="mb-4 h-10 w-10 text-indigo-200/80" />
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-200/70">
            Budgets définis
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {formatCurrency(totalBudget)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100/80">
            {aggregatedExpenses.filter((item) => item.monthlyBudget !== null).length} catégories budgétées
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

        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-emerald-900/10 p-6 text-emerald-100 shadow-xl">
          <PiggyBankIcon className="mb-4 h-10 w-10 text-emerald-200/80" />
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-200/70">
            Écart budget / dépenses
          </p>
          <p className={`mt-2 text-2xl font-semibold ${budgetDelta !== null && budgetDelta < 0 ? 'text-rose-200' : ''}`}>
            {budgetDelta !== null ? formatCurrency(budgetDelta) : '—'}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100/80">
            {budgetDelta !== null
              ? budgetDelta >= 0
                ? 'Sous le budget global'
                : 'Au-dessus du budget global'
              : 'Aucun budget total défini'}
          </span>
        </div>
      </div>

      {topCategory && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-5 text-amber-100">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: `${topCategory.color || '#F59E0B'}20` }}
            >
              {topCategory.icon || '💡'}
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-amber-200/70">Catégorie la plus dépensière</p>
              <h2 className="text-xl font-semibold text-amber-50">{topCategory.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">
                  Dépenses: {formatCurrency(topCategory.total)}
                </span>
                {topCategory.monthlyBudget !== null && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-100/80">
                    Budget: {formatCurrency(topCategory.monthlyBudget)}
                  </span>
                )}
                {topCategory.monthlyBudget !== null && (
                  <span className={`rounded-full px-3 py-1 text-xs ${topCategory.total <= topCategory.monthlyBudget ? 'bg-emerald-500/20 text-emerald-100' : 'bg-rose-500/20 text-rose-100'}`}>
                    {topCategory.total <= topCategory.monthlyBudget
                      ? 'Dans le budget'
                      : `Dépassé de ${formatCurrency(topCategory.total - topCategory.monthlyBudget)}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {((totalSpent / (totalBudget || monthlyIncome || 1)) * 100).toFixed(0)}%
                </p>
              </div>
              <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs text-slate-200">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget || monthlyIncome || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300/80">Budgets respectés</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {aggregatedExpenses.filter((item) => item.monthlyBudget !== null && item.total <= (item.monthlyBudget || 0)).length} / {aggregatedExpenses.filter((item) => item.monthlyBudget !== null).length}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100">
                {formatCurrency(Math.max(totalBudget - totalSpent, 0))} restant
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300/80">Catégories en dépassement</p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {aggregatedExpenses.filter((item) => item.monthlyBudget !== null && item.total > (item.monthlyBudget || 0)).length}
                </p>
              </div>
              <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-100">
                {formatCurrency(Math.max(totalSpent - totalBudget, 0))} au-delà
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Catégories de dépenses</h2>
            <p className="text-sm text-gray-400">Budgets mensuels vs dépenses réelles.</p>
          </div>
          <span className="hidden rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100 sm:inline-flex">
            {aggregatedExpenses.length} catégories
          </span>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {aggregatedExpenses.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-600/60 bg-gray-800/30 p-8 text-center text-sm text-gray-400">
              Ajoutez vos dépenses ou définissez des budgets dans "Catégories" pour alimenter ce tableau.
            </div>
          )}
          {aggregatedExpenses.map((item) => {
            const usage = item.monthlyBudget ? Math.min(100, Math.round((item.total / item.monthlyBudget) * 100)) : null;
            const delta = item.monthlyBudget !== null ? item.monthlyBudget - item.total : null;
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5 text-slate-100 backdrop-blur-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                      style={{ backgroundColor: `${item.color || '#6366F1'}20`, color: item.color || '#6366F1' }}
                    >
                      {item.icon || '💳'}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.name}</h3>
                      <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                        item.type === 'fixed' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-pink-500/20 text-pink-200'
                      }`}>
                        {item.type === 'fixed' ? 'Dépense fixe' : 'Dépense variable'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-white">{formatCurrency(item.total)}</p>
                    {item.monthlyBudget !== null && (
                      <p className="text-xs text-slate-300">Budget {formatCurrency(item.monthlyBudget)}</p>
                    )}
                    {delta !== null && (
                      <p className={`text-xs ${delta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {delta >= 0 ? `Reste ${formatCurrency(delta)}` : `Dépassé de ${formatCurrency(Math.abs(delta))}`}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Utilisation</span>
                    <span>{usage !== null ? `${usage}%` : '—'}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700/60">
                    <div
                      className={`h-full rounded-full ${
                        usage !== null
                          ? usage >= 100
                            ? 'bg-rose-500'
                            : usage >= 85
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${usage !== null ? usage : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{item.frequency === 'monthly' ? 'Mensuel' : item.frequency === 'weekly' ? 'Hebdomadaire' : 'Occasionnel'}</span>
                  <button className="inline-flex items-center text-slate-300 transition hover:text-white">
                    Voir les transactions
                    <ArrowRightIcon size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetManagement;