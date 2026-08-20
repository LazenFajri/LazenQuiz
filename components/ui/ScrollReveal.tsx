'use client';
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop';
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = '',
  speed = 0,
  direction = 'up',
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    let animationFrameId: number | null = null;
    const handleScroll = () => {
      if (speed === 0 || !el) return;
      animationFrameId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top <= windowHeight && rect.bottom >= 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          const offset = (progress - 0.5) * speed * 60;
          setParallaxOffset(offset);
        }
      });
    };

    if (speed !== 0) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      observer.disconnect();
      if (speed !== 0) {
        window.removeEventListener('scroll', handleScroll);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };
  }, [speed, threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(36px)';
      case 'down':
        return 'translateY(-36px)';
      case 'left':
        return 'translateX(36px)';
      case 'right':
        return 'translateX(-36px)';
      case 'pop':
        return 'scale(0.9)';
      default:
        return 'translateY(36px)';
    }
  };

  const currentTransform = isVisible
    ? speed !== 0
      ? `translateY(${parallaxOffset}px)`
      : 'translateY(0) scale(1)'
    : getInitialTransform();

  return (
    <div
      ref={ref}
      style={{
        transform: currentTransform,
        opacity: isVisible ? 1 : 0,
        transition: `opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </div>
  );
}
