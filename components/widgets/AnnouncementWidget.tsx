
"use client";

import { useEffect, useState } from 'react';
import { AcrylicPanel } from '@/components/ui/AcrylicPanel';
import { Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export const AnnouncementWidget = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setIndex(prev => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [announcements]);

  if (announcements.length === 0) return null;

  return (
    <AcrylicPanel className="mb-4 flex items-center gap-3 p-3">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Megaphone size={18} />
        </div>
        <div className="flex-1 overflow-hidden h-6 relative">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full"
                >
                    <span className="font-semibold mr-2">[{announcements[index].title}]</span>
                    <span className="text-gray-600 text-sm truncate">{announcements[index].content}</span>
                </motion.div>
            </AnimatePresence>
        </div>
    </AcrylicPanel>
  );
};
