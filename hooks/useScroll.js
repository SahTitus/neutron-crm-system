'use client';
import { useEffect, useState } from 'react';

const useScrollDirection = (containerRef, threshold = 300) => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  useEffect(() => {
    const container = containerRef?.current || document.querySelector('#main-container');

    if (!container) return;

    let lastScrollY = container.scrollTop;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      // When scrolling down
      if (currentScrollY > lastScrollY) {
        setIsScrollingUp(false); // Set to false when scrolling down
      } 
      // When scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsScrollingUp(true);  // Set to true when scrolling up
      }

      // When reaching the threshold (near the top)
      if (currentScrollY <= threshold) {
        setIsScrollingUp(false); // Reset to false when reaching the threshold
      }

      lastScrollY = currentScrollY;
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, threshold]);

  return isScrollingUp;
};

export default useScrollDirection;
