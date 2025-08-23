import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import OnboardingModal from './OnboardingModal';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
  const { needsOnboarding, completeOnboarding } = useAuth();

  return (
    <>
      {children}
      {needsOnboarding && (
        <OnboardingModal
          isOpen={needsOnboarding}
          onClose={() => {
            // Don't allow closing without completing onboarding
            console.log('Onboarding must be completed before proceeding');
          }}
          onComplete={completeOnboarding}
        />
      )}
    </>
  );
};

export default OnboardingWrapper;
