'use client';

import { useState, useEffect } from 'react';

export default function Typewriter({ words = [], speed = 100, delay = 2000, className = "" }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    let timer;
    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      // Deleting character
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, speed / 2);
    } else {
      // Typing character
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, speed);
    }

    // If fully typed, wait and start deleting
    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    }

    // If fully deleted, move to the next word
    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  return (
    <span className={className}>
      {currentText}
    </span>
  );
}
