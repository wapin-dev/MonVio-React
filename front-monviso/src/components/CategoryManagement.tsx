import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Palette,
  Wallet
} from 'lucide-react';
import { categoryService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { AxiosError } from 'axios';

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  return typeof value === 'number' ? value : parseFloat(value);
};

const formatCurrency = (value: number | null | undefined): string =>
  toNumber(value).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  });

interface ApiCategory {
  id: number;
  name: string;
  type: 'income' | 'expense';
  monthly_budget?: string | number | null;
  color?: string | null;
  icon?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface CategoryWithStats {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  monthlyBudget: number | null;
  spent: number;
  delta: number | null;
  usage: number | null;
}

interface CategoryFormState {
  name: string;
  icon: string;
  type: 'income' | 'expense';
  monthlyBudget: string;
  color: string;
}

const DEFAULT_FORM: CategoryFormState = {
  name: '',
  icon: '💳',
  type: 'expense',
  monthlyBudget: '',
  color: '#6366F1'
};

const CategoryManagement: React.FC = () => {
  const { financialData, refreshFinancialData } = useAuth();
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAll();
      const apiCategories: ApiCategory[] = response.data || [];
      const spentByCategory = buildSpentMap(financialData);

      const enriched = apiCategories.map<CategoryWithStats>((cat) => {
        const monthlyBudget = cat.monthly_budget != null ? toNumber(cat.monthly_budget) : null;
        const spent = cat.type === 'expense' ? spentByCategory.get(cat.id) || 0 : 0;
        const delta = monthlyBudget != null ? monthlyBudget - spent : null;
        const usage = monthlyBudget && monthlyBudget > 0 ? Math.min(100, (spent / monthlyBudget) * 100) : null;
        const color = cat.color || '#6366F1';
        const icon = cat.icon || '💳';
        return {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          icon,
          color,
          monthlyBudget,
          spent,
          delta,
          usage
        };
      });

      setCategories(enriched);
      setError(null);
    } catch (err) {
      console.error('Erreur de récupération des catégories:', err);
      setError('Impossible de charger les catégories pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshFinancialData();
      await loadCategories();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Recalculer les dépenses quand les données financières changent
      const spentByCategory = buildSpentMap(financialData);
      setCategories((prev) =>
        prev.map((cat) => {
          const spent = cat.type === 'expense' ? spentByCategory.get(cat.id) || 0 : 0;
          const delta = cat.monthlyBudget != null ? cat.monthlyBudget - spent : null;
          const usage = cat.monthlyBudget && cat.monthlyBudget > 0 ? Math.min(100, (spent / cat.monthlyBudget) * 100) : null;
          return { ...cat, spent, delta, usage };
        })
      );
    }
  }, [financialData, isLoading]);

  const handleResetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (category: CategoryWithStats) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      icon: category.icon || '💳',
      type: category.type,
      monthlyBudget: category.monthlyBudget != null ? String(category.monthlyBudget) : '',
      color: category.color || '#6366F1'
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id);
      await refreshFinancialData();
      await loadCategories();
      if (editingId === id) {
        handleResetForm();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      setError(extractErrorMessage(err) || 'Impossible de supprimer cette catégorie pour le moment.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Le nom de la catégorie est obligatoire.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      icon: form.icon.trim() || '💳',
      type: form.type,
      color: form.color.trim() || '#6366F1',
      monthly_budget: form.monthlyBudget ? parseFloat(form.monthlyBudget.replace(',', '.')) : null
    };

    try {
      setIsSubmitting(true);
      if (editingId) {
        await categoryService.update(editingId, payload);
      } else {
        await categoryService.create(payload);
      }
      await refreshFinancialData();
      await loadCategories();
      handleResetForm();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la catégorie:', err);
      setError(extractErrorMessage(err) || 'Impossible d’enregistrer la catégorie. Vérifiez les données saisies.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (filter === 'all') return categories;
    return categories.filter((cat) => cat.type === filter);
  }, [categories, filter]);

  const topSpender = useMemo(() => {
    return categories
      .filter((cat) => cat.type === 'expense')
      .reduce<CategoryWithStats | null>((max, cat) => {
        if (!max || cat.spent > max.spent) return cat;
        return max;
      }, null);
  }, [categories]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-3xl font-bold text-transparent">
            Gestion des catégories
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Créez vos catégories de dépenses ou revenus et attribuez-leur un budget mensuel dédié.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as 'all' | 'income' | 'expense')}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100 focus:border-blue-400 focus:outline-none"
          >
            <option value="all">Toutes les catégories</option>
            <option value="expense">Dépenses uniquement</option>
            <option value="income">Revenus uniquement</option>
          </select>
          <button
            onClick={handleResetForm}
            className="inline-flex items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/40 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/40"
          >
            Réinitialiser le formulaire
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* Highlight */}
      {topSpender && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-5 text-amber-100">
          <div className="flex items-center gap-4">
            <Wallet className="h-10 w-10 text-amber-200" />
            <div className="flex-1">
              <p className="text-sm uppercase tracking-wide text-amber-200/70">Catégorie la plus dépensière</p>
              <h2 className="text-xl font-semibold text-amber-50">{topSpender.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">
                  Dépenses: {formatCurrency(topSpender.spent)}
                </span>
                {topSpender.monthlyBudget != null && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-100/80">
                    Budget: {formatCurrency(topSpender.monthlyBudget)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Vos catégories</h2>
                <p className="text-sm text-gray-400">Budgets mensuels et suivi des dépenses.</p>
              </div>
              <span className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                {filteredCategories.length} catégories affichées
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-300">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Chargement des catégories...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-600/60 bg-gray-800/30 p-8 text-center text-sm text-gray-400">
                  Aucune catégorie pour le moment. Ajoutez-en une grâce au formulaire.
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5 text-slate-100 backdrop-blur-lg"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{category.name}</h3>
                          <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                            category.type === 'expense'
                              ? 'bg-pink-500/20 text-pink-200'
                              : 'bg-emerald-500/20 text-emerald-200'
                          }`}>
                            {category.type === 'expense' ? 'Dépense' : 'Revenu'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Budget mensuel</p>
                          <p className="text-white font-semibold">
                            {category.monthlyBudget != null ? formatCurrency(category.monthlyBudget) : '—'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Dépensé</p>
                          <p className="text-white font-semibold">{formatCurrency(category.spent)}</p>
                          {category.delta != null && (
                            <p className={`text-xs ${category.delta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                              {category.delta >= 0 ? `Reste ${formatCurrency(category.delta)}` : `Dépassé de ${formatCurrency(Math.abs(category.delta))}`}
                            </p>
                          )}
                        </div>
                        <div className="w-32">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Utilisation</p>
                          <div className="mt-1 h-2 w-full rounded-full bg-slate-700/60">
                            <div
                              className={`h-full rounded-full ${
                                category.usage != null
                                  ? category.usage >= 100
                                    ? 'bg-rose-500'
                                    : category.usage >= 85
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                                  : 'bg-slate-500'
                              }`}
                              style={{ width: `${category.usage != null ? Math.min(100, Math.round(category.usage)) : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-100 transition hover:bg-indigo-500/20"
                        >
                          <Pencil size={14} /> Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100 transition hover:bg-red-500/20"
                        >
                          <Trash2 size={14} /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-700/40 bg-gradient-to-br from-gray-800/70 to-gray-900/70 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Modifier la catégorie' : 'Créer une catégorie'}
              </h2>
              <p className="text-sm text-gray-400">
                Définissez le budget mensuel pour chaque poste de dépenses.
              </p>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-2 text-purple-100">
              <Plus size={18} />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Nom
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  placeholder="ex: Alimentation"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Icône (emoji)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={form.icon}
                    onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    placeholder="💳"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as 'income' | 'expense' }))}
                    className="mt-2 w-full rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="expense">Dépense</option>
                    <option value="income">Revenu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Budget mensuel (€)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.monthlyBudget}
                  onChange={(event) => setForm((prev) => ({ ...prev, monthlyBudget: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                  placeholder="ex: 350"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Couleur
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-slate-200">
                    <Palette size={16} />
                    <input
                      type="color"
                      value={form.color}
                      onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                      className="h-8 w-8 cursor-pointer rounded-md border border-slate-600 bg-transparent"
                    />
                  </div>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                    className="w-full rounded-xl border border-slate-600/60 bg-slate-800/40 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
                    placeholder="#6366F1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-xl border border-slate-600/60 bg-slate-800/40 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700/40"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl border border-blue-500/40 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    {editingId ? 'Mettre à jour' : 'Enregistrer'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function buildSpentMap(financialData: ReturnType<typeof useAuth>['financialData']): Map<number, number> {
  const map = new Map<number, number>();
  if (!financialData) return map;

  const register = (expense?: { category_id?: number | null; category?: number | null; amount?: number | string | null }) => {
    if (!expense) return;
    const categoryId = expense.category_id ?? (expense.category as number | undefined);
    if (!categoryId) return;
    const amount = toNumber(expense.amount);
    map.set(categoryId, (map.get(categoryId) || 0) + amount);
  };

  (financialData.fixed_expenses || []).forEach(register);
  (financialData.variable_expenses || []).forEach(register);

  return map;
}

function extractErrorMessage(error: unknown): string | null {
  const axiosError = error as AxiosError<any>;
  if (axiosError?.response?.data) {
    const data = axiosError.response.data as any;
    if (typeof data === 'string') {
      return data;
    }
    if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length > 0) {
      return data.non_field_errors[0];
    }
    const fields = Object.keys(data);
    if (fields.length > 0) {
      const first = data[fields[0]];
      if (Array.isArray(first) && first.length > 0) {
        return `${fields[0]}: ${first[0]}`;
      }
      if (typeof first === 'string') {
        return `${fields[0]}: ${first}`;
      }
    }
  }
  return null;
}

export default CategoryManagement;