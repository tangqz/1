
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const GlassButton: React.FC<GlassButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-blue-600/90 text-white hover:bg-blue-500 shadow-blue-500/20",
    secondary: "bg-white/60 text-gray-800 hover:bg-white/80 shadow-gray-500/10 border border-gray-200/50",
    danger: "bg-red-500/90 text-white hover:bg-red-400 shadow-red-500/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 shadow-lg backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};
