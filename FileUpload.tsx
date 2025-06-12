import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { UploadedFile } from '../types';
import { validatePDFFile, extractTextFromPDF } from '../utils/pdfProcessor';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onNext: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, onNext }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = [];
    
    for (const file of acceptedFiles) {
      const validation = validatePDFFile(file);
      if (validation.isValid) {
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          file,
          isProcessing: true,
        };
        newFiles.push(uploadedFile);
      }
    }
    
    const updatedFiles = [...files, ...newFiles];
    onFilesChange(updatedFiles);
    
    // Process files asynchronously
    for (const newFile of newFiles) {
      try {
        const extractedText = await extractTextFromPDF(newFile.file);
        const fileIndex = updatedFiles.findIndex(f => f.id === newFile.id);
        if (fileIndex !== -1) {
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            extractedText,
            isProcessing: false,
          };
          onFilesChange([...updatedFiles]);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        const fileIndex = updatedFiles.findIndex(f => f.id === newFile.id);
        if (fileIndex !== -1) {
          updatedFiles.splice(fileIndex, 1);
          onFilesChange([...updatedFiles]);
        }
      }
    }
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const allFilesProcessed = files.length > 0 && files.every(f => !f.isProcessing && f.extractedText);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Study Materials</h2>
        <p className="text-gray-600">Upload PDF files containing the study material for question generation</p>
      </div>

      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Drop the files here' : 'Drag & drop PDF files here'}
        </p>
        <p className="text-sm text-gray-500">or click to browse (Max 10MB per file)</p>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-800">Uploaded Files</h3>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {file.isProcessing ? (
                    <div className="text-blue-500 flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Processing...</span>
                    </div>
                  ) : file.extractedText ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center pt-6 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            {files.length} file{files.length > 1 ? 's' : ''} uploaded
          </p>
          <button
            onClick={onNext}
            disabled={!allFilesProcessed}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              allFilesProcessed
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Exam Details
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;