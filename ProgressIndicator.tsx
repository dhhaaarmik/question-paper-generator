import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Step } from '../types';

interface ProgressIndicatorProps {
  currentStep: Step;
}

const steps = [
  { key: 'upload', label: 'Upload Files' },
  { key: 'details', label: 'Exam Details' },
  { key: 'config', label: 'Configuration' },
  { key: 'generate', label: 'Generate' },
  { key: 'preview', label: 'Preview' },
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted ? '#059669' : isCurrent ? '#2563eb' : '#e5e7eb'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span className={`mt-2 text-xs font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-200'
                }`}>
                  <motion.div
                    className="h-full bg-green-600"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;