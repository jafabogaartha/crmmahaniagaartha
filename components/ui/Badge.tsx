
import React from 'react';
import { LeadStage, FinalStatus } from '../../types';

interface BadgeProps {
  text: string;
  type?: 'stage' | 'status' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ text, type = 'default' }) => {
  const colorClasses = () => {
    if (type === 'stage') {
        switch (text) {
            case LeadStage.ON_PROGRESS:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case LeadStage.CLOSING:
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case LeadStage.LOSS:
                return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }
    if (type === 'status') {
        switch (text) {
            case FinalStatus.SELESAI:
                return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300';
            case FinalStatus.BELUM_SELESAI:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default:
                 return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClasses()}`}>
      {text}
    </span>
  );
};
