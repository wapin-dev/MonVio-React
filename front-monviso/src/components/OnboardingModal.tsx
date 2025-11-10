import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { PersonalInfoStep, PrimaryIncomeStep, AdditionalIncomeStep, FixedExpensesStep, VariableExpensesStep, GoalsAndSummaryStep } from './OnboardingSteps';
import { onboardingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
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
    { 
      title: 'Informations personnelles', 
      subtitle: 'Qui êtes-vous ?',
      description: 'Commençons par vous connaître',
      icon: '👤',
      component: PersonalInfoStep 
    },
    { 
      title: 'Revenu principal', 
      subtitle: 'Votre salaire',
      description: 'Votre source de revenus principale',
      icon: '💰',
      component: PrimaryIncomeStep 
    },
    { 
      title: 'Revenus additionnels', 
      subtitle: 'Autres revenus',
      description: 'Freelance, investissements, etc.',
      icon: '📈',
      component: AdditionalIncomeStep 
    },
    { 
      title: 'Dépenses fixes', 
      subtitle: 'Charges obligatoires',
      description: 'Loyer, assurances, abonnements',
      icon: '🏠',
      component: FixedExpensesStep 
    },
    { 
      title: 'Dépenses variables', 
      subtitle: 'Vie quotidienne',
      description: 'Alimentation, loisirs, shopping',
      icon: '🛒',
      component: VariableExpensesStep 
    },
    { 
      title: 'Objectifs et résumé', 
      subtitle: 'Vos projets',
      description: 'Épargne et objectifs financiers',
      icon: '🎯',
      component: GoalsAndSummaryStep 
    }
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
      await onComplete();
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
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 flex min-h-screen w-full items-stretch justify-center sm:min-h-full sm:items-start sm:overflow-y-auto sm:p-6">
        <div className="flex h-screen w-full min-h-0 flex-col bg-gradient-to-br from-white to-gray-50 sm:h-auto sm:max-h-[90vh] sm:w-auto sm:max-w-4xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200/50 sm:shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-5 text-white sm:px-6">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl">{currentStepData.icon}</div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold sm:text-2xl">{currentStepData.title}</h2>
                  <p className="text-sm text-blue-100 sm:text-base">
                    {currentStepData.subtitle} • {currentStepData.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="text-sm text-blue-100">Étape {currentStep + 1} sur {steps.length}</span>
                <span className="text-lg font-semibold">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="px-4 py-4 sm:px-6 sm:py-5 bg-gray-50/60">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Progression</span>
                <span className="hidden text-gray-500 sm:block">{currentStep + 1}/{steps.length}</span>
              </div>
              <span className="text-sm text-gray-500 sm:hidden">{currentStep + 1}/{steps.length}</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 overflow-x-auto">
              <div className="flex items-center gap-3 pb-1">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isActive = index === currentStep;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 sm:h-8 sm:w-8 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={16} /> : index + 1}
                      </div>
                      <span
                        className={`mt-1 max-w-[72px] text-center text-[11px] sm:text-xs ${
                          index <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-400'
                        }`}
                      >
                        {step.title.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white px-4 py-6 sm:p-8">
            <div className="mx-auto w-full max-w-3xl">
              <CurrentStepComponent data={onboardingData} updateData={updateData} />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 shadow-inner sm:static sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
                className="flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-gray-400 hover:bg-white hover:text-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                <ArrowLeft size={18} className="mr-2" />
                Précédent
              </button>

              <div className="flex items-center justify-center gap-2 sm:hidden">
                {steps.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index < currentStep
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {isLastStep ? (
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Terminer la configuration
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                >
                  Suivant
                  <ArrowRight size={18} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;