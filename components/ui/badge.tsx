import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'purple' | 'coral' | 'amber' | 'emerald' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#F0EDFF] text-[#6C5CE7] border-[#DED7FC] dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50',
  purple: 'bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/20 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/40',
  coral: 'bg-[#FF6B4A]/10 text-[#FF6B4A] border-[#FF6B4A]/20 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40',
  amber: 'bg-[#FFF3D6] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40',
  emerald: 'bg-[#E6FAF0] text-[#059669] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40',
  outline: 'border-[#E2E8F0] text-[#64748B] bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
};

const badgeSizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-[10px] px-2 py-0.5 font-bold',
  default: 'text-xs px-2.5 py-1 font-bold',
  lg: 'text-sm px-3.5 py-1.5 font-bold',
};

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
