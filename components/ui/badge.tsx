import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'purple' | 'coral' | 'amber' | 'emerald' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#F0EDFF] text-[#6C5CE7] border-[#DED7FC]',
  purple: 'bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/20',
  coral: 'bg-[#FF6B4A]/10 text-[#FF6B4A] border-[#FF6B4A]/20',
  amber: 'bg-[#FFF3D6] text-[#D97706] border-[#FDE68A]',
  emerald: 'bg-[#E6FAF0] text-[#059669] border-[#A7F3D0]',
  outline: 'border-[#E2E8F0] text-[#64748B] bg-white',
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
