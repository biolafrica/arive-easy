'use client';

import { useEffect, useState } from 'react';

interface RotatingWordsProps {
  words: {
    text: string;
    color: string;
  }[];
  interval?: number;
}

export function RotatingWords({
  words,
  interval = 4000,
}: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={`
        inline-block transition-all duration-500 ease-out
        ${words[index].color}
      `}
      key={words[index].text}
    >
      {words[index].text}
    </span>
  );
}
