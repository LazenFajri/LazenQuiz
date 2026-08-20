'use client';
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'default';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  onConfirm,
  variant = 'default',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-md glass-panel-elevated rounded-3xl p-6 md:p-8 shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white tracking-tight">{title}</h3>
            {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children && <div className="my-5">{children}</div>}

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          {confirmLabel && (
            <Button
              variant={variant === 'danger' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
