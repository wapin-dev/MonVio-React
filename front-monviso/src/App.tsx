import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingWrapper from './components/OnboardingWrapper';
// Auth Pages
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import Signup from './pages/Signup';
// App Pages
import Dashboard from './components/Dashboard';
import TransactionManagement from './components/TransactionManagement';
import BudgetManagement from './components/BudgetManagement';
import CategoryManagement from './components/CategoryManagement';
import ExpenseHistory from './components/ExpenseHistory';
import UserProfile from './components/UserProfile';
import PresetManagement from './components/PresetManagement';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes with onboarding wrapper */}
        <Route path="/" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <Dashboard />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <TransactionManagement />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <BudgetManagement />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <CategoryManagement />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <ExpenseHistory />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <UserProfile />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        <Route path="/presets" element={
          <ProtectedRoute>
            <OnboardingWrapper>
              <Layout>
                <PresetManagement />
              </Layout>
            </OnboardingWrapper>
          </ProtectedRoute>
        } />
        {/* Redirect any unknown routes to GetStarted */}
        <Route path="*" element={<GetStarted />} />
      </Routes>
    </AuthProvider>
  );
}