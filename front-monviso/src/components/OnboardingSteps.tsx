import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, DollarSign } from 'lucide-react';
import { OnboardingData } from './OnboardingModal';

interface StepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const sanitizeNumericInput = (value: string) => value.replace(/[^0-9.,]/g, '');

const numericFromInput = (value: string) => {
  const sanitized = sanitizeNumericInput(value);
  if (!sanitized) {
    return 0;
  }
  const normalized = sanitized.replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumericValue = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '';
  }
  return value.toString();
};

// Step 1: Personal Information
export const PersonalInfoStep: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      {/* Introduction avec design moderne */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Bienvenue sur MonViso !
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Commençons par vous connaître pour personnaliser votre expérience de gestion budgétaire.
        </p>
      </div>

      {/* Formulaire avec design amélioré */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Prénom *
            </label>
            <input
              type="text"
              value={data.first_name}
              onChange={(e) => updateData({ first_name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
              placeholder="Ex: Marie"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => updateData({ last_name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
              placeholder="Ex: Dupont"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Revenu mensuel principal *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">€</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={formatNumericValue(data.monthly_income)}
              onChange={(e) =>
                updateData({ monthly_income: numericFromInput(e.target.value) })
              }
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
              placeholder="3000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 C'est votre salaire principal ou votre revenu le plus important
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Devise
          </label>
          <select
            value={data.currency}
            onChange={(e) => updateData({ currency: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
          >
            <option value="EUR">🇪🇺 Euro (€)</option>
            <option value="USD">🇺🇸 Dollar US ($)</option>
            <option value="GBP">🇬🇧 Livre Sterling (£)</option>
            <option value="CHF">🇨🇭 Franc Suisse (CHF)</option>
          </select>
        </div>
      </div>

      {/* Message d'encouragement */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-lg">💡</div>
          <div>
            <p className="text-blue-800 text-sm font-medium">
              Pas de souci si vous n'êtes pas sûr(e) des montants !
            </p>
            <p className="text-blue-600 text-xs mt-1">
              Vous pourrez toujours modifier ces informations plus tard dans votre profil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Primary Income
export const PrimaryIncomeStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [primaryIncome, setPrimaryIncome] = useState(() => {
    const fromData = (data.incomes || []).find((income) => income.is_primary);
    if (fromData) {
      return { ...fromData };
    }
    return {
      name: data.first_name ? `Salaire ${data.first_name}` : 'Salaire principal',
      amount: data.monthly_income || 0,
      type: 'salary',
      is_primary: true,
      frequency: 'monthly'
    };
  });

  React.useEffect(() => {
    const hasPrimary = (data.incomes || []).some((income) => income.is_primary);
    if (!hasPrimary) {
      updateData({
        incomes: [{ ...primaryIncome, is_primary: true }]
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistPrimary = React.useCallback(
    (nextPrimary: typeof primaryIncome) => {
      const otherIncomes = (data.incomes || []).filter((income) => !income.is_primary);
      updateData({
        monthly_income: nextPrimary.amount,
        incomes: [{ ...nextPrimary, is_primary: true }, ...otherIncomes]
      });
    },
    [data.incomes, updateData]
  );

  const handleFieldChange = (updates: Partial<typeof primaryIncome>) => {
    setPrimaryIncome((prev) => {
      const next = { ...prev, ...updates };
      persistPrimary(next);
      return next;
    });
  };

  const incomeTypes = [
    { value: 'salary', label: 'Salaire', icon: '💼', description: 'Salaire mensuel' },
    { value: 'freelance', label: 'Freelance', icon: '💻', description: 'Travail indépendant' },
    { value: 'investment', label: 'Investissement', icon: '📈', description: 'Dividendes, intérêts' },
    { value: 'rental', label: 'Loyer', icon: '🏠', description: 'Revenus locatifs' },
    { value: 'other', label: 'Autre', icon: '💰', description: 'Autre source' }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
          <span className="text-2xl">💰</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Votre revenu principal
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Détaillons votre source de revenus la plus importante. C'est la base de votre budget !
        </p>
      </div>

      {/* Formulaire amélioré */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Nom de votre revenu *
          </label>
          <input
            type="text"
            value={primaryIncome.name}
            onChange={(e) => handleFieldChange({ name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
            placeholder="Ex: Salaire chez [Entreprise]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Montant mensuel *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">€</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={formatNumericValue(primaryIncome.amount)}
              onChange={(e) => handleFieldChange({ amount: numericFromInput(e.target.value) })}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white hover:border-gray-300"
              placeholder="3000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Type de revenu *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {incomeTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleFieldChange({ type: type.value })}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  primaryIncome.type === type.value
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Fréquence de paiement *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'monthly', label: 'Mensuel', icon: '📅' },
              { value: 'weekly', label: 'Hebdomadaire', icon: '📆' },
              { value: 'yearly', label: 'Annuel', icon: '🗓️' }
            ].map((freq) => (
              <button
                key={freq.value}
                onClick={() => handleFieldChange({ frequency: freq.value })}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                  primaryIncome.frequency === freq.value
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{freq.icon}</div>
                <div className="text-sm font-medium text-gray-900">{freq.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résumé visuel */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-800 text-sm font-medium">
              💡 Résumé de votre revenu principal
            </p>
            <p className="text-green-600 text-xs mt-1">
              {primaryIncome.name} • {primaryIncome.amount.toFixed(2)}€ • {primaryIncome.frequency === 'monthly' ? 'Mensuel' : primaryIncome.frequency === 'weekly' ? 'Hebdomadaire' : 'Annuel'}
            </p>
          </div>
          <div className="text-green-600 font-bold text-lg">
            {primaryIncome.amount.toFixed(0)}€
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Additional Income
export const AdditionalIncomeStep: React.FC<StepProps> = ({ data, updateData }) => {
  const incomes = data.incomes || [];
  const primaryIncome = incomes.find((income) => income.is_primary);
  const additionalIncomes = incomes.filter((income) => !income.is_primary);

  const basePrimary =
    primaryIncome ||
    {
      name: data.first_name ? `Salaire ${data.first_name}` : 'Revenu principal',
      amount: data.monthly_income || 0,
      type: 'salary',
      is_primary: true,
      frequency: 'monthly'
    };

  const syncIncomes = (updatedAdditional: typeof additionalIncomes) => {
    updateData({
      monthly_income: basePrimary.amount, // Keep primary income in sync
      incomes: [
        { ...basePrimary, is_primary: true },
        ...updatedAdditional.map((income) => ({
          ...income,
          is_primary: false,
          frequency: income.frequency || 'monthly',
          type: income.type || 'other'
        }))
      ]
    });
  };

  const addIncome = () => {
    const newIncome = {
      name: '',
      amount: 0,
      type: 'other',
      is_primary: false,
      frequency: 'monthly'
    };
    syncIncomes([...additionalIncomes, newIncome]);
  };

  const removeIncome = (index: number) => {
    syncIncomes(additionalIncomes.filter((_, i) => i !== index));
  };

  const updateIncome = (index: number, field: string, value: any) => {
    const updated = additionalIncomes.map((income, i) =>
      i === index ? { ...income, [field]: value } : income
    );
    syncIncomes(updated);
  };

  const quickAddOptions = [
    { name: 'Freelance', type: 'freelance', icon: '💻' },
    { name: 'Investissements', type: 'investment', icon: '📈' },
    { name: 'Revenus locatifs', type: 'rental', icon: '🏠' },
    { name: 'Prime', type: 'other', icon: '🎁' },
    { name: 'Vente', type: 'other', icon: '🛒' }
  ];

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Revenus additionnels
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Avez-vous d'autres sources de revenus ? C'est optionnel, mais cela peut améliorer votre budget !
        </p>
      </div>

      {/* Options rapides */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            💡 Ajout rapide - Cliquez sur une option :
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickAddOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  const newIncome = {
                    name: option.name,
                    amount: 0,
                    type: option.type,
                    is_primary: false,
                    frequency: 'monthly'
                  };
                  syncIncomes([...additionalIncomes, newIncome]);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 border border-blue-200 hover:border-blue-300"
              >
                <span>{option.icon}</span>
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des revenus additionnels */}
      <div className="space-y-4">
        {additionalIncomes.map((income, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span>Revenu #{index + 1}</span>
              </h4>
              <button
                onClick={() => removeIncome(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nom du revenu
                </label>
                <input
                  type="text"
                  value={income.name || ''}
                  onChange={(e) => updateIncome(index, 'name', e.target.value)}
                  placeholder="Ex: Projets freelance"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Montant
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">€</span>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={formatNumericValue(income.amount)}
                    onChange={(e) =>
                      updateIncome(index, 'amount', numericFromInput(e.target.value))
                    }
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type
                </label>
                <select
                  value={income.type || 'other'}
                  onChange={(e) => updateIncome(index, 'type', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="freelance">💻 Freelance</option>
                  <option value="investment">📈 Investissement</option>
                  <option value="rental">🏠 Loyer</option>
                  <option value="other">💰 Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fréquence
                </label>
                <select
                  value={income.frequency || 'monthly'}
                  onChange={(e) => updateIncome(index, 'frequency', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                >
                  <option value="monthly">📅 Mensuel</option>
                  <option value="weekly">📆 Hebdomadaire</option>
                  <option value="yearly">🗓️ Annuel</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout */}
        <button
          onClick={addIncome}
          className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <Plus size={20} />
          <span className="font-medium">Ajouter un revenu additionnel</span>
        </button>
      </div>

      {/* Message d'encouragement */}
      {additionalIncomes.length === 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-gray-500 text-lg">ℹ️</div>
            <div>
              <p className="text-gray-700 text-sm font-medium">
                Pas de revenus additionnels ? Pas de problème !
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Vous pouvez toujours ajouter d'autres sources de revenus plus tard dans votre profil.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 4: Fixed Expenses
export const FixedExpensesStep: React.FC<StepProps> = ({ data, updateData }) => {
  const fixedExpenses = data.fixed_expenses || [];

  const addExpense = (name = '') => {
    updateData({
      fixed_expenses: [
        ...fixedExpenses,
        {
          name,
          amount: 0,
          frequency: 'monthly'
        }
      ]
    });
  };

  const removeExpense = (index: number) => {
    updateData({
      fixed_expenses: fixedExpenses.filter((_, i) => i !== index)
    });
  };

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = fixedExpenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    updateData({ fixed_expenses: updated });
  };

  const commonFixedExpenses = [
    'Loyer/Hypothèque',
    'Assurance',
    'Téléphone',
    'Internet',
    'Électricité',
    'Gaz',
    'Eau',
    'Transport',
    'Abonnements'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dépenses fixes
        </h3>
        <p className="text-gray-600 mb-6">
          Listez vos dépenses récurrentes mensuelles (loyer, assurances, abonnements...).
        </p>
      </div>

      {/* Quick add buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Dépenses courantes :</p>
        <div className="flex flex-wrap gap-2">
          {commonFixedExpenses.map((expense) => (
            <button
              key={expense}
              onClick={() => addExpense(expense)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              + {expense}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {fixedExpenses.map((expense, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Dépense #{index + 1}</h4>
              <button
                onClick={() => removeExpense(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={expense.name || ''}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                placeholder="Nom de la dépense"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={formatNumericValue(expense.amount)}
                onChange={(e) =>
                  updateExpense(index, 'amount', numericFromInput(e.target.value))
                }
                placeholder="Montant (€)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={expense.frequency || 'monthly'}
                onChange={(e) => updateExpense(index, 'frequency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={() => addExpense()}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Ajouter une dépense fixe</span>
        </button>
      </div>
    </div>
  );
};

// Step 5: Variable Expenses
export const VariableExpensesStep: React.FC<StepProps> = ({ data, updateData }) => {
  const variableExpenses = data.variable_expenses || [];

  const addExpense = (name = '') => {
    updateData({
      variable_expenses: [
        ...variableExpenses,
        {
          name,
          amount: 0,
          frequency: 'monthly'
        }
      ]
    });
  };

  const removeExpense = (index: number) => {
    updateData({
      variable_expenses: variableExpenses.filter((_, i) => i !== index)
    });
  };

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = variableExpenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    updateData({ variable_expenses: updated });
  };

  const commonVariableExpenses = [
    'Alimentation',
    'Restaurants',
    'Loisirs',
    'Vêtements',
    'Santé',
    'Cadeaux',
    'Voyage',
    'Sport',
    'Beauté'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dépenses variables
        </h3>
        <p className="text-gray-600 mb-6">
          Estimez vos dépenses variables mensuelles (alimentation, loisirs, shopping...).
        </p>
      </div>

      {/* Quick add buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Catégories courantes :</p>
        <div className="flex flex-wrap gap-2">
          {commonVariableExpenses.map((expense) => (
            <button
              key={expense}
              onClick={() => addExpense(expense)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
            >
              + {expense}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {variableExpenses.map((expense, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Dépense #{index + 1}</h4>
              <button
                onClick={() => removeExpense(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                value={expense.name || ''}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                placeholder="Nom de la dépense"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                value={formatNumericValue(expense.amount)}
                onChange={(e) =>
                  updateExpense(index, 'amount', numericFromInput(e.target.value))
                }
                placeholder="Montant estimé (€)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={expense.frequency || 'monthly'}
                onChange={(e) => updateExpense(index, 'frequency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Mensuel</option>
                <option value="weekly">Hebdomadaire</option>
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={() => addExpense()}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Ajouter une dépense variable</span>
        </button>
      </div>
    </div>
  );
};

// Step 6: Goals and Summary
export const GoalsAndSummaryStep: React.FC<StepProps> = ({ data, updateData }) => {
  const savingsGoals = data.savings_goals || [];
  const incomes = data.incomes || [];
  const fixedExpenses = data.fixed_expenses || [];
  const variableExpenses = data.variable_expenses || [];

  const addGoal = () => {
    const newGoal = {
      name: '',
      target_amount: 0,
      current_amount: 0,
      target_date: '',
      type: 'other',
      priority: 'medium'
    };
    updateData({ savings_goals: [...savingsGoals, newGoal] });
  };

  const removeGoal = (index: number) => {
    updateData({ savings_goals: savingsGoals.filter((_, i) => i !== index) });
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const updated = savingsGoals.map((goal, i) =>
      i === index ? { ...goal, [field]: value } : goal
    );
    updateData({ savings_goals: updated });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalVariableExpenses = variableExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const totalExpenses = totalFixedExpenses + totalVariableExpenses;
  const remainingBudget = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Objectifs d'épargne et résumé
        </h3>
        <p className="text-gray-600 mb-6">
          Définissez vos objectifs d'épargne et consultez le résumé de votre budget.
        </p>
      </div>

      {/* Budget Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Résumé de votre budget</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalIncome.toFixed(2)}€</div>
            <div className="text-gray-600">Revenus totaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalExpenses.toFixed(2)}€</div>
            <div className="text-gray-600">Dépenses totales</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {remainingBudget.toFixed(2)}€
            </div>
            <div className="text-gray-600">Reste disponible</div>
          </div>
        </div>
      </div>

      {/* Savings Goals */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Objectifs d'épargne (optionnel)</h4>

        <div className="space-y-4">
          {savingsGoals.map((goal, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-medium text-gray-900">Objectif #{index + 1}</h5>
                <button
                  onClick={() => removeGoal(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nom de l'objectif
                  </label>
                  <input
                    type="text"
                    value={goal.name || ''}
                    onChange={(e) => updateGoal(index, 'name', e.target.value)}
                    placeholder="Ex: Achat voiture"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Montant cible (€)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={formatNumericValue(goal.target_amount)}
                    onChange={(e) =>
                      updateGoal(index, 'target_amount', numericFromInput(e.target.value))
                    }
                    placeholder="5000"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Montant déjà épargné (€)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*[.,]?[0-9]*"
                    value={formatNumericValue(goal.current_amount)}
                    onChange={(e) =>
                      updateGoal(index, 'current_amount', numericFromInput(e.target.value))
                    }
                    placeholder="1200"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date cible
                  </label>
                  <input
                    type="date"
                    value={goal.target_date || ''}
                    onChange={(e) => updateGoal(index, 'target_date', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Type d'objectif
                  </label>
                  <select
                    value={goal.type || 'other'}
                    onChange={(e) => updateGoal(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="emergency">Fonds d'urgence</option>
                    <option value="vacation">Vacances</option>
                    <option value="purchase">Achat</option>
                    <option value="investment">Investissement</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Priorité
                  </label>
                  <select
                    value={goal.priority || 'medium'}
                    onChange={(e) => updateGoal(index, 'priority', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="high">Priorité haute</option>
                    <option value="medium">Priorité moyenne</option>
                    <option value="low">Priorité basse</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addGoal}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 flex items-center justify-center space-x-2 transition-colors"
          >
            <Target size={20} />
            <span>Ajouter un objectif d'épargne</span>
          </button>
        </div>
      </div>

      {/* Final message */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800 text-sm">
          🎉 Félicitations ! Vous êtes prêt(e) à commencer votre gestion budgétaire.
          Cliquez sur "Terminer" pour sauvegarder vos informations et accéder à votre tableau de bord.
        </p>
      </div>
    </div>
  );
};

// Complete OnboardingSteps component
export const OnboardingSteps: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    first_name: '',
    last_name: '',
    monthly_income: 0,
    currency: 'EUR',
    incomes: [],
    fixed_expenses: [],
    variable_expenses: [],
    savings_goals: []
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData({ ...data, ...newData });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="space-y-6">
      {step === 1 && <PersonalInfoStep data={data} updateData={updateData} />}
      {step === 2 && <PrimaryIncomeStep data={data} updateData={updateData} />}
      {step === 3 && <AdditionalIncomeStep data={data} updateData={updateData} />}
      {step === 4 && <FixedExpensesStep data={data} updateData={updateData} />}
      {step === 5 && <VariableExpensesStep data={data} updateData={updateData} />}
      {step === 6 && <GoalsAndSummaryStep data={data} updateData={updateData} />}

      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={handlePrevStep} className="text-gray-600 hover:text-gray-900">
            Précédent
          </button>
        )}
        {step < 6 && (
          <button onClick={handleNextStep} className="text-blue-600 hover:text-blue-900">
            Suivant
          </button>
        )}
        {step === 6 && (
          <button className="text-blue-600 hover:text-blue-900">
            Terminer
          </button>
        )}
      </div>
    </div>
  );
};
