
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export const Header: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-dark-card border-b-2 border-neutral dark:border-dark-content/20 flex items-center justify-between px-6">
      <h2 className="text-2xl font-bold text-neutral dark:text-white">{pageTitle}</h2>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral">
          {theme === 'light' ? 
            <MoonIcon className="h-6 w-6 text-neutral dark:text-dark-content" /> : 
            <SunIcon className="h-6 w-6 text-neutral dark:text-dark-content" />
          }
        </button>
        <div className="flex items-center space-x-3">
          <img src={user?.avatar} alt={user?.nama_lengkap} className="h-10 w-10 rounded-full border-2 border-neutral dark:border-dark-content/50" />
          <div>
            <p className="font-semibold text-neutral dark:text-white">{user?.nama_lengkap}</p>
            <p className="text-xs text-gray-500 dark:text-dark-content/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout} className="shadow-none">
          <ArrowRightOnRectangleIcon className="h-6 w-6 text-neutral dark:text-dark-content" />
        </Button>
      </div>
    </header>
  );
};
