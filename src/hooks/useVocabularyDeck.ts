import { useState, useEffect, useCallback } from 'react';
import vocabularyData from '@/data/vocabulary.json';
import type { VocabularyItem } from '@/types/vocabulary';

/**
 * Shuffles an array in place using the Durstenfeld shuffle algorithm.
 * @param array The array to shuffle.
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const useVocabularyDeck = () => {
  const [deck, setDeck] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and shuffle the deck only once
  useEffect(() => {
    if (!isInitialized) {
      setDeck(shuffleArray(vocabularyData));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  /**
   * Draws a specified number of unique cards from the deck.
   * If the deck runs out of cards, it reshuffles and starts from the beginning.
   * @param count The number of cards to draw.
   * @returns An array of vocabulary items.
   */
  const drawCards = useCallback((count = 1): VocabularyItem[] => {
    if (deck.length === 0) return [];

    let drawnItems: VocabularyItem[] = [];
    
    // Check if we need to reshuffle
    if (currentIndex + count > deck.length) {
      const newShuffledDeck = shuffleArray(vocabularyData);
      setDeck(newShuffledDeck);
      drawnItems = newShuffledDeck.slice(0, count);
      setCurrentIndex(count);
    } else {
      drawnItems = deck.slice(currentIndex, currentIndex + count);
      setCurrentIndex(prev => prev + count);
    }
    
    return drawnItems;
  }, [deck, currentIndex]);

  return { 
    drawCards, 
    deckSize: vocabularyData.length, 
    remaining: deck.length - currentIndex,
    isReady: isInitialized,
    deck,
  };
};

export default useVocabularyDeck; 