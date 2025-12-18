
"use client";

import { WindowFrame } from '@/components/ui/WindowFrame';
import { AnnouncementWidget } from '@/components/widgets/AnnouncementWidget';
import { BookingWidget } from '@/components/widgets/BookingWidget';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="min-h-screen relative p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Background Wallpaper */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-win11-wallpaper" />

      {/* Desktop Grid */}
      <div className="w-full max-w-4xl z-10 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column: Intro & Announcements */}
        <div className="flex flex-col gap-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center md:text-left"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 drop-shadow-md">家教预约系统</h1>
                <p className="text-lg text-gray-600 font-medium">专业辅导，助力成长</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <AnnouncementWidget />
            </motion.div>

            <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div onClick={() => setShowBooking(true)} className="cursor-pointer group">
                    <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/50 hover:bg-white/60 transition-all flex flex-col items-center gap-2 shadow-lg group-hover:scale-105">
                        <img src="https://img.icons8.com/color/96/calendar--v1.png" alt="预约" className="w-12 h-12" />
                        <span className="font-semibold text-gray-700">开始预约</span>
                    </div>
                </div>
                {/* Admin Link (Disguised as About Me or separate) */}
                <div onClick={() => window.location.href='/admin'} className="cursor-pointer group">
                     <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/50 hover:bg-white/60 transition-all flex flex-col items-center gap-2 shadow-lg group-hover:scale-105">
                        <img src="https://img.icons8.com/color/96/settings--v1.png" alt="后台" className="w-12 h-12" />
                        <span className="font-semibold text-gray-700">管理后台</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Booking Window */}
      <AnimatePresence>
        {showBooking && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            >
                <WindowFrame
                    title="预约课程"
                    onClose={() => setShowBooking(false)}
                    className="w-full max-w-4xl h-[600px]"
                >
                    <BookingWidget onSubmitSuccess={() => {}} />
                </WindowFrame>
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
