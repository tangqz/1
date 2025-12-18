
"use client";

import { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, startOfToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, Globe, Calendar as CalendarIcon, Check, User, Phone, Mail, BookOpen, GraduationCap, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

type BookingFormProps = {
  onSubmitSuccess: () => void;
};

// Sub-components for cleaner code
const StepIndicator = ({ step }: { step: 'date' | 'form' | 'success' }) => {
    return (
        <div className="flex items-center gap-2 mb-6">
            <div className={cn("h-2 rounded-full flex-1 transition-all", step === 'date' ? "bg-blue-600" : "bg-blue-200")}></div>
            <div className={cn("h-2 rounded-full flex-1 transition-all", step === 'form' ? "bg-blue-600" : "bg-gray-200")}></div>
            <div className={cn("h-2 rounded-full flex-1 transition-all", step === 'success' ? "bg-green-500" : "bg-gray-200")}></div>
        </div>
    )
}

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

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

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
        endTime.setHours(hour + 2);

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

  return (
    <div className="flex flex-col md:flex-row h-full bg-white/80 backdrop-blur-sm divide-y md:divide-y-0 md:divide-x divide-gray-200/50">

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

                <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3 text-sm">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">2 小时</span>
                            <span className="text-xs">通常时长</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                         <div className="flex flex-col">
                            <span className="font-medium text-gray-900">线上 / 线下</span>
                            <span className="text-xs">具体方式可协商</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                        <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="font-medium text-gray-900">Asia/Shanghai</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200/50">
                <p className="text-xs text-gray-400 leading-relaxed">
                    请选择适合您的时间段。如果您有特殊需求，请在预约表单中备注说明。
                </p>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden bg-white/60">
            <AnimatePresence mode='wait'>
                {step === 'date' && (
                    <motion.div
                        key="step-date"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200/50"
                    >
                         {/* Calendar */}
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-lg font-bold text-gray-800">{format(currentMonth, 'yyyy年 MM月')}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setCurrentMonth(m => addMonths(m, -1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={18} /></button>
                                    <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={18} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 mb-4">
                                {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d} className="py-1">{d}</div>)}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                                {daysInMonth.map(day => {
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                                    const isToday = isSameDay(day, new Date());

                                    return (
                                        <button
                                            key={day.toISOString()}
                                            onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                                            className={cn(
                                                "aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all relative",
                                                isSelected
                                                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                                                    : "hover:bg-blue-50 text-gray-700 hover:text-blue-600",
                                                isToday && !isSelected && "text-blue-600 font-bold bg-blue-50/50 ring-1 ring-blue-200"
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                         {/* Time Slots */}
                         <div className="w-full md:w-[240px] bg-gray-50/30 p-4 border-l border-gray-100 flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">可用时间</h3>
                            {selectedDate ? (
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                    {generateTimeSlots(selectedDate).map(time => (
                                        <motion.button
                                            key={time}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => { setSelectedTime(time); setStep('form'); }}
                                            className={cn(
                                                "w-full py-2.5 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group",
                                                selectedTime === time
                                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-sm"
                                            )}
                                        >
                                            <span>{time}</span>
                                            <ChevronRight size={14} className={cn("opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0", selectedTime === time && "opacity-100 translate-x-0 text-white")} />
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <CalendarIcon className="w-10 h-10 opacity-20" />
                                    <p className="text-xs text-center px-4">请在左侧选择日期以查看可用时间</p>
                                </div>
                            )}
                         </div>
                    </motion.div>
                )}

            {/* Calendar */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">{format(currentMonth, 'yyyy年 MM月')}</span>
                    <div className="flex gap-1">
                        <button aria-label="上个月" onClick={() => setCurrentMonth(m => addMonths(m, -1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <button aria-label="下个月" onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="p-1 hover:bg-gray-100 rounded-md transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">填写详细信息</h2>
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                                <CalendarIcon size={14} />
                                {selectedDate && format(selectedDate, 'yyyy年MM月dd日', { locale: zhCN })} {selectedTime}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><User size={12}/> 家长姓名 *</label>
                                    <input required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="请输入家长姓名"
                                        value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><User size={12}/> 学生姓名 *</label>
                                    <input required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="请输入学生姓名"
                                        value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Phone size={12}/> 联系电话 *</label>
                                <input required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    placeholder="请输入联系电话"
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Mail size={12}/> 邮箱 (用于接收通知)</label>
                                <input type="email" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    placeholder="example@email.com"
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><BookOpen size={12}/> 辅导科目</label>
                                    <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="例如：数学"
                                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><GraduationCap size={12}/> 年级</label>
                                    <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                        placeholder="例如：初二"
                                        value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"><Edit size={12}/> 备注</label>
                                <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm h-24 resize-none"
                                    placeholder="有什么需要特别注意的吗？"
                                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]">
                                    确认预约
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="step-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col items-center justify-center p-8 text-center"
                    >
                         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">预约已提交!</h3>
                        <p className="text-gray-500 mb-8 max-w-xs">
                            我会尽快确认您的预约请求，并将结果发送至您的邮箱。
                        </p>
                        <button
                            onClick={() => { setStep('date'); setSelectedDate(null); setSelectedTime(null); }}
                            className="px-8 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            返回日历
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};
