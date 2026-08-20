'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    let scrollInstance: any;

    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;

        scrollInstance = new LocomotiveScroll({
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.1,
            duration: 1.2,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          },
        });
      } catch (err) {
        console.warn('LocomotiveScroll init error fallback to native scroll:', err);
      }
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      initLocomotiveScroll();
    }

    return () => {
      if (scrollInstance) {
        scrollInstance.destroy();
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
