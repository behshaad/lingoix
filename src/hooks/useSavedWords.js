import { useState, useEffect } from "react";

const STORAGE_KEY = "savedWords";

export const useSavedWords = () => {
  const [savedWords, setSavedWords] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved words from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedWords(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved words:", error);
        setSavedWords([]);
      }
    }
  }, []);

  // Save words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWords));
    } catch (error) {
      console.error("Error saving words:", error);
    }
  }, [savedWords]);

  // Add word to saved words
  const addWord = (word) => {
    if (!word.trim()) return;
    setSavedWords((prev) => {
      if (prev.includes(word)) return prev;
      return [...prev, word];
    });
  };

  // Remove word from saved words
  const removeWord = (word) => {
    setSavedWords((prev) => prev.filter((w) => w !== word));
  };

  // Toggle saved words visibility
  const toggleShowSaved = () => {
    setShowSaved((prev) => !prev);
  };

  return {
    savedWords,
    showSaved,
    addWord,
    removeWord,
    toggleShowSaved,
  };
};
