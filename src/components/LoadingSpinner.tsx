import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Analyzing eDNA sequence file...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This may take a few moments
        </p>
      </div>
    </div>
  );
};
