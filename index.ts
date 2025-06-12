export interface ExamDetails {
  universityName: string;
  branch: string;
  subject: string;
  examDate: string;
  examDuration: string;
  totalMarks: number;
  openaiApiKey: string;
}

export interface QuestionConfig {
  mcq: {
    count: number;
    marksPerQuestion: number;
    optionsCount: 4 | 5;
    totalMarks: number;
  };
  shortAnswer: {
    count: number;
    marksPerQuestion: number;
    wordLimit: number;
    totalMarks: number;
  };
  longAnswer: {
    count: number;
    marksPerQuestion: number;
    wordLimit: number;
    totalMarks: number;
  };
  additional: {
    numericalProblems: boolean;
    diagramBased: boolean;
    caseStudy: boolean;
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  extractedText?: string;
  isProcessing?: boolean;
}

export interface GeneratedQuestion {
  id: string;
  type: 'mcq' | 'short' | 'long';
  question: string;
  options?: string[];
  correctAnswer?: string;
  answer: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface QuestionPaper {
  examDetails: ExamDetails;
  questions: GeneratedQuestion[];
  generatedAt: Date;
}

export type Step = 'upload' | 'details' | 'config' | 'generate' | 'preview';