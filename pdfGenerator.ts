import jsPDF from 'jspdf';
import { QuestionPaper } from '../types';
import { format } from 'date-fns';

export function generateQuestionPaperPDF(questionPaper: QuestionPaper): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(questionPaper.examDetails.universityName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  doc.setFontSize(14);
  doc.text(`Department of ${questionPaper.examDetails.branch}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subject: ${questionPaper.examDetails.subject}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 12;

  // Exam details
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(questionPaper.examDetails.examDate), 'dd/MM/yyyy')}`, margin, yPosition);
  doc.text(`Duration: ${questionPaper.examDetails.examDuration}`, pageWidth - margin - 50, yPosition);
  yPosition += 5;
  doc.text(`Total Marks: ${questionPaper.examDetails.totalMarks}`, margin, yPosition);
  yPosition += 15;

  // Instructions
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions:', margin, yPosition);
  yPosition += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('1. Answer all questions', margin + 5, yPosition);
  yPosition += 4;
  doc.text('2. Write clearly and legibly', margin + 5, yPosition);
  yPosition += 4;
  doc.text('3. Time management is crucial', margin + 5, yPosition);
  yPosition += 12;

  // Questions
  let questionNumber = 1;
  let sectionLetter = 'A';

  // MCQ Section
  const mcqQuestions = questionPaper.questions.filter(q => q.type === 'mcq');
  if (mcqQuestions.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Section ${sectionLetter}: Multiple Choice Questions`, margin, yPosition);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
    yPosition += 8;

    mcqQuestions.forEach(question => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${questionNumber}. ${question.question} (${question.marks} marks)`, margin, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      question.options?.forEach((option, index) => {
        const optionLetter = String.fromCharCode(65 + index);
        doc.text(`${optionLetter}) ${option}`, margin + 5, yPosition);
        yPosition += 5;
      });

      yPosition += 5;
      questionNumber++;
    });
    yPosition += 5;
  }

  // Short Answer Section
  const shortQuestions = questionPaper.questions.filter(q => q.type === 'short');
  if (shortQuestions.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Section ${sectionLetter}: Short Answer Questions`, margin, yPosition);
    sectionLetter = String.fromCharCode(sectionLetter.charCodeAt(0) + 1);
    yPosition += 8;

    shortQuestions.forEach(question => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${questionNumber}. ${question.question} (${question.marks} marks)`, margin, yPosition, {
        maxWidth: pageWidth - 2 * margin
      });
      yPosition += 15;
      questionNumber++;
    });
    yPosition += 5;
  }

  // Long Answer Section
  const longQuestions = questionPaper.questions.filter(q => q.type === 'long');
  if (longQuestions.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Section ${sectionLetter}: Long Answer Questions`, margin, yPosition);
    yPosition += 8;

    longQuestions.forEach(question => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${questionNumber}. ${question.question} (${question.marks} marks)`, margin, yPosition, {
        maxWidth: pageWidth - 2 * margin
      });
      yPosition += 20;
      questionNumber++;
    });
  }

  doc.save(`${questionPaper.examDetails.subject}_Question_Paper.pdf`);
}

export function generateAnswerSheetPDF(questionPaper: QuestionPaper): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${questionPaper.examDetails.subject} - Answer Sheet`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`${questionPaper.examDetails.universityName}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  let questionNumber = 1;

  questionPaper.questions.forEach(question => {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = margin;
    }

    // Question
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${questionNumber}. ${question.question}`, margin, yPosition, {
      maxWidth: pageWidth - 2 * margin
    });
    yPosition += 8;

    // Answer
    doc.setFont('helvetica', 'normal');
    if (question.type === 'mcq') {
      doc.text(`Correct Answer: ${question.correctAnswer}`, margin + 5, yPosition);
      yPosition += 5;
      doc.text(`Explanation: ${question.answer}`, margin + 5, yPosition, {
        maxWidth: pageWidth - 2 * margin - 10
      });
      yPosition += 10;
    } else {
      const answerLines = doc.splitTextToSize(question.answer, pageWidth - 2 * margin - 10);
      answerLines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 5;
    }

    yPosition += 5;
    questionNumber++;
  });

  doc.save(`${questionPaper.examDetails.subject}_Answer_Sheet.pdf`);
}