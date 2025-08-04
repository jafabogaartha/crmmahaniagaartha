import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { HomeIcon, ChartBarIcon, UsersIcon, CogIcon, ClipboardDocumentListIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const iconClasses = "h-6 w-6 mr-3";

const navLinks = [
  { to: '/dashboard', text: 'Dashboard', icon: <HomeIcon className={iconClasses} />, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
  { to: '/leads', text: 'My Leads', icon: <ClipboardDocumentListIcon className={iconClasses} />, roles: [Role.ADMIN] },
  { to: '/handle-customer', text: 'Handle Customer', icon: <UsersIcon className={iconClasses} />, roles: [Role.HANDLE_CUSTOMER] },
  { to: '/analytics', text: 'Analytics', icon: <ChartBarIcon className={iconClasses} />, roles: [Role.SUPER_ADMIN] },
  { to: '/settings', text: 'Settings', icon: <CogIcon className={iconClasses} />, roles: [Role.SUPER_ADMIN] },
  { to: '/form/youneedmie', text: 'Public Form (Demo)', icon: <DocumentTextIcon className={iconClasses} />, roles: [Role.SUPER_ADMIN, Role.ADMIN] },
];

export const Sidebar: React.FC = () => {
  const { hasRole } = useAuth();
  const activeLinkClass = 'bg-primary/10 text-primary dark:text-white dark:bg-primary/30 border-primary';
  const inactiveLinkClass = 'border-transparent text-gray-600 dark:text-dark-content/70 hover:bg-gray-200 dark:hover:bg-dark-card/60 hover:text-gray-900 dark:hover:text-white';

  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r-2 border-neutral dark:border-dark-content/20 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b-2 border-neutral dark:border-dark-content/20">
        <h1 className="text-2xl font-bold text-neutral dark:text-white">CRM<span className="text-primary">.</span></h1>
      </div>
      <nav className="flex-grow p-4">
        <ul>
          {navLinks.filter(link => hasRole(link.roles)).map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-2 text-sm font-medium rounded-lg border-l-4 transition-colors duration-200 ${
                    isActive ? activeLinkClass : inactiveLinkClass
                  }`
                }
              >
                {link.icon}
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};