
import React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  isMaximized?: boolean;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, className, onClose, isMaximized = false }) => {
  return (
    <div className={cn(
      "flex flex-col bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg overflow-hidden transition-all duration-300",
      className
    )}>
      {/* Title Bar */}
      <div className="h-8 bg-gray-50/50 flex justify-between items-center px-2 select-none drag-handle">
        <div className="flex items-center gap-2">
            <img src="/window-icon.png" alt="" className="w-4 h-4 opacity-0" /> {/* Placeholder */}
            <span className="text-xs font-medium text-gray-700">{title}</span>
        </div>
        <div className="flex items-center">
            <button className="p-2 hover:bg-gray-200/50 rounded-md transition-colors"><Minus size={14} /></button>
            <button className="p-2 hover:bg-gray-200/50 rounded-md transition-colors"><Square size={12} /></button>
            <button onClick={onClose} className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors"><X size={14} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar relative">
        {children}
      </div>
    </div>
  );
};
