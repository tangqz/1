
"use client";

import { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, Globe, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

type BookingFormProps = {
  onSubmitSuccess: () => void;
};

export const BookingWidget: React.FC<BookingFormProps> = ({ onSubmitSuccess }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfToday());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'date' | 'form' | 'success'>('date');

  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    email: '',
    subject: '',
    grade: '',
    notes: '',
  });

  // Calendar generation
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Padding for empty days at start of month
  const startDay = getDay(startOfMonth(currentMonth));
  const emptyDays = Array(startDay).fill(null);

  const generateTimeSlots = (_date: Date) => {
    // Mock logic
    const slots = [];
    for (let i = 9; i <= 20; i++) {
        slots.push(`${i}:00`);
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

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
        setStep('success');
        onSubmitSuccess();
    } catch (error) {
        console.error("Booking failed", error);
        alert("预约失败，请稍后再试");
    }
  };

  // Render Functions
  if (step === 'success') {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-white text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">预约已提交</h3>
            <p className="text-gray-500 mb-8">我会尽快确认您的预约请求，并将结果发送至您的邮箱。</p>
            <button
                onClick={() => { setStep('date'); setSelectedDate(null); setSelectedTime(null); }}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
                返回
            </button>
        </div>
    );
  }

  if (step === 'form') {
    return (
        <div className="flex flex-col h-full bg-white p-6 md:p-8">
            <div className="mb-6">
                <button aria-label="返回日历" onClick={() => setStep('date')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4">
                    <ChevronLeft size={16} className="mr-1" />
                    返回日历
                </button>
                <h2 className="text-xl font-bold text-gray-900">填写详细信息</h2>
                <p className="text-gray-500 text-sm mt-1">
                    {selectedDate && format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })} {selectedTime}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">家长姓名 *</label>
                        <input required className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">学生姓名 *</label>
                        <input required className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">联系电话 *</label>
                    <input required className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">邮箱 (用于接收通知)</label>
                    <input type="email" className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">辅导科目</label>
                        <input className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">年级</label>
                        <input className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                            value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">备注</label>
                    <textarea className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 outline-none transition-all h-24 resize-none"
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>

                <div className="flex justify-end pt-4">
                     <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
                        确认预约
                    </button>
                </div>
            </form>
        </div>
    );
  }

  // Default: Date Selection
  return (
    <div className="flex flex-col md:flex-row h-full bg-white divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Left Sidebar: Info & Calendar */}
        <div className="w-full md:w-[320px] lg:w-[360px] p-6 flex flex-col gap-6 shrink-0 overflow-y-auto">
            {/* Info */}
            <div className="space-y-4">
                <h2 className="text-gray-500 font-medium text-sm">家教预约</h2>
                <h1 className="text-2xl font-bold text-gray-900">2小时辅导课程</h1>
                <div className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>2 小时</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>线上 / 线下 (协商)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4" />
                        <span>Asia/Shanghai</span>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">{format(currentMonth, 'yyyy年 MM月')}</span>
                    <div className="flex gap-1">
                        <button aria-label="上个月" onClick={() => setCurrentMonth(m => addMonths(m, -1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <button aria-label="下个月" onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} className="py-1">{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                    {daysInMonth.map(day => {
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                                className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative",
                                    isSelected
                                        ? "bg-gray-900 text-white"
                                        : "hover:bg-gray-100 text-gray-700",
                                    isToday && !isSelected && "text-blue-600 font-bold bg-blue-50"
                                )}
                            >
                                {format(day, 'd')}
                                {isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></span>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Right Panel: Time Slots */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
            {selectedDate ? (
                <div className="max-w-md mx-auto fade-in">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                        {format(selectedDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {generateTimeSlots(selectedDate).map(time => (
                            <div key={time} className="flex gap-2 group">
                                <button
                                    onClick={() => setSelectedTime(time)}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-md border text-sm font-medium transition-all text-center",
                                        selectedTime === time
                                            ? "bg-gray-800 text-white border-gray-800 shadow-md"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-800 hover:shadow-sm"
                                    )}
                                >
                                    {time}
                                </button>
                                {selectedTime === time && (
                                    <button
                                        onClick={() => setStep('form')}
                                        className="w-1/3 bg-gray-900 text-white rounded-md font-medium text-sm hover:bg-gray-800 transition-colors shadow-md animate-in slide-in-from-left-2 fade-in duration-200"
                                    >
                                        下一步
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p>请在左侧选择日期以查看可用时间</p>
                </div>
            )}
        </div>
    </div>
  );
};
