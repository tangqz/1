
import React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Square, X } from 'lucide-react';
import { motion } from 'framer-motion';

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
      "flex flex-col glass-window rounded-xl overflow-hidden shadow-2xl transition-all duration-300",
      className
    )}>
      {/* Title Bar */}
      <div className="h-10 bg-white/50 border-b border-gray-200/50 flex justify-between items-center px-4 select-none">
        <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-500"><Minus size={16} /></button>
            <button className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-500"><Square size={14} /></button>
            <button onClick={onClose} className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-colors text-gray-500"><X size={16} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white/40 custom-scrollbar relative">
        {children}
      </div>
    </div>
  );
};
