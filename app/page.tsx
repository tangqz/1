
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WindowFrame } from '@/components/ui/WindowFrame';
import { BookingWidget } from '@/components/widgets/BookingWidget';
import { DesktopIcon } from '@/components/ui/DesktopIcon';
import { Taskbar } from '@/components/ui/Taskbar';
import { Settings, Calendar } from 'lucide-react';
import { AnnouncementWidget } from '@/components/widgets/AnnouncementWidget';

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <main className="h-screen w-screen overflow-hidden relative selection:bg-blue-500/30">
      {/* Background Wallpaper */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-win11-wallpaper transition-all duration-1000" />

      {/* Fallback Gradient if wallpaper fails or while loading (handled by CSS, but good to have overlay) */}
      <div className="absolute inset-0 -z-20 bg-win11-gradient" />

      {/* Desktop Grid Area */}
      <div className="absolute inset-0 p-4 grid grid-flow-col auto-cols-min grid-rows-[repeat(auto-fill,100px)] gap-2 content-start items-start z-10">

        {/* Desktop Icons */}
        <DesktopIcon
            icon="https://img.icons8.com/color/96/calendar--v1.png"
            label="开始预约"
            onClick={() => setShowBooking(true)}
        />

        <DesktopIcon
            icon="https://img.icons8.com/color/96/settings--v1.png"
            label="管理后台"
            onClick={() => window.location.href='/admin'}
        />

        {/* You can add more icons here */}

        {/* Widget Area on Desktop (like Windows Widgets) */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed top-4 right-4 w-80 flex flex-col gap-4 pointer-events-none"
        >
             {/* Make the widget interactive */}
             <div className="pointer-events-auto">
                 <AnnouncementWidget />
             </div>
        </motion.div>

        {/* Big Welcome Text (Optional, maybe too cluttered for a pure desktop feel, but good for context) */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none drop-shadow-lg"
        >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                家教预约系统
            </h1>
            <p className="text-lg text-white/90 font-medium tracking-wide" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
                专业辅导 · 助力成长
            </p>
        </motion.div>

      </div>

      {/* Booking Window */}
      <AnimatePresence>
        {showBooking && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-0 z-40 flex items-center justify-center p-4"
                style={{ paddingBottom: '48px' }} // Space for taskbar
            >
                {/* Click outside to close (simulated by backdrop, though windows usually don't close on click outside) */}
                {/* <div className="absolute inset-0" onClick={() => setShowBooking(false)} /> */}

                <WindowFrame
                    title="预约课程"
                    onClose={() => setShowBooking(false)}
                    className="w-full max-w-5xl h-[700px] shadow-2xl relative z-50"
                >
                    <BookingWidget onSubmitSuccess={() => {}} />
                </WindowFrame>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar onStartClick={() => setShowBooking(prev => !prev)} />

    </main>
  );
}
