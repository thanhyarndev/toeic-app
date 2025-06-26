'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import Link from 'next/link';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

export default function FillBlankPage() {
  const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const { drawCards, isReady } = useVocabularyDeck();

  const getNewWord = () => {
    if (!isReady) return;
    
    const [newWord] = drawCards(1);
    if (newWord) {
      setCurrentWord(newWord);
      setUserInput('');
      setIsCorrect(null);
      setShowResult(false);
    }
  };
  
  useEffect(() => {
    if (isReady) {
      getNewWord();
    }
  }, [isReady]);

  useEffect(() => {
    if (!showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentWord, showResult]);

  const handleCheckAnswer = (e: FormEvent) => {
    e.preventDefault();
    if (!currentWord || userInput.trim() === '') return;

    const correct = userInput.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  if (!currentWord) {
    // Reusing the beautiful loader from the previous page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-400 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Đang chuẩn bị từ vựng...</p>
        </div>
      </div>
    );
  }

  const wordLetters = currentWord.word.split('');
  const inputLetters = userInput.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header (similar to multiple-choice page) */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="group flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-all duration-200 font-medium"
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
              Điền từ
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
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Question & Input Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.5 3.964z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Điền từ còn thiếu</h2>
                  <p className="text-green-100 text-sm">Gõ từ tiếng Anh tương ứng với nghĩa bên dưới</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Từ tiếng Anh của</p>
                <div className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6">
                  <h3 className="text-4xl font-bold text-gray-800 dark:text-white">
                    "{currentWord.shortMeaningVi}"
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">là gì?</p>
              </div>

              {!showResult ? (
                <form onSubmit={handleCheckAnswer} className="flex flex-col items-center gap-6">
                  <div 
                    className="relative flex justify-center flex-wrap gap-2 md:gap-3 cursor-text"
                    onClick={() => inputRef.current?.focus()}
                  >
                    {wordLetters.map((char, index) => (
                      <div
                        key={index}
                        className="relative flex items-center justify-center w-12 h-16 md:w-14 md:h-20 bg-gray-100/70 dark:bg-gray-700/50 rounded-lg"
                      >
                        <span className="absolute bottom-2 left-0 right-0 h-1 bg-gray-400 dark:bg-gray-500 group-focus-within:bg-green-500 transition-colors"></span>
                        <span className="text-4xl font-bold text-gray-800 dark:text-white">
                          {inputLetters[index]}
                        </span>
                      </div>
                    ))}
                     <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      maxLength={currentWord.word.length}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                      autoFocus
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!userInput.trim()}
                  >
                    Kiểm tra
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <button
                    onClick={getNewWord}
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
          
          {/* Explanation Section */}
          {showResult && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="text-center">
                <div className={`
                  inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg
                  ${isCorrect 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }
                `}>
                  {isCorrect ? (
                    '✅ Chính xác!'
                  ) : (
                    '❌ Chưa đúng!'
                  )}
                </div>
                {!isCorrect && (
                  <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Đáp án đúng là: <span className="font-bold text-green-600 dark:text-green-400 text-lg">{currentWord.word}</span>
                  </p>
                )}
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {currentWord.word}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-gray-500 dark:text-gray-400">
                        /{currentWord.phonetic}/
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-medium">
                        {currentWord.type}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-medium">
                        {currentWord.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-l-4 border-green-500">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Ví dụ sử dụng
                  </h4>
                  <div className="space-y-3">
                    <p className="text-lg text-gray-800 dark:text-white italic font-medium">
                      "{currentWord.example}"
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      "{currentWord.exampleMeaning}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 