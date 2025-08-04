
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const getPageTitle = (pathname: string): string => {
    const segment = pathname.split('/').filter(Boolean)[0];
    if (!segment) return 'Dashboard';
    if (segment === 'form') return 'Public Lead Form';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
}

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen bg-base-100 dark:bg-base-dark text-base-content dark:text-dark-content">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle={pageTitle} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 dark:bg-base-dark p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
