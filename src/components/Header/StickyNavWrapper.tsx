'use client';

import { useState, useEffect, cloneElement, ReactElement } from 'react';

interface StickyNavWrapperProps {
  children: ReactElement<{ className?: string }>;
}

export default function StickyNavWrapper({ children }: StickyNavWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseClasses = children.props.className || '';

  const updatedClasses =
    baseClasses.replace('h-20', '').trim() +
    ` sticky top-0 z-50 transition-all duration-300 ease-in-out ${
      isScrolled
        ? 'bg-neutral-500 border-b-foreground/30 bg-background/80 backdrop-blur-sm h-12'
        : 'h-20'
    }`;

  const navWithClasses = cloneElement(children, {
    className: updatedClasses,
  });

  return navWithClasses;
}
