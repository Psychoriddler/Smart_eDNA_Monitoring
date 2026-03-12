import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Download, Dna } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SpeciesList } from '../components/SpeciesList';
import { SpeciesChart } from '../components/SpeciesChart';
import { useDarkMode } from '../hooks/useDarkMode';
import { UploadState } from '../types';
import { analyzeFile, downloadResultsAsCSV } from '../services/api';
import toast from 'react-hot-toast';

export const AnalysisPage: React.FC = () => {
  const { isDark } = useDarkMode();
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    isAnalyzing: false,
    results: null,
    error: null,
  });
  const [taxonomyDatabase, setTaxonomyDatabase] = useState('18S fungal sequences');
  const [clusteringMethod, setClusteringMethod] = useState('K-Means');

  const handleFileSelect = (file: File) => {
    setUploadState(prev => ({
      ...prev,
      file,
      results: null,
      error: null,
    }));
  };

  const handleAnalysis = async () => {
    if (!uploadState.file) return;

    setUploadState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const results = await analyzeFile(uploadState.file);
      setUploadState(prev => ({
        ...prev,
        isAnalyzing: false,
        results,
      }));
      toast.success('Analysis completed successfully!');
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: 'Failed to analyze file. Please try again.',
      }));
      toast.error('Analysis failed. Please try again.');
    }
  };

  const handleDownload = () => {
    if (uploadState.results) {
      downloadResultsAsCSV(uploadState.results);
      toast.success('Results downloaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Dna className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
              eDNA Analysis
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Upload your environmental DNA data and get biodiversity insights instantly.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                {/* File Upload Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Upload your raw eDNA sequence file
                  </h2>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={uploadState.file}
                    isAnalyzing={uploadState.isAnalyzing}
                  />
                </div>

                {/* Database Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Database for taxonomy
                  </label>
                  <select
                    value={taxonomyDatabase}
                    onChange={(e) => setTaxonomyDatabase(e.target.value)}
                    disabled={uploadState.isAnalyzing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="18S fungal sequences">18S fungal sequences</option>
                    <option value="16S bacterial sequences">16S bacterial sequences</option>
                    <option value="COI metazoan sequences">COI metazoan sequences</option>
                    <option value="ITS fungal sequences">ITS fungal sequences</option>
                  </select>
                </div>

                {/* Clustering Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clustering method
                  </label>
                  <select
                    value={clusteringMethod}
                    onChange={(e) => setClusteringMethod(e.target.value)}
                    disabled={uploadState.isAnalyzing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="K-Means">K-Means</option>
                    <option value="DBSCAN">DBSCAN</option>
                    <option value="Hierarchical">Hierarchical</option>
                    <option value="UCLUST">UCLUST</option>
                  </select>
                </div>

                {/* Run Analysis Button */}
                <button
                  onClick={handleAnalysis}
                  disabled={!uploadState.file || uploadState.isAnalyzing}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {uploadState.isAnalyzing ? 'Running Analysis...' : 'Run Analysis'}
                </button>

                {/* Error Display */}
                {uploadState.error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      {uploadState.error}
                    </div>
                    <button
                      onClick={() => setUploadState(prev => ({ ...prev, error: null }))}
                      className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Area - Results */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {!uploadState.results && !uploadState.isAnalyzing && (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Dna className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No analysis results yet</p>
                  <p className="text-sm">Upload a FASTA file and run analysis to see biodiversity insights</p>
                </div>
              )}

              {uploadState.isAnalyzing && (
                <div className="p-12">
                  <LoadingSpinner />
                </div>
              )}

              {uploadState.results && (
                <div className="p-6">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Analysis Results
                    </h2>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </button>
                      <button
                        onClick={() => setUploadState({ file: null, isAnalyzing: false, results: null, error: null })}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        New Analysis
                      </button>
                    </div>
                  </div>

                  {/* Results Content */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <SpeciesList species={uploadState.results.species} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Species Abundance Chart
                      </h3>
                      <SpeciesChart species={uploadState.results.species} isDark={isDark} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 eDNA Biodiversity Explorer. Built for researchers, by researchers.</p>
        </div>
      </div>
    </div>
  );
};
