import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Target, DollarSign } from 'lucide-react';
import { OnboardingData } from './OnboardingModal';

interface StepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

// Step 1: Personal Information
export const PersonalInfoStep: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations personnelles
        </h3>
        <p className="text-gray-600 mb-6">
          Commençons par quelques informations de base pour personnaliser votre expérience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => updateData({ first_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            value={data.last_name}
            onChange={(e) => updateData({ last_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Revenu mensuel principal (€)
        </label>
        <input
          type="number"
          value={data.monthly_income || ''}
          onChange={(e) => updateData({ monthly_income: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="3000"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Devise
        </label>
        <select
          value={data.currency}
          onChange={(e) => updateData({ currency: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="EUR">Euro (€)</option>
          <option value="USD">Dollar US ($)</option>
          <option value="GBP">Livre Sterling (£)</option>
          <option value="CHF">Franc Suisse (CHF)</option>
        </select>
      </div>
    </div>
  );
};

// Step 2: Primary Income
export const PrimaryIncomeStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [primaryIncome, setPrimaryIncome] = useState({
    name: 'Salaire principal',
    amount: data.monthly_income || 0,
    type: 'salary',
    is_primary: true,
    frequency: 'monthly'
  });

  const handleSubmit = () => {
    const incomes = [primaryIncome];
    updateData({ incomes });
  };

  React.useEffect(() => {
    handleSubmit();
  }, [primaryIncome]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Votre revenu principal
        </h3>
        <p className="text-gray-600 mb-6">
          Détaillons votre source de revenus principale.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du revenu
          </label>
          <input
            type="text"
            value={primaryIncome.name}
            onChange={(e) => setPrimaryIncome({ ...primaryIncome, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Salaire, Freelance..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (€)
          </label>
          <input
            type="number"
            value={primaryIncome.amount}
            onChange={(e) => setPrimaryIncome({ ...primaryIncome, amount: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="3000"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de revenu
          </label>
          <select
            value={primaryIncome.type}
            onChange={(e) => setPrimaryIncome({ ...primaryIncome, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="salary">Salaire</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investissement</option>
            <option value="rental">Loyer</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence
          </label>
          <select
            value={primaryIncome.frequency}
            onChange={(e) => setPrimaryIncome({ ...primaryIncome, frequency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Mensuel</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="yearly">Annuel</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Step 3: Additional Income
export const AdditionalIncomeStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [additionalIncomes, setAdditionalIncomes] = useState<any[]>([]);

  const addIncome = () => {
    const newIncome = {
      name: '',
      amount: 0,
      type: 'other',
      is_primary: false,
      frequency: 'monthly'
    };
    setAdditionalIncomes([...additionalIncomes, newIncome]);
  };

  const removeIncome = (index: number) => {
    const updated = additionalIncomes.filter((_, i) => i !== index);
    setAdditionalIncomes(updated);
  };

  const updateIncome = (index: number, field: string, value: any) => {
    const updated = additionalIncomes.map((income, i) => 
      i === index ? { ...income, [field]: value } : income
    );
    setAdditionalIncomes(updated);
  };

  React.useEffect(() => {
    // Combine primary income with additional incomes
    const allIncomes = [...(data.incomes || []), ...additionalIncomes];
    updateData({ incomes: allIncomes });
  }, [additionalIncomes]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenus additionnels
        </h3>
        <p className="text-gray-600 mb-6">
          Ajoutez d'autres sources de revenus si vous en avez (optionnel).
        </p>
      </div>

      <div className="space-y-4">
        {additionalIncomes.map((income, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Revenu #{index + 1}</h4>
              <button
                onClick={() => removeIncome(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={income.name}
                onChange={(e) => updateIncome(index, 'name', e.target.value)}
                placeholder="Nom du revenu"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={income.amount}
                onChange={(e) => updateIncome(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Montant"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <select
                value={income.type}
                onChange={(e) => updateIncome(index, 'type', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="freelance">Freelance</option>
                <option value="investment">Investissement</option>
                <option value="rental">Loyer</option>
                <option value="other">Autre</option>
              </select>
              <select
                value={income.frequency}
                onChange={(e) => updateIncome(index, 'frequency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Mensuel</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
          </div>
        ))}

        <button
          onClick={addIncome}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Ajouter un revenu</span>
        </button>
      </div>
    </div>
  );
};

// Step 4: Fixed Expenses
export const FixedExpensesStep: React.FC<StepProps> = ({ data, updateData }) => {
  const [fixedExpenses, setFixedExpenses] = useState<any[]>([]);

  const commonFixedExpenses = [
    'Loyer/Hypothèque', 'Assurance', 'Téléphone', 'Internet', 'Électricité', 
    'Gaz', 'Eau', 'Transport', 'Abonnements'
  ];

  const addExpense = (name = '') => {
    const newExpense = {
      name,
      amount: 0,
      frequency: 'monthly'
    };
    setFixedExpenses([...fixedExpenses, newExpense]);
  };

  const removeExpense = (index: number) => {
    const updated = fixedExpenses.filter((_, i) => i !== index);
    setFixedExpenses(updated);
  };

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = fixedExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setFixedExpenses(updated);
  };

  React.useEffect(() => {
    updateData({ fixed_expenses: fixedExpenses });
  }, [fixedExpenses]);

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
                value={expense.name}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                placeholder="Nom de la dépense"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Montant (€)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <select
                value={expense.frequency}
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
  const [variableExpenses, setVariableExpenses] = useState<any[]>([]);

  const commonVariableExpenses = [
    'Alimentation', 'Restaurants', 'Loisirs', 'Vêtements', 'Santé', 
    'Cadeaux', 'Voyage', 'Sport', 'Beauté'
  ];

  const addExpense = (name = '') => {
    const newExpense = {
      name,
      amount: 0,
      frequency: 'monthly'
    };
    setVariableExpenses([...variableExpenses, newExpense]);
  };

  const removeExpense = (index: number) => {
    const updated = variableExpenses.filter((_, i) => i !== index);
    setVariableExpenses(updated);
  };

  const updateExpense = (index: number, field: string, value: any) => {
    const updated = variableExpenses.map((expense, i) => 
      i === index ? { ...expense, [field]: value } : expense
    );
    setVariableExpenses(updated);
  };

  React.useEffect(() => {
    updateData({ variable_expenses: variableExpenses });
  }, [variableExpenses]);

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
                value={expense.name}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                placeholder="Nom de la dépense"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Montant estimé (€)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <select
                value={expense.frequency}
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
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);

  const addGoal = () => {
    const newGoal = {
      name: '',
      target_amount: 0,
      current_amount: 0,
      target_date: '',
      type: 'other',
      priority: 'medium'
    };
    setSavingsGoals([...savingsGoals, newGoal]);
  };

  const removeGoal = (index: number) => {
    const updated = savingsGoals.filter((_, i) => i !== index);
    setSavingsGoals(updated);
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const updated = savingsGoals.map((goal, i) => 
      i === index ? { ...goal, [field]: value } : goal
    );
    setSavingsGoals(updated);
  };

  React.useEffect(() => {
    updateData({ savings_goals: savingsGoals });
  }, [savingsGoals]);

  // Calculate totals
  const totalIncome = (data.incomes || []).reduce((sum, income) => sum + income.amount, 0);
  const totalFixedExpenses = (data.fixed_expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
  const totalVariableExpenses = (data.variable_expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
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
                <input
                  type="text"
                  value={goal.name}
                  onChange={(e) => updateGoal(index, 'name', e.target.value)}
                  placeholder="Nom de l'objectif"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={goal.target_amount}
                  onChange={(e) => updateGoal(index, 'target_amount', parseFloat(e.target.value) || 0)}
                  placeholder="Montant cible (€)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  value={goal.current_amount}
                  onChange={(e) => updateGoal(index, 'current_amount', parseFloat(e.target.value) || 0)}
                  placeholder="Montant actuel (€)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
                <input
                  type="date"
                  value={goal.target_date}
                  onChange={(e) => updateGoal(index, 'target_date', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={goal.type}
                  onChange={(e) => updateGoal(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="emergency">Fonds d'urgence</option>
                  <option value="vacation">Vacances</option>
                  <option value="purchase">Achat</option>
                  <option value="investment">Investissement</option>
                  <option value="other">Autre</option>
                </select>
                <select
                  value={goal.priority}
                  onChange={(e) => updateGoal(index, 'priority', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high">Priorité haute</option>
                  <option value="medium">Priorité moyenne</option>
                  <option value="low">Priorité basse</option>
                </select>
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
