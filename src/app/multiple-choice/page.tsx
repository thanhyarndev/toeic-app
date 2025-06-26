'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

interface Question {
  question: string;
  correctAnswer: string;
  options: string[];
  questionType: 'word-to-meaning' | 'meaning-to-word';
  questionItem: VocabularyItem;
}

export default function MultipleChoicePage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { drawCards, isReady } = useVocabularyDeck();

  // Generate a new question using the vocabulary deck
  const generateQuestion = () => {
    if (!isReady) return;
    
    const drawnItems = drawCards(4);
    if (drawnItems.length < 4) return; // Not enough cards to create a question

    const [questionItem, ...wrongItems] = drawnItems;
    const questionType = Math.random() > 0.5 ? 'word-to-meaning' : 'meaning-to-word';
    
    let question: string;
    let correctAnswer: string;
    let options: string[];

    if (questionType === 'word-to-meaning') {
      question = questionItem.word;
      correctAnswer = questionItem.shortMeaningVi;
      options = [
        correctAnswer,
        ...wrongItems.map(item => item.shortMeaningVi)
      ];
    } else {
      question = questionItem.shortMeaningVi;
      correctAnswer = questionItem.word;
      options = [
        correctAnswer,
        ...wrongItems.map(item => item.word)
      ];
    }

    // Shuffle the options
    const shuffledOptions = options.sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      question,
      correctAnswer,
      options: shuffledOptions,
      questionType,
      questionItem
    });

    // Reset state for the new question
    setSelectedAnswer('');
    setIsCorrect(null);
  };

  // Initial question generation
  useEffect(() => {
    if (isReady) {
      generateQuestion();
    }
  }, [isReady]);

  // Handle selecting an answer
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  // The 'Next Question' button will now just call generateQuestion
  const nextQuestion = () => {
    generateQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Đang chuẩn bị câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="group flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 font-medium"
          >
            <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Quay lại trang chủ
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Trắc nghiệm từ vựng
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đúng: {score.correct}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sai: {score.total - score.correct}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-full">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  Tổng: {score.total}
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Question Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {/* Question Type Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {currentQuestion.questionType === 'word-to-meaning' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {currentQuestion.questionType === 'word-to-meaning' 
                      ? 'Từ tiếng Anh → Nghĩa tiếng Việt' 
                      : 'Nghĩa tiếng Việt → Từ tiếng Anh'
                    }
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Chọn đáp án chính xác nhất
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Question */}
              <div className="text-center mb-10">
                <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 mb-6">
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                    {currentQuestion.question}
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                  {currentQuestion.questionType === 'word-to-meaning' 
                    ? 'Nghĩa của từ này là gì?' 
                    : 'Từ tiếng Anh tương ứng là gì?'
                  }
                </p>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAnswer = option === currentQuestion.correctAnswer;
                  const isWrong = isSelected && !isCorrectAnswer;
                  
                  let buttonClass = `
                    relative p-6 rounded-2xl border-2 text-left transition-all duration-300 font-medium
                    transform hover:scale-105 hover:shadow-lg
                    ${!selectedAnswer 
                      ? 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:from-gray-700 dark:hover:to-gray-600' 
                      : ''
                    }
                  `;

                  if (selectedAnswer) {
                    if (isCorrectAnswer) {
                      buttonClass += ' border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-800 dark:text-green-200 shadow-lg';
                    } else if (isWrong) {
                      buttonClass += ' border-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-800 dark:text-red-200 shadow-lg';
                    } else {
                      buttonClass += ' border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={!!selectedAnswer}
                      className={buttonClass}
                    >
                      <div className="flex items-center">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center mr-4 font-bold text-lg shadow-md
                          ${!selectedAnswer 
                            ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 dark:from-gray-700 dark:to-gray-600 dark:text-gray-300' 
                            : isCorrectAnswer 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' 
                              : isWrong 
                                ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
                                : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 dark:from-gray-600 dark:to-gray-500 dark:text-gray-400'
                          }
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-xl">{option}</span>
                      </div>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4">
                          {isCorrectAnswer ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result Message and Explanation */}
              {selectedAnswer && (
                <div className="space-y-6">
                  {/* Result Badge */}
                  <div className="text-center">
                    <div className={`
                      inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg
                      ${isCorrect 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      }
                    `}>
                      {isCorrect ? (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Tuyệt vời! Đáp án chính xác
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Chưa đúng! Hãy học thêm
                        </>
                      )}
                    </div>
                    {!isCorrect && (
                      <p className="mt-3 text-gray-600 dark:text-gray-300">
                        Đáp án đúng: <span className="font-bold text-green-600 dark:text-green-400 text-lg">{currentQuestion.correctAnswer}</span>
                      </p>
                    )}
                  </div>

                  {/* Word Explanation */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-3xl p-8 border border-gray-200/50 dark:border-gray-600/50">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                          {currentQuestion.questionItem.word}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-lg text-gray-500 dark:text-gray-400 font-mono">
                            /{currentQuestion.questionItem.phonetic}/
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-medium">
                            {currentQuestion.questionItem.type}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-medium">
                            {currentQuestion.questionItem.level}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>

                    {/* Meanings */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Nghĩa ngắn
                        </h4>
                        <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                          {currentQuestion.questionItem.shortMeaningVi}
                        </p>
                      </div>
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Nghĩa đầy đủ
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {currentQuestion.questionItem.meaningVi}
                        </p>
                      </div>
                    </div>

                    {/* Example */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-l-4 border-blue-500">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Ví dụ sử dụng
                      </h4>
                      <div className="space-y-3">
                        <p className="text-lg text-gray-800 dark:text-white italic font-medium">
                          "{currentQuestion.questionItem.example}"
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          "{currentQuestion.questionItem.exampleMeaning}"
                        </p>
                      </div>
                    </div>

                    {/* Synonyms and Antonyms */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {currentQuestion.questionItem.synonyms.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4">
                          <h4 className="text-sm font-bold text-green-700 dark:text-green-300 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Từ đồng nghĩa
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {currentQuestion.questionItem.synonyms.join(', ')}
                          </p>
                        </div>
                      )}
                      {currentQuestion.questionItem.antonyms.length > 0 && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4">
                          <h4 className="text-sm font-bold text-red-700 dark:text-red-300 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Từ trái nghĩa
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {currentQuestion.questionItem.antonyms.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {selectedAnswer && (
                <div className="text-center mt-8">
                  <button
                    onClick={nextQuestion}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center">
                      Câu hỏi tiếp theo
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
} 