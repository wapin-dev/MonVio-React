import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PersonalInfoStep, PrimaryIncomeStep, AdditionalIncomeStep, FixedExpensesStep, VariableExpensesStep, GoalsAndSummaryStep } from './OnboardingSteps';
import { onboardingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export interface OnboardingData {
  // Personal info
  first_name: string;
  last_name: string;
  monthly_income: number;
  currency: string;
  
  // Incomes
  incomes: Array<{
    name: string;
    amount: number;
    type: string;
    is_primary: boolean;
    frequency: string;
  }>;
  
  // Expenses
  fixed_expenses: Array<{
    name: string;
    amount: number;
    frequency: string;
  }>;
  
  variable_expenses: Array<{
    name: string;
    amount: number;
    frequency: string;
  }>;
  
  // Goals
  savings_goals: Array<{
    name: string;
    target_amount: number;
    current_amount: number;
    target_date: string;
    type: string;
    priority: string;
  }>;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    monthly_income: 0,
    currency: 'EUR',
    incomes: [],
    fixed_expenses: [],
    variable_expenses: [],
    savings_goals: []
  });

  const steps = [
    { title: 'Informations personnelles', component: PersonalInfoStep },
    { title: 'Revenu principal', component: PrimaryIncomeStep },
    { title: 'Revenus additionnels', component: AdditionalIncomeStep },
    { title: 'Dépenses fixes', component: FixedExpensesStep },
    { title: 'Dépenses variables', component: VariableExpensesStep },
    { title: 'Objectifs et résumé', component: GoalsAndSummaryStep }
  ];

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      console.log('[ONBOARDING] Submitting onboarding data:', onboardingData);
      
      // Validate required fields
      if (!onboardingData.first_name || !onboardingData.first_name.trim()) {
        alert('Le prénom est obligatoire');
        setIsSubmitting(false);
        return;
      }
      
      if (!onboardingData.last_name || !onboardingData.last_name.trim()) {
        alert('Le nom est obligatoire');
        setIsSubmitting(false);
        return;
      }
      
      // Filter out empty/invalid entries before sending
      const cleanedData = {
        ...onboardingData,
        incomes: onboardingData.incomes.filter(income => 
          income.name && income.name.trim() && income.amount > 0
        ),
        fixed_expenses: onboardingData.fixed_expenses
          .filter(expense => expense.name && expense.name.trim() && expense.amount > 0)
          .map(expense => ({ ...expense, type: 'fixed' })),
        variable_expenses: onboardingData.variable_expenses
          .filter(expense => expense.name && expense.name.trim() && expense.amount > 0)
          .map(expense => ({ ...expense, type: 'variable' })),
        savings_goals: onboardingData.savings_goals.filter(goal => 
          goal.name && goal.name.trim() && goal.target_amount > 0
        )
      };
      
      console.log('[ONBOARDING] Cleaned data:', cleanedData);
      await onboardingService.submitOnboarding(cleanedData);
      console.log('[ONBOARDING] Onboarding completed successfully');
      onComplete();
    } catch (error) {
      console.error('[ONBOARDING] Error submitting onboarding data:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Configuration de votre budget
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 border-b">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <CurrentStepComponent 
            data={onboardingData}
            updateData={updateData}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Précédent
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sauvegarde...' : 'Terminer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;