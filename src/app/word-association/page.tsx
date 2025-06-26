'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowsRightLeftIcon,
  CheckIcon,
  XMarkIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

interface AssociationQuestion {
  mainWord: VocabularyItem;
  correctAnswer: string;
  options: string[];
  type: 'synonym' | 'antonym';
}

export default function WordAssociationPage() {
  const [currentQuestion, setCurrentQuestion] = useState<AssociationQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { isReady, deck } = useVocabularyDeck();

  const generateQuestion = useCallback(() => {
    if (!isReady || deck.length === 0) return;

    let questionItem: VocabularyItem | undefined;
    let questionType: 'synonym' | 'antonym' = 'synonym';

    const shuffledDeck = [...deck].sort(() => 0.5 - Math.random());

    for (const candidate of shuffledDeck) {
      const hasSynonyms = candidate.synonyms && candidate.synonyms.length > 0;
      const hasAntonyms = candidate.antonyms && candidate.antonyms.length > 0;

      if (hasSynonyms || hasAntonyms) {
        if (hasSynonyms && hasAntonyms) {
          questionType = Math.random() > 0.5 ? 'synonym' : 'antonym';
        } else if (hasSynonyms) {
          questionType = 'synonym';
        } else {
          questionType = 'antonym';
        }
        questionItem = candidate;
        break;
      }
    }
    
    if (!questionItem) {
      console.error("Could not find a word with synonyms/antonyms.");
      return;
    }

    const correctAnswerList = questionType === 'synonym' ? questionItem.synonyms : questionItem.antonyms;
    const correctAnswer = correctAnswerList[Math.floor(Math.random() * correctAnswerList.length)];

    const wrongOptions: string[] = [];
    const vocabularyWords = deck.map(item => item.word);
    const filteredVocab = vocabularyWords.filter(word => 
        word !== questionItem?.word && !correctAnswerList.includes(word)
    );
    
    while (wrongOptions.length < 3 && filteredVocab.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredVocab.length);
      const randomWord = filteredVocab[randomIndex];
      wrongOptions.push(randomWord);
      filteredVocab.splice(randomIndex, 1);
    }

    const options = [correctAnswer, ...wrongOptions].sort(() => 0.5 - Math.random());

    setCurrentQuestion({
      mainWord: questionItem,
      correctAnswer,
      options,
      type: questionType,
    });

    setSelectedAnswer('');
    setIsCorrect(null);
  }, [isReady, deck]);

  useEffect(() => {
    if (isReady) {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-teal-900 dark:to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Searching for word connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-slate-900 dark:via-teal-900 dark:to-cyan-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="group flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-all duration-200 font-medium">
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </div>
                    Quay lại trang chủ
                </Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Word Association</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                            <CheckIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Đúng: {score.correct}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                            <XMarkIcon className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sai: {score.total - score.correct}</span>
                        </div>
                    </div>
                </div>
                <div className="w-32"></div>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
                        <div className="flex items-center justify-center gap-3">
                             <LightBulbIcon className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">Tìm từ liên quan</h2>
                                <p className="text-teal-100 text-sm">Chọn từ {currentQuestion.type === 'synonym' ? 'đồng nghĩa' : 'trái nghĩa'} với từ cho sẵn</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-10">
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                Từ {currentQuestion.type === 'synonym' ? 'đồng nghĩa' : 'trái nghĩa'} với
                            </p>
                            <h3 className="text-5xl font-bold text-gray-800 dark:text-white">
                                {currentQuestion.mainWord.word}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">là gì?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                const isWrong = isSelected && !isCorrectAnswer;

                                let buttonClass = `relative p-6 rounded-2xl border-2 text-center transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg`;

                                if (!selectedAnswer) {
                                    buttonClass += ' border-gray-200 hover:border-teal-300 dark:border-gray-600 dark:hover:border-teal-400';
                                } else {
                                    if (isCorrectAnswer) buttonClass += ' border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200';
                                    else if (isWrong) buttonClass += ' border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200';
                                    else buttonClass += ' border-gray-200 bg-gray-50 dark:bg-gray-700 text-gray-500';
                                }

                                return (
                                    <button key={index} onClick={() => handleAnswerSelect(option)} disabled={!!selectedAnswer} className={buttonClass}>
                                        <span className="text-xl">{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {selectedAnswer && (
                    <div className="mt-8 text-center animate-fade-in space-y-6">
                        <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'}`}>
                            {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng!'}
                            {!isCorrect && <span className="ml-2">Đáp án đúng: {currentQuestion.correctAnswer}</span>}
                        </div>
                        <button onClick={generateQuestion} className="group block mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                            Câu tiếp theo
                        </button>
                    </div>
                )}
            </div>
        </div>
        <style jsx>{`
            .bg-grid-pattern { background-image: linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px); background-size: 20px 20px; }
            @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
} 