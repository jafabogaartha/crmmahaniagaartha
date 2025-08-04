
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 font-bold rounded-md border-2 border-neutral dark:border-dark-content/50 focus:outline-none transition-all duration-150 transform';
  const shadowClasses = 'shadow-neo-sm hover:shadow-neo dark:shadow-dark-neo-sm dark:hover:shadow-dark-neo active:translate-x-1 active:translate-y-1 active:shadow-none';
  
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    ghost: 'bg-transparent text-base-content dark:text-dark-content hover:bg-gray-200 dark:hover:bg-dark-card',
  };

  return (
    <button className={`${baseClasses} ${shadowClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
