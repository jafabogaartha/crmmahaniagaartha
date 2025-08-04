
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username) {
      setError('Username is required.');
      return;
    }
    try {
      await login(username);
    } catch (err) {
      setError('Login failed. Please use: angger, berliana, or selly.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-base-dark">
      <Card className="w-full max-w-sm shadow-neo dark:shadow-dark-neo">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral dark:text-white">CRM<span className="text-primary">.</span> Login</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-dark-content/70">Login with: angger, berliana, or selly</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral dark:text-dark-content mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border-2 border-neutral dark:border-dark-content/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-card"
              placeholder="e.g., berliana"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
