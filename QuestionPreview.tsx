import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Eye, Calendar, Clock, GraduationCap } from 'lucide-react';
import { QuestionPaper } from '../types';
import { generateQuestionPaperPDF, generateAnswerSheetPDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

interface QuestionPreviewProps {
  questionPaper: QuestionPaper;
  onStartOver: () => void;
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ questionPaper, onStartOver }) => {
  const handleDownloadQuestions = () => {
    generateQuestionPaperPDF(questionPaper);
  };

  const handleDownloadAnswers = () => {
    generateAnswerSheetPDF(questionPaper);
  };

  const mcqQuestions = questionPaper.questions.filter(q => q.type === 'mcq');
  const shortQuestions = questionPaper.questions.filter(q => q.type === 'short');
  const longQuestions = questionPaper.questions.filter(q => q.type === 'long');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Question Paper Preview</h2>
        <p className="text-gray-600">Review your generated question paper before downloading</p>
      </div>

      {/* Download Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <motion.button
          onClick={handleDownloadQuestions}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-5 h-5" />
          <span>Download Question Paper</span>
        </motion.button>
        <motion.button
          onClick={handleDownloadAnswers}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="w-5 h-5" />
          <span>Download Answer Sheet</span>
        </motion.button>
      </div>

      {/* Question Paper Preview */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {questionPaper.examDetails.universityName}
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Department of {questionPaper.examDetails.branch}
          </h2>
          <h3 className="text-base text-gray-600 mb-4">
            Subject: {questionPaper.examDetails.subject}
          </h3>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Date: {questionPaper.examDetails.examDate ? format(new Date(questionPaper.examDetails.examDate), 'dd/MM/yyyy') : 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Duration: {questionPaper.examDetails.examDuration || 'TBD'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GraduationCap className="w-4 h-4" />
              <span>Total Marks: {questionPaper.examDetails.totalMarks}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Answer all questions</li>
            <li>• Read each question carefully before answering</li>
            <li>• Time management is crucial</li>
            <li>• Write clearly and legibly</li>
          </ul>
        </div>

        {/* Questions */}
        <div className="p-8 space-y-8">
          {mcqQuestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Section A: Multiple Choice Questions</h3>
              <div className="space-y-6">
                {mcqQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <p className="font-medium text-gray-800 mb-2">
                      {index + 1}. {question.question} ({question.marks} marks)
                    </p>
                    <div className="space-y-1 ml-4">
                      {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="text-gray-700">
                          {String.fromCharCode(65 + optIndex)}) {option}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {shortQuestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Section B: Short Answer Questions</h3>
              <div className="space-y-6">
                {shortQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (mcqQuestions.length + index) * 0.1 }}
                    className="border-l-4 border-teal-500 pl-4"
                  >
                    <p className="font-medium text-gray-800">
                      {mcqQuestions.length + index + 1}. {question.question} ({question.marks} marks)
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {longQuestions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Section C: Long Answer Questions</h3>
              <div className="space-y-6">
                {longQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (mcqQuestions.length + shortQuestions.length + index) * 0.1 }}
                    className="border-l-4 border-purple-500 pl-4"
                  >
                    <p className="font-medium text-gray-800">
                      {mcqQuestions.length + shortQuestions.length + index + 1}. {question.question} ({question.marks} marks)
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4 pt-8">
        <button
          onClick={onStartOver}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Generate New Paper
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionPreview;