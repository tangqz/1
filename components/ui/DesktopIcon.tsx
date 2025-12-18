
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
  icon: string | React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick, className }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer w-24 gap-1 transition-colors select-none",
        className
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center">
        {typeof icon === 'string' ? (
            <img src={icon} alt={label} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
            icon
        )}
      </div>
      <span className="text-white text-xs text-center font-medium drop-shadow-md leading-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {label}
      </span>
    </motion.div>
  );
};
