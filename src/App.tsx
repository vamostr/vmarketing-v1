import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { AdminLayout } from './layouts/AdminLayout';
import { UserLayout } from './layouts/UserLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Sayfa bileşenleri
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/dashboard/Dashboard';
import { WhatsAppManager } from './pages/whatsapp/WhatsAppManager';
import { EmailCampaigns } from './pages/email/EmailCampaigns';
import { Analytics } from './pages/analytics/Analytics';
import { Settings } from './pages/settings/Settings';
import { Contacts } from './pages/contacts/Contacts';
import { SubscriptionPlans } from './pages/subscription/SubscriptionPlans';

// Admin sayfaları
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { OrganizationManagement } from './pages/admin/OrganizationManagement';
import { SubscriptionManagement } from './pages/admin/SubscriptionManagement';
import { AffiliateManagement } from './pages/admin/AffiliateManagement';
import { AdminSettings } from './pages/admin/AdminSettings';
import { SystemStatus } from './pages/admin/SystemStatus';
import { BulkOperations } from './pages/admin/BulkOperations';
import { Announcements } from './pages/admin/Announcements';
import { Permissions } from './pages/admin/Permissions';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {!isAuthenticated ? (
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        ) : user?.role === 'admin' ? (
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/permissions" element={<Permissions />} />
            <Route path="/admin/organizations" element={<OrganizationManagement />} />
            <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/admin/affiliates" element={<AffiliateManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/system-status" element={<SystemStatus />} />
            <Route path="/admin/bulk-operations" element={<BulkOperations />} />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        ) : (
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/whatsapp" element={<WhatsAppManager />} />
            <Route path="/email" element={<EmailCampaigns />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscription" element={<SubscriptionPlans />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        )}
      </Routes>
    </QueryClientProvider>
  );
};

export default App;