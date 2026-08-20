import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'coral' | 'purple' | 'destructive' | 'outline' | 'ghost' | 'secondary';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'btn-3d-purple',
  purple: 'btn-3d-purple',
  coral: 'btn-3d-coral',
  destructive: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md font-bold',
  secondary: 'bg-[#F0EDFF] hover:bg-[#E3DCFF] text-[#6C5CE7] font-bold',
  outline:
    'border-2 border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#475569] font-bold shadow-sm',
  ghost: 'hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] font-semibold',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-11 px-6 py-2.5 text-sm rounded-2xl',
  sm: 'h-9 px-4 text-xs rounded-xl',
  lg: 'h-13 px-8 py-3.5 text-base font-extrabold rounded-2xl',
  icon: 'h-11 w-11 p-0 rounded-2xl',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-display select-none cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };