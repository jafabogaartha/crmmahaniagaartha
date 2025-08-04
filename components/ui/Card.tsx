import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-dark-card border-2 border-neutral dark:border-dark-content/50 rounded-lg p-6 text-base-content dark:text-dark-content ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
