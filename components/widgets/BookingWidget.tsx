
"use client";

import { useState, useEffect } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

type BookingFormProps = {
  onSubmitSuccess: () => void;
};

export const BookingWidget: React.FC<BookingFormProps> = ({ onSubmitSuccess }) => {
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{rules: any[], oneTime: any[]}>({rules: [], oneTime: []});

  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    email: '',
    subject: '',
    grade: '',
    notes: '',
  });

  useEffect(() => {
    axios.get('/api/availability').then(res => setAvailability(res.data));
  }, []);

  const generateTimeSlots = (date: Date) => {
    // Simplified logic: 9:00 to 20:00
    // In a real app, check against availability rules and existing bookings
    // For this demo, we assume 1 hour slots and filtered by basic rules
    const slots = [];
    for (let i = 9; i <= 20; i++) {
        slots.push(`${i}:00`);
    }
    // Filter based on availability rules (simplified)
    // Real logic would be more complex checking overlaps
    return slots;
  };

  const handleDateChange = (days: number) => {
    setSelectedDate(prev => addDays(prev, days));
    setSelectedTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    try {
        const [hour, minute] = selectedTime.split(':').map(Number);
        const startTime = new Date(selectedDate);
        startTime.setHours(hour, minute);
        const endTime = new Date(startTime);
        endTime.setHours(hour + 2); // Default 2 hour session

        await axios.post('/api/bookings', {
            ...formData,
            startTime,
            endTime
        });
        setStep(3);
        onSubmitSuccess();
    } catch (error) {
        console.error("Booking failed", error);
        alert("预约失败，请稍后再试");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {step === 1 && (
        <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">选择时间</h3>

            {/* Date Selector */}
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-2 rounded-lg">
                <button onClick={() => handleDateChange(-1)} className="p-1 hover:bg-gray-200 rounded"><ChevronLeft /></button>
                <div className="text-center">
                    <div className="font-bold text-lg">{format(selectedDate, 'MM月dd日', { locale: zhCN })}</div>
                    <div className="text-sm text-gray-500">{format(selectedDate, 'EEEE', { locale: zhCN })}</div>
                </div>
                <button onClick={() => handleDateChange(1)} className="p-1 hover:bg-gray-200 rounded"><ChevronRight /></button>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[300px] p-1">
                {generateTimeSlots(selectedDate).map(time => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                            "py-2 rounded-md border text-sm transition-all",
                            selectedTime === time
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                        )}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="mt-auto pt-4 flex justify-end">
                <GlassButton
                    disabled={!selectedTime}
                    onClick={() => setStep(2)}
                    className={!selectedTime ? "opacity-50 cursor-not-allowed" : ""}
                >
                    下一步
                </GlassButton>
            </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 overflow-y-auto p-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">填写信息</h3>

            <div className="grid grid-cols-2 gap-3">
                <input required placeholder="家长姓名" className="p-2 border rounded-md text-sm"
                    value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                <input required placeholder="学生姓名" className="p-2 border rounded-md text-sm"
                    value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
            </div>
            <input required placeholder="联系电话" className="p-2 border rounded-md text-sm"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="邮箱 (可选)" className="p-2 border rounded-md text-sm"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />

            <div className="grid grid-cols-2 gap-3">
                <input placeholder="辅导科目" className="p-2 border rounded-md text-sm"
                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                <input placeholder="年级" className="p-2 border rounded-md text-sm"
                    value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
            </div>

            <textarea placeholder="备注要求 (如：重点辅导几何)" className="p-2 border rounded-md text-sm h-20 resize-none"
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />

            <div className="mt-auto pt-4 flex justify-between">
                <GlassButton variant="secondary" type="button" onClick={() => setStep(1)}>上一步</GlassButton>
                <GlassButton type="submit">提交预约</GlassButton>
            </div>
        </form>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">预约成功！</h3>
            <p className="text-gray-500 mb-6">我会尽快确认您的预约。</p>
            <GlassButton onClick={() => { setStep(1); setSelectedTime(null); }}>完成</GlassButton>
        </div>
      )}
    </div>
  );
};
