import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, GraduationCap, Key } from 'lucide-react';
import { ExamDetails } from '../types';

interface ExamFormProps {
  examDetails: ExamDetails;
  onExamDetailsChange: (details: ExamDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ examDetails, onExamDetailsChange, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExamDetails>({
    defaultValues: examDetails
  });

  const watchedValues = watch();

  React.useEffect(() => {
    onExamDetailsChange(watchedValues);
  }, [watchedValues, onExamDetailsChange]);

  const onSubmit = (data: ExamDetails) => {
    onExamDetailsChange(data);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Information</h2>
        <p className="text-gray-600">Provide details about the examination</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="universityName" className="block text-sm font-medium text-gray-700">
              University Name *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="universityName"
                {...register('universityName', { required: 'University name is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter university name"
              />
            </div>
            {errors.universityName && (
              <p className="text-red-500 text-sm">{errors.universityName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
              Branch/Department *
            </label>
            <input
              type="text"
              id="branch"
              {...register('branch', { required: 'Branch is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Computer Science"
            />
            {errors.branch && (
              <p className="text-red-500 text-sm">{errors.branch.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject Name *
            </label>
            <input
              type="text"
              id="subject"
              {...register('subject', { required: 'Subject name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Data Structures"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">
              Total Marks *
            </label>
            <input
              type="number"
              id="totalMarks"
              {...register('totalMarks', { 
                required: 'Total marks is required',
                min: { value: 1, message: 'Total marks must be greater than 0' }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 100"
            />
            {errors.totalMarks && (
              <p className="text-red-500 text-sm">{errors.totalMarks.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700">
              Exam Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="examDate"
                {...register('examDate')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="examDuration" className="block text-sm font-medium text-gray-700">
              Exam Duration
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="examDuration"
                {...register('examDuration')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 3 hours"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700">
            OpenAI API Key *
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              id="openaiApiKey"
              {...register('openaiApiKey', { required: 'OpenAI API key is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="sk-..."
            />
          </div>
          {errors.openaiApiKey && (
            <p className="text-red-500 text-sm">{errors.openaiApiKey.message}</p>
          )}
          <p className="text-sm text-gray-500">
            Your API key is used securely and not stored. Get your key from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              OpenAI Platform
            </a>
          </p>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            Back to Upload
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          >
            Continue to Configuration
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExamForm;