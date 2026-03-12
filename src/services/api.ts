import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  // Mock implementation - in a real app, this would send the file to the backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        species: [
          { name: "Salmo salar", count: 24 },
          { name: "Oncorhynchus mykiss", count: 12 },
          { name: "Esox lucius", count: 8 },
          { name: "Perca fluviatilis", count: 15 },
          { name: "Thymallus thymallus", count: 6 },
          { name: "Cottus gobio", count: 9 }
        ]
      });
    }, 2000); // Simulate processing time
  });
};

export const downloadResultsAsCSV = (results: AnalysisResult): void => {
  const csvContent = [
    'Species Name,Count',
    ...results.species.map(species => `"${species.name}",${species.count}`)
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `biodiversity_analysis_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
