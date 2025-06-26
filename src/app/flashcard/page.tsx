'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckIcon, 
  XMarkIcon, 
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

interface FlashcardProgress {
  [word: string]: {
    status: 'new' | 'learning' | 'known' | 'review';
    lastReviewed: number;
    reviewCount: number;
    nextReview: number;
  };
}

export default function FlashcardPage() {
  const [currentCard, setCurrentCard] = useState<VocabularyItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState<FlashcardProgress>({});
  const [showStats, setShowStats] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allCards, setAllCards] = useState<VocabularyItem[]>([]);
  const { drawCards, isReady } = useVocabularyDeck();

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('flashcard-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('flashcard-progress', JSON.stringify(progress));
  }, [progress]);

  // Initialize cards
  useEffect(() => {
    if (isReady) {
      const cards = drawCards(50); // Get more cards for flashcard mode
      setAllCards(cards);
      if (cards.length > 0) {
        setCurrentCard(cards[0]);
      }
    }
  }, [isReady]);

  const getNextCard = useCallback(() => {
    if (currentIndex < allCards.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentCard(allCards[nextIndex]);
      setIsFlipped(false);
    }
  }, [currentIndex, allCards]);

  const getPreviousCard = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentCard(allCards[prevIndex]);
      setIsFlipped(false);
    }
  }, [currentIndex, allCards]);

  const handleCardAction = (action: 'known' | 'learning' | 'review') => {
    if (!currentCard) return;

    const now = Date.now();
    const cardProgress = progress[currentCard.word] || {
      status: 'new',
      lastReviewed: 0,
      reviewCount: 0,
      nextReview: 0
    };

    let nextReview = now;
    switch (action) {
      case 'known':
        nextReview = now + (24 * 60 * 60 * 1000 * 7); // 7 days
        break;
      case 'learning':
        nextReview = now + (24 * 60 * 60 * 1000); // 1 day
        break;
      case 'review':
        nextReview = now + (60 * 60 * 1000); // 1 hour
        break;
    }

    const updatedProgress = {
      ...progress,
      [currentCard.word]: {
        status: action,
        lastReviewed: now,
        reviewCount: cardProgress.reviewCount + 1,
        nextReview
      }
    };

    setProgress(updatedProgress);
    getNextCard();
  };

  const resetProgress = () => {
    setProgress({});
    setCurrentIndex(0);
    if (allCards.length > 0) {
      setCurrentCard(allCards[0]);
    }
    setIsFlipped(false);
  };

  const getStats = () => {
    const total = Object.keys(progress).length;
    const known = Object.values(progress).filter(p => p.status === 'known').length;
    const learning = Object.values(progress).filter(p => p.status === 'learning').length;
    const review = Object.values(progress).filter(p => p.status === 'review').length;
    const newCards = Object.values(progress).filter(p => p.status === 'new').length;

    return { total, known, learning, review, newCards };
  };

  const stats = getStats();

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Đang chuẩn bị thẻ từ vựng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="group flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-all duration-200 font-medium"
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
              Flashcard Mode
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đã biết: {stats.known}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                <ClockIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đang học: {stats.learning}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 px-4 py-2 rounded-full">
                <ArrowPathIcon className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cần ôn: {stats.review}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ChartBarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </button>
            <button
              onClick={resetProgress}
              className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              title="Reset progress"
            >
              <ArrowPathIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tiến độ: {currentIndex + 1} / {allCards.length}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {Math.round(((currentIndex + 1) / allCards.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / allCards.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={getPreviousCard}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={getNextCard}
              disabled={currentIndex === allCards.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Card */}
            <div className="max-w-2xl mx-auto perspective-1000">
              <div 
                className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front of card */}
                <div className={`absolute inset-0 w-full h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 flex flex-col items-center justify-center backface-hidden`}>
                  <div className="text-center">
                    <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                      {currentCard.word}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="text-xl text-gray-500 dark:text-gray-400 font-mono">
                        /{currentCard.phonetic}/
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full font-medium">
                        {currentCard.type}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Bấm để xem nghĩa
                    </p>
                    <div className="mt-4">
                      {isFlipped ? (
                        <EyeSlashIcon className="w-8 h-8 text-gray-400 mx-auto" />
                      ) : (
                        <EyeIcon className="w-8 h-8 text-gray-400 mx-auto" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180`}>
                  <div className="text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">
                      {currentCard.shortMeaningVi}
                    </h3>
                    <p className="text-xl mb-6 opacity-90">
                      {currentCard.meaningVi}
                    </p>
                    <div className="bg-white/20 rounded-2xl p-4 mb-4">
                      <p className="text-lg italic mb-2">
                        "{currentCard.example}"
                      </p>
                      <p className="text-sm opacity-80">
                        "{currentCard.exampleMeaning}"
                      </p>
                    </div>
                    <p className="text-sm opacity-80">
                      Bấm để quay lại
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isFlipped && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => handleCardAction('review')}
                className="group bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Cần ôn lại
              </button>
              <button
                onClick={() => handleCardAction('learning')}
                className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <ClockIcon className="w-5 h-5" />
                Đang học
              </button>
              <button
                onClick={() => handleCardAction('known')}
                className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                Đã biết
              </button>
            </div>
          )}
        </div>

        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                Thống kê học tập
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-700 dark:text-green-300">Đã biết</span>
                  <span className="font-bold text-green-700 dark:text-green-300">{stats.known}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-700 dark:text-blue-300">Đang học</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{stats.learning}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-orange-700 dark:text-orange-300">Cần ôn</span>
                  <span className="font-bold text-orange-700 dark:text-orange-300">{stats.review}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Tổng cộng</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{stats.total}</span>
                </div>
              </div>
              <button
                onClick={() => setShowStats(false)}
                className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-2xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
} 