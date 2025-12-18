
import React from 'react';
import { cn } from '@/lib/utils';

interface AcrylicPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const AcrylicPanel: React.FC<AcrylicPanelProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-lg p-4",
      className
    )}>
      {children}
    </div>
  );
};
