import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
  return <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute>
              <Layout>
                <TransactionManagement />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute>
              <Layout>
                <BudgetManagement />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute>
              <Layout>
                <CategoryManagement />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute>
              <Layout>
                <ExpenseHistory />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>
              <Layout>
                <UserProfile />
              </Layout>
            </ProtectedRoute>} />
        <Route path="/presets" element={<ProtectedRoute>
              <Layout>
                <PresetManagement />
              </Layout>
            </ProtectedRoute>} />
        {/* Redirect any unknown routes to GetStarted */}
        <Route path="*" element={<GetStarted />} />
      </Routes>
    </AuthProvider>;
}