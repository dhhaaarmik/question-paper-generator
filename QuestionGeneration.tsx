import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { ExamDetails, QuestionConfig, UploadedFile, GeneratedQuestion } from '../types';
import { generateQuestions } from '../utils/openaiClient';

interface QuestionGenerationProps {
  examDetails: ExamDetails;
  questionConfig: QuestionConfig;
  files: UploadedFile[];
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
  onBack: () => void;
}

const QuestionGeneration: React.FC<QuestionGenerationProps> = ({
  examDetails,
  questionConfig,
  files,
  onQuestionsGenerated,
  onBack
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);

  const generateQuestionPaper = async () => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      setCurrentStep('Preparing content...');
      setProgress(20);

      const extractedTexts = files
        .filter(f => f.extractedText)
        .map(f => f.extractedText!);

      if (extractedTexts.length === 0) {
        throw new Error('No valid content found in uploaded files');
      }

      setCurrentStep('Generating questions with AI...');
      setProgress(50);

      const questions = await generateQuestions(
        examDetails.openaiApiKey,
        examDetails,
        questionConfig,
        extractedTexts
      );

      setCurrentStep('Finalizing question paper...');
      setProgress(90);

      setGeneratedQuestions(questions);
      onQuestionsGenerated(questions);

      setCurrentStep('Complete!');
      setProgress(100);
    } catch (err) {
      console.error('Error generating questions:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateQuestionPaper();
  }, []);

  const retryGeneration = () => {
    setError(null);
    generateQuestionPaper();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Generating Question Paper</h2>
        <p className="text-gray-600">AI is creating your customized question paper</p>
      </div>

      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <div className="text-red-600 font-medium mb-2">Generation Failed</div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={retryGeneration}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Generation
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Configuration
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-blue-600"
                initial={{ strokeDasharray: "0 400" }}
                animate={{ strokeDasharray: `${progress * 4} 400` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {progress === 100 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{progress}%</div>
                  {isGenerating && <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mt-1" />}
                </div>
              )}
            </div>
          </div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-medium text-gray-800">{currentStep}</span>
            </div>
            {isGenerating && (
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>

          {/* Generation Summary */}
          {generatedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-green-800 mb-4">Generation Complete!</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {generatedQuestions.filter(q => q.type === 'mcq').length}
                  </div>
                  <div className="text-gray-700">MCQ Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {generatedQuestions.filter(q => q.type === 'short').length}
                  </div>
                  <div className="text-gray-700">Short Answer</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {generatedQuestions.filter(q => q.type === 'long').length}
                  </div>
                  <div className="text-gray-700">Long Answer</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading Animation */}
          {isGenerating && (
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-center"
            >
              <div className="inline-flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-blue-600 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default QuestionGeneration;