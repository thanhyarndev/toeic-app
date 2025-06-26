'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

interface Question {
  correctAnswer: VocabularyItem;
  options: VocabularyItem[];
}

export default function ListeningPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<VocabularyItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const { drawCards, isReady } = useVocabularyDeck();

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsBrowserSupported(false);
    }
  }, []);

  const playAudio = useCallback((word: string) => {
    if (!isBrowserSupported || !word) return;
    
    speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isBrowserSupported]);

  const generateQuestion = useCallback(() => {
    if (!isReady) return;
    
    const items = drawCards(4);
    if (items.length < 4) return;

    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    const correctAnswer = items[0];

    setCurrentQuestion({
      correctAnswer,
      options: shuffledItems,
    });
    
    // Reset state
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    // Auto-play audio for the new question
    playAudio(correctAnswer.word);
  }, [drawCards, playAudio, isReady]);

  useEffect(() => {
    if (isReady) {
      generateQuestion();
    }
  }, [isReady]);

  const handleAnswerSelect = (answer: VocabularyItem) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer.word === currentQuestion?.correctAnswer.word;
    setIsCorrect(correct);
    
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  if (!isBrowserSupported) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-orange-900 dark:to-amber-900 flex items-center justify-center text-center p-4">
            <div>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Trình duyệt không được hỗ trợ</h1>
                <p className="text-gray-700 dark:text-gray-300">Tính năng Luyện nghe sử dụng Web Speech API không có sẵn trên trình duyệt của bạn. <br/> Vui lòng thử sử dụng một trình duyệt khác như Chrome hoặc Firefox.</p>
                <Link href="/" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">Quay về trang chủ</Link>
            </div>
        </div>
    );
  }

  if (!currentQuestion) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-orange-900 dark:to-amber-900 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 animate-ping"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Đang chuẩn bị câu hỏi...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-orange-900 dark:to-amber-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="group flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-all duration-200 font-medium">
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    Quay lại trang chủ
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Luyện nghe</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Đúng: {score.correct}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sai: {score.total - score.correct}</span>
                        </div>
                    </div>
                </div>
                <div className="w-32"></div>
            </div>

            {/* Listening Card */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
                        <div className="flex items-center justify-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a9 9 0 0112.728 0m-12.728 0a9 9 0 010 12.728m0-12.728L12 12" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Nghe và chọn đáp án đúng</h2>
                                <p className="text-orange-100 text-sm">Bấm vào loa để nghe lại từ</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Audio Player */}
                        <div className="text-center mb-10">
                            <button
                                onClick={() => playAudio(currentQuestion.correctAnswer.word)}
                                disabled={isSpeaking}
                                className="relative w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg flex items-center justify-center mx-auto transition-transform transform hover:scale-105"
                            >
                                {isSpeaking && <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse"></div>}
                                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2v6a1 1 0 102 0V5a1 1 0 00-2 0zM13 5a1 1 0 011-1h.01a1 1 0 110 2H14a1 1 0 01-1-1z" />
                                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zM6 6a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zM13 3a1 1 0 00-1 1v6a1 1 0 102 0V4a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer?.word === option.word;
                                const isCorrectAnswer = option.word === currentQuestion.correctAnswer.word;
                                let buttonClass = 'p-5 rounded-2xl border-2 text-left transition-all duration-300 font-medium transform hover:scale-105';

                                if (!selectedAnswer) {
                                    buttonClass += ' border-gray-200 hover:border-orange-300 dark:border-gray-600 dark:hover:border-orange-400';
                                } else {
                                    if (isCorrectAnswer) {
                                        buttonClass += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200';
                                    } else if (isSelected) {
                                        buttonClass += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200';
                                    } else {
                                        buttonClass += ' border-gray-200 bg-gray-50 dark:bg-gray-700 text-gray-500';
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
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4 font-bold text-gray-600 dark:text-gray-300">{String.fromCharCode(65 + index)}</div>
                                            <span className="text-xl">{option.shortMeaningVi}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button and Explanation */}
                        {selectedAnswer && (
                            <div className="mt-8 text-center animate-fade-in space-y-6">
                                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'}`}>
                                    {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng!'}
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{currentQuestion.correctAnswer.word}</h3>
                                    <p className="text-lg text-gray-500 dark:text-gray-400">/{currentQuestion.correctAnswer.phonetic}/</p>
                                    <p className="text-xl text-gray-700 dark:text-gray-300 mt-2">{currentQuestion.correctAnswer.shortMeaningVi}</p>
                                </div>
                                <button
                                    onClick={generateQuestion}
                                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                                >
                                    Câu tiếp theo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <style jsx>{`
            .bg-grid-pattern { background-image: linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px); background-size: 20px 20px; }
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
} 