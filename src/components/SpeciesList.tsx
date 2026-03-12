import React from 'react';
import { Species } from '../types';

interface SpeciesListProps {
  species: Species[];
}

export const SpeciesList: React.FC<SpeciesListProps> = ({ species }) => {
  const sortedSpecies = [...species].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Detected Species ({species.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sortedSpecies.map((species, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 italic">
                {species.name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {species.count}
              </span>
              <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((species.count / Math.max(...sortedSpecies.map(s => s.count))) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
