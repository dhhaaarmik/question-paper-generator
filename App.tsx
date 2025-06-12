import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from './components/Background3D';
import ProgressIndicator from './components/ProgressIndicator';
import FileUpload from './components/FileUpload';
import ExamForm from './components/ExamForm';
import QuestionConfig from './components/QuestionConfig';
import QuestionGeneration from './components/QuestionGeneration';
import QuestionPreview from './components/QuestionPreview';
import { Step, UploadedFile, ExamDetails, QuestionConfig as QuestionConfigType, GeneratedQuestion, QuestionPaper } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [examDetails, setExamDetails] = useState<ExamDetails>({
    universityName: '',
    branch: '',
    subject: '',
    examDate: '',
    examDuration: '',
    totalMarks: 100,
    openaiApiKey: ''
  });
  const [questionConfig, setQuestionConfig] = useState<QuestionConfigType>({
    mcq: {
      count: 10,
      marksPerQuestion: 1,
      optionsCount: 4,
      totalMarks: 10
    },
    shortAnswer: {
      count: 6,
      marksPerQuestion: 5,
      wordLimit: 150,
      totalMarks: 30
    },
    longAnswer: {
      count: 4,
      marksPerQuestion: 15,
      wordLimit: 500,
      totalMarks: 60
    },
    additional: {
      numericalProblems: false,
      diagramBased: false,
      caseStudy: false
    }
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [questionPaper, setQuestionPaper] = useState<QuestionPaper | null>(null);

  const handleFilesChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles);
  };

  const handleExamDetailsChange = (details: ExamDetails) => {
    setExamDetails(details);
  };

  const handleQuestionConfigChange = (config: QuestionConfigType) => {
    setQuestionConfig(config);
  };

  const handleQuestionsGenerated = (questions: GeneratedQuestion[]) => {
    setGeneratedQuestions(questions);
    const paper: QuestionPaper = {
      examDetails,
      questions,
      generatedAt: new Date()
    };
    setQuestionPaper(paper);
    setCurrentStep('preview');
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setFiles([]);
    setExamDetails({
      universityName: '',
      branch: '',
      subject: '',
      examDate: '',
      examDuration: '',
      totalMarks: 100,
      openaiApiKey: ''
    });
    setQuestionConfig({
      mcq: {
        count: 10,
        marksPerQuestion: 1,
        optionsCount: 4,
        totalMarks: 10
      },
      shortAnswer: {
        count: 6,
        marksPerQuestion: 5,
        wordLimit: 150,
        totalMarks: 30
      },
      longAnswer: {
        count: 4,
        marksPerQuestion: 15,
        wordLimit: 500,
        totalMarks: 60
      },
      additional: {
        numericalProblems: false,
        diagramBased: false,
        caseStudy: false
      }
    });
    setGeneratedQuestions([]);
    setQuestionPaper(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <FileUpload
            files={files}
            onFilesChange={handleFilesChange}
            onNext={() => setCurrentStep('details')}
          />
        );
      case 'details':
        return (
          <ExamForm
            examDetails={examDetails}
            onExamDetailsChange={handleExamDetailsChange}
            onNext={() => setCurrentStep('config')}
            onBack={() => setCurrentStep('upload')}
          />
        );
      case 'config':
        return (
          <QuestionConfig
            questionConfig={questionConfig}
            examDetails={examDetails}
            onQuestionConfigChange={handleQuestionConfigChange}
            onNext={() => setCurrentStep('generate')}
            onBack={() => setCurrentStep('details')}
          />
        );
      case 'generate':
        return (
          <QuestionGeneration
            examDetails={examDetails}
            questionConfig={questionConfig}
            files={files}
            onQuestionsGenerated={handleQuestionsGenerated}
            onBack={() => setCurrentStep('config')}
          />
        );
      case 'preview':
        return questionPaper ? (
          <QuestionPreview
            questionPaper={questionPaper}
            onStartOver={handleStartOver}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background3D />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              AI Question Paper Generator
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Create professional, customized question papers using AI technology
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} />

          {/* Main Content */}
          <motion.div
            className="max-w-6xl mx-auto"
            layout
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 text-gray-500"
          >
            <p>© 2025 AI Question Paper Generator. Powered by advanced AI technology.</p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}

export default App;