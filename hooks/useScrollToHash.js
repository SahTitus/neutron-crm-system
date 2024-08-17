'use client';
import { useEffect } from 'react';

const useScrollToHash = () => {
  useEffect(() => {
    const handleScrollToHash = () => {
      const { hash } = window.location;

      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Scroll to the hash on initial load
    handleScrollToHash();
  }, []);
};

export default useScrollToHash;