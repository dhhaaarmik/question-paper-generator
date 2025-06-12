import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { QuestionConfig, ExamDetails } from '../types';

interface QuestionConfigProps {
  questionConfig: QuestionConfig;
  examDetails: ExamDetails;
  onQuestionConfigChange: (config: QuestionConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionConfigComponent: React.FC<QuestionConfigProps> = ({
  questionConfig,
  examDetails,
  onQuestionConfigChange,
  onNext,
  onBack
}) => {
  const { register, handleSubmit, watch } = useForm<QuestionConfig>({
    defaultValues: questionConfig
  });

  const watchedValues = watch();

  React.useEffect(() => {
    // Calculate total marks for each section
    const mcqTotal = (watchedValues.mcq?.count || 0) * (watchedValues.mcq?.marksPerQuestion || 0);
    const shortTotal = (watchedValues.shortAnswer?.count || 0) * (watchedValues.shortAnswer?.marksPerQuestion || 0);
    const longTotal = (watchedValues.longAnswer?.count || 0) * (watchedValues.longAnswer?.marksPerQuestion || 0);

    const updatedConfig = {
      ...watchedValues,
      mcq: { 
        ...watchedValues.mcq, 
        count: watchedValues.mcq?.count || 0,
        marksPerQuestion: watchedValues.mcq?.marksPerQuestion || 1,
        optionsCount: watchedValues.mcq?.optionsCount || 4,
        totalMarks: mcqTotal 
      },
      shortAnswer: { 
        ...watchedValues.shortAnswer, 
        count: watchedValues.shortAnswer?.count || 0,
        marksPerQuestion: watchedValues.shortAnswer?.marksPerQuestion || 5,
        wordLimit: watchedValues.shortAnswer?.wordLimit || 150,
        totalMarks: shortTotal 
      },
      longAnswer: { 
        ...watchedValues.longAnswer, 
        count: watchedValues.longAnswer?.count || 0,
        marksPerQuestion: watchedValues.longAnswer?.marksPerQuestion || 15,
        wordLimit: watchedValues.longAnswer?.wordLimit || 500,
        totalMarks: longTotal 
      },
      additional: {
        numericalProblems: watchedValues.additional?.numericalProblems || false,
        diagramBased: watchedValues.additional?.diagramBased || false,
        caseStudy: watchedValues.additional?.caseStudy || false
      }
    };

    onQuestionConfigChange(updatedConfig);
  }, [watchedValues, onQuestionConfigChange]);

  const onSubmit = () => {
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Question Configuration</h2>
        <p className="text-gray-600">Configure the types and distribution of questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MCQ Section */}
        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Multiple Choice Questions</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="0"
                {...register('mcq.count', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks per Question
              </label>
              <input
                type="number"
                min="1"
                {...register('mcq.marksPerQuestion', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Options
              </label>
              <select
                {...register('mcq.optionsCount', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={4}>4 Options</option>
                <option value={5}>5 Options</option>
              </select>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total MCQ Marks: <span className="text-blue-600">{questionConfig.mcq?.totalMarks || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Short Answer Section */}
        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Short Answer Questions</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="0"
                {...register('shortAnswer.count', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks per Question
              </label>
              <input
                type="number"
                min="1"
                {...register('shortAnswer.marksPerQuestion', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Limit
              </label>
              <input
                type="number"
                min="50"
                {...register('shortAnswer.wordLimit', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total Short Answer Marks: <span className="text-teal-600">{questionConfig.shortAnswer?.totalMarks || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Long Answer Section */}
        <motion.div
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Long Answer Questions</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                min="0"
                {...register('longAnswer.count', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks per Question
              </label>
              <input
                type="number"
                min="1"
                {...register('longAnswer.marksPerQuestion', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Limit
              </label>
              <input
                type="number"
                min="200"
                {...register('longAnswer.wordLimit', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Total Long Answer Marks: <span className="text-purple-600">{questionConfig.longAnswer?.totalMarks || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Options */}
      <motion.div
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        whileHover={{ y: -2, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Question Types (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('additional.numericalProblems')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Numerical Problems</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('additional.diagramBased')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Diagram-based Questions</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('additional.caseStudy')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Case Study Questions</span>
          </label>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          Back to Exam Details
        </button>
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
        >
          Generate Questions
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionConfigComponent;