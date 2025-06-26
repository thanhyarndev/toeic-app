'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useVocabularyDeck from '@/hooks/useVocabularyDeck';
import type { VocabularyItem } from '@/types/vocabulary';

interface SortableItemProps {
  id: string;
  word: string;
}

function SortableItem({ id, word }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm touch-none border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-lg font-medium text-gray-800 dark:text-white shadow-md cursor-grab active:cursor-grabbing"
    >
      {word}
    </div>
  );
}

export default function SentenceReorderPage() {
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [scrambledWords, setScrambledWords] = useState<{ id: string, word: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { drawCards, isReady } = useVocabularyDeck();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getNewSentence = () => {
    if (!isReady) return;
    
    const [newItem] = drawCards(1);
    if (newItem) {
      setCurrentItem(newItem);
      // Remove punctuation and then split into words
      const words = newItem.example.replace(/[.?!]$/, '').split(/\s+/);
      const scrambled = words
        .map((word, index) => ({ id: `${word}-${index}`, word }))
        .sort(() => Math.random() - 0.5);
      
      setScrambledWords(scrambled);
      setShowResult(false);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    if (isReady) {
      getNewSentence();
    }
  }, [isReady]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setScrambledWords((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkAnswer = () => {
    if (!currentItem) return;
    const userAnswer = scrambledWords.map(item => item.word).join(' ');
    const correctAnswer = currentItem.example.replace(/[.?!]$/, '');
    const correct = userAnswer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
  };

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 animate-ping"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Đang chuẩn bị câu...</p>
        </div>
      </div>
    );
  }

  const correctAnswer = currentItem.example.replace(/[.?!]$/, '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="group flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-all duration-200 font-medium">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
            Quay lại trang chủ
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Sắp xếp câu</h1>
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

        {/* Reorder Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Sắp xếp các từ</h2>
                  <p className="text-purple-100 text-sm">Kéo thả các từ để tạo thành câu có nghĩa</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-8 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">Sắp xếp lại câu sau:</p>
                  <p className="text-lg italic text-gray-500 dark:text-gray-400">"{currentItem.exampleMeaning}"</p>
              </div>

              {/* Drag and Drop Area */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={scrambledWords.map(item => item.id)}>
                  <div className={`
                    min-h-[6rem] flex flex-wrap items-center justify-center gap-3 p-4 rounded-2xl
                    ${!showResult ? 'bg-gray-100 dark:bg-gray-700/50' : ''}
                    ${showResult && isCorrect ? 'bg-green-100/50 dark:bg-green-900/20' : ''}
                    ${showResult && !isCorrect ? 'bg-red-100/50 dark:bg-red-900/20' : ''}
                  `}>
                    {scrambledWords.map(({ id, word }) => (
                      <SortableItem key={id} id={id} word={word} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              
              {/* Action Buttons */}
              <div className="mt-8 text-center">
                {!showResult ? (
                  <button onClick={checkAnswer} className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    Kiểm tra
                  </button>
                ) : (
                  <button onClick={getNewSentence} className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    Câu tiếp theo
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Result & Explanation */}
          {showResult && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'}`}>
                  {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng!'}
                </div>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Câu đúng là
                </h3>
                <p className="text-2xl text-gray-700 dark:text-gray-300 font-medium italic bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  "{correctAnswer}"
                </p>
                <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Thuộc từ vựng: <span className="text-purple-600 dark:text-purple-400">{currentItem.word}</span></h4>
                  <p className="text-gray-600 dark:text-gray-400">/{currentItem.phonetic}/ - {currentItem.shortMeaningVi}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
       <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
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