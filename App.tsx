import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { HandleCustomer } from './pages/HandleCustomer';
import { Settings } from './pages/Settings';
import { PublicForm } from './pages/PublicForm';
import { PublicFormRedirect } from './pages/PublicFormRedirect';
import { Role } from './types';
import { Spinner } from './components/ui/Spinner';

const ProtectedRoute: React.FC<{ children: React.ReactElement; roles: Role[] }> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(roles)) {
    // Redirect to a default page if role doesn't match
    if (user?.role === Role.ADMIN) return <Navigate to="/dashboard" replace />
    if (user?.role === Role.HANDLE_CUSTOMER) return <Navigate to="/handle-customer" replace />
    return <Navigate to="/dashboard" replace />; // Super Admin default
  }

  return children;
};


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/form" element={<PublicFormRedirect />} />
            <Route path="/form/:productNameUrl" element={<PublicForm />} />

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
                 <Route path="/" element={<Navigate to="/dashboard" replace />} />
                 <Route path="/dashboard" element={<ProtectedRoute roles={[Role.SUPER_ADMIN, Role.ADMIN]}><Dashboard /></ProtectedRoute>} />
                 <Route path="/leads" element={<ProtectedRoute roles={[Role.ADMIN]}><Leads /></ProtectedRoute>} />
                 <Route path="/handle-customer" element={<ProtectedRoute roles={[Role.HANDLE_CUSTOMER]}><HandleCustomer /></ProtectedRoute>} />
                 <Route path="/analytics" element={<ProtectedRoute roles={[Role.SUPER_ADMIN]}><Dashboard /></ProtectedRoute>} />
                 <Route path="/settings" element={<ProtectedRoute roles={[Role.SUPER_ADMIN]}><Settings /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;