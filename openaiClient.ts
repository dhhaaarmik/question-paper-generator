import OpenAI from 'openai';
import { ExamDetails, QuestionConfig, GeneratedQuestion } from '../types';

export async function generateQuestions(
  apiKey: string,
  examDetails: ExamDetails,
  questionConfig: QuestionConfig,
  extractedTexts: string[]
): Promise<GeneratedQuestion[]> {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const combinedText = extractedTexts.join('\n\n');
  const questions: GeneratedQuestion[] = [];

  try {
    // Generate MCQ questions
    if (questionConfig.mcq.count > 0) {
      const mcqPrompt = createMCQPrompt(examDetails, questionConfig.mcq, combinedText);
      const mcqResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: mcqPrompt }],
        temperature: 0.7,
      });

      const mcqQuestions = parseMCQResponse(mcqResponse.choices[0].message.content || '', questionConfig.mcq);
      questions.push(...mcqQuestions);
    }

    // Generate Short Answer questions
    if (questionConfig.shortAnswer.count > 0) {
      const shortPrompt = createShortAnswerPrompt(examDetails, questionConfig.shortAnswer, combinedText);
      const shortResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: shortPrompt }],
        temperature: 0.7,
      });

      const shortQuestions = parseShortAnswerResponse(shortResponse.choices[0].message.content || '', questionConfig.shortAnswer);
      questions.push(...shortQuestions);
    }

    // Generate Long Answer questions
    if (questionConfig.longAnswer.count > 0) {
      const longPrompt = createLongAnswerPrompt(examDetails, questionConfig.longAnswer, combinedText);
      const longResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: longPrompt }],
        temperature: 0.7,
      });

      const longQuestions = parseLongAnswerResponse(longResponse.choices[0].message.content || '', questionConfig.longAnswer);
      questions.push(...longQuestions);
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please check your API key and try again.');
  }
}

function createMCQPrompt(examDetails: ExamDetails, mcqConfig: any, content: string): string {
  return `Based on the following study material for ${examDetails.subject} (${examDetails.branch}), create ${mcqConfig.count} multiple choice questions.

Study Material:
${content.substring(0, 8000)}

Requirements:
- Create exactly ${mcqConfig.count} MCQ questions
- Each question should have ${mcqConfig.optionsCount} options (A, B, C, D${mcqConfig.optionsCount === 5 ? ', E' : ''})
- Questions should cover different topics from the material
- Mix of easy, medium, and hard difficulty levels
- Each question is worth ${mcqConfig.marksPerQuestion} marks

Format your response exactly like this for each question:
QUESTION [number]: [question text]
A) [option 1]
B) [option 2]
C) [option 3]
D) [option 4]${mcqConfig.optionsCount === 5 ? '\nE) [option 5]' : ''}
CORRECT_ANSWER: [letter]
EXPLANATION: [brief explanation]
TOPIC: [topic name]
DIFFICULTY: [easy/medium/hard]
---`;
}

function createShortAnswerPrompt(examDetails: ExamDetails, shortConfig: any, content: string): string {
  return `Based on the following study material for ${examDetails.subject} (${examDetails.branch}), create ${shortConfig.count} short answer questions.

Study Material:
${content.substring(0, 8000)}

Requirements:
- Create exactly ${shortConfig.count} short answer questions
- Each answer should be around ${shortConfig.wordLimit} words
- Questions should cover different topics from the material
- Mix of easy, medium, and hard difficulty levels
- Each question is worth ${shortConfig.marksPerQuestion} marks

Format your response exactly like this for each question:
QUESTION [number]: [question text]
ANSWER: [detailed answer in approximately ${shortConfig.wordLimit} words]
TOPIC: [topic name]
DIFFICULTY: [easy/medium/hard]
---`;
}

function createLongAnswerPrompt(examDetails: ExamDetails, longConfig: any, content: string): string {
  return `Based on the following study material for ${examDetails.subject} (${examDetails.branch}), create ${longConfig.count} long answer questions.

Study Material:
${content.substring(0, 8000)}

Requirements:
- Create exactly ${longConfig.count} long answer questions
- Each answer should be around ${longConfig.wordLimit} words
- Questions should cover different topics from the material
- Mix of easy, medium, and hard difficulty levels
- Each question is worth ${longConfig.marksPerQuestion} marks

Format your response exactly like this for each question:
QUESTION [number]: [question text]
ANSWER: [comprehensive answer in approximately ${longConfig.wordLimit} words]
TOPIC: [topic name]
DIFFICULTY: [easy/medium/hard]
---`;
}

function parseMCQResponse(response: string, mcqConfig: any): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const questionBlocks = response.split('---').filter(block => block.trim());

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionLine = lines.find(line => line.startsWith('QUESTION'));
    const correctAnswerLine = lines.find(line => line.startsWith('CORRECT_ANSWER:'));
    const explanationLine = lines.find(line => line.startsWith('EXPLANATION:'));
    const topicLine = lines.find(line => line.startsWith('TOPIC:'));
    const difficultyLine = lines.find(line => line.startsWith('DIFFICULTY:'));

    const options = lines.filter(line => /^[A-E]\)/.test(line.trim()));

    if (questionLine && options.length >= 4) {
      questions.push({
        id: `mcq-${index + 1}`,
        type: 'mcq',
        question: questionLine.replace(/QUESTION \d+:\s*/, ''),
        options: options.map(opt => opt.substring(3).trim()),
        correctAnswer: correctAnswerLine?.replace('CORRECT_ANSWER:', '').trim() || 'A',
        answer: explanationLine?.replace('EXPLANATION:', '').trim() || '',
        marks: mcqConfig.marksPerQuestion,
        difficulty: (difficultyLine?.replace('DIFFICULTY:', '').trim() as any) || 'medium',
        topic: topicLine?.replace('TOPIC:', '').trim() || 'General'
      });
    }
  });

  return questions;
}

function parseShortAnswerResponse(response: string, shortConfig: any): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const questionBlocks = response.split('---').filter(block => block.trim());

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionLine = lines.find(line => line.startsWith('QUESTION'));
    const answerLine = lines.find(line => line.startsWith('ANSWER:'));
    const topicLine = lines.find(line => line.startsWith('TOPIC:'));
    const difficultyLine = lines.find(line => line.startsWith('DIFFICULTY:'));

    if (questionLine && answerLine) {
      questions.push({
        id: `short-${index + 1}`,
        type: 'short',
        question: questionLine.replace(/QUESTION \d+:\s*/, ''),
        answer: answerLine.replace('ANSWER:', '').trim(),
        marks: shortConfig.marksPerQuestion,
        difficulty: (difficultyLine?.replace('DIFFICULTY:', '').trim() as any) || 'medium',
        topic: topicLine?.replace('TOPIC:', '').trim() || 'General'
      });
    }
  });

  return questions;
}

function parseLongAnswerResponse(response: string, longConfig: any): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const questionBlocks = response.split('---').filter(block => block.trim());

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionLine = lines.find(line => line.startsWith('QUESTION'));
    const answerStart = lines.findIndex(line => line.startsWith('ANSWER:'));
    const topicLine = lines.find(line => line.startsWith('TOPIC:'));
    const difficultyLine = lines.find(line => line.startsWith('DIFFICULTY:'));

    if (questionLine && answerStart !== -1) {
      const answerLines = lines.slice(answerStart).filter(line => 
        !line.startsWith('TOPIC:') && !line.startsWith('DIFFICULTY:')
      );
      const answer = answerLines.join('\n').replace('ANSWER:', '').trim();

      questions.push({
        id: `long-${index + 1}`,
        type: 'long',
        question: questionLine.replace(/QUESTION \d+:\s*/, ''),
        answer: answer,
        marks: longConfig.marksPerQuestion,
        difficulty: (difficultyLine?.replace('DIFFICULTY:', '').trim() as any) || 'medium',
        topic: topicLine?.replace('TOPIC:', '').trim() || 'General'
      });
    }
  });

  return questions;
}