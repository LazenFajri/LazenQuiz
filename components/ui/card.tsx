import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glow?: 'none' | 'emerald' | 'cyan' | 'amber';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, glow = 'none', ...props }, ref) => {
    const glowClasses = {
      none: '',
      emerald: 'hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10',
      cyan: 'hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10',
      amber: 'hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          glass
            ? 'bg-white dark:bg-slate-900 border-[#EAEFF8] dark:border-slate-800 shadow-sm'
            : 'border-slate-800/80 bg-slate-900/60 text-slate-100 shadow-xl',
          glowClasses[glow],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 md:p-7', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-display font-bold text-xl md:text-2xl leading-tight text-[#1E2238] dark:text-white tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-[#8C93B0] dark:text-slate-400 leading-relaxed', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 md:p-7 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 md:p-7 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };