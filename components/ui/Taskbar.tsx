
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Search, Wifi, Volume2, Battery } from 'lucide-react';

interface TaskbarProps {
  onStartClick?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ onStartClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#f3f3f3]/80 backdrop-blur-xl border-t border-white/40 flex items-center justify-between px-4 z-50 select-none">
      {/* Start & Pinned Apps */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onStartClick}
            className="p-2 hover:bg-white/50 rounded-md transition-colors"
        >
            <LayoutGrid className="text-blue-600 fill-blue-600" size={24} />
        </motion.button>

        <div className="w-[1px] h-6 bg-gray-400/30 mx-1" />

        <div className="flex gap-1">
             {/* Fake Pinned Apps */}
            <motion.button whileHover={{ y: -3 }} className="p-2 hover:bg-white/50 rounded-md transition-all">
                 <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">E</div>
            </motion.button>
            <motion.button whileHover={{ y: -3 }} className="p-2 hover:bg-white/50 rounded-md transition-all">
                 <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">W</div>
            </motion.button>
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-2 text-gray-700">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Battery size={16} />
        </div>
        <div className="flex flex-col items-end text-xs text-gray-800 leading-tight">
            <span>{time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}</span>
            <span>{time.getFullYear()}/{time.getMonth() + 1}/{time.getDate()}</span>
        </div>
      </div>
    </div>
  );
};
