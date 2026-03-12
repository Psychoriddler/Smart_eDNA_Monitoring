import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, isAnalyzing }) => {
  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast.error('Please select a valid FASTA file (.fasta, .fa, .fas, .fastq)');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
      toast.success('File selected successfully!');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.fasta', '.fa', '.fas', '.fastq']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : selectedFile 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-700'
        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-3">
          {selectedFile ? (
            <>
              <FileText className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your .fasta or .fastq file here'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {selectedFile && !isAnalyzing && (
        <div className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400">
          <AlertCircle className="h-4 w-4 mr-1" />
          File ready for analysis
        </div>
      )}
    </div>
  );
};
