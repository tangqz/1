
"use client";

import { useState, useEffect } from 'react';
import { WindowFrame } from '@/components/ui/WindowFrame';
import { GlassButton } from '@/components/ui/GlassButton';
import axios from 'axios';
import { format } from 'date-fns';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
        fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const [annRes, bookRes] = await Promise.all([
        axios.get('/api/announcements'),
        axios.get('/api/bookings')
    ]);
    setAnnouncements(annRes.data);
    setBookings(bookRes.data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded check for demo/mvp. In prod, use real auth.
    if (password === 'admin123') {
        setIsAuthenticated(true);
    } else {
        alert('密码错误');
    }
  };

  const handlePostAnnouncement = async () => {
    await axios.post('/api/announcements', newAnnouncement);
    setNewAnnouncement({ title: '', content: '' });
    fetchData();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await axios.delete(`/api/announcements?id=${id}`);
    fetchData();
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <WindowFrame title="管理员登录" className="w-full max-w-sm h-auto">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 p-4">
                    <input
                        type="password"
                        placeholder="请输入管理密码"
                        className="p-2 border rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <GlassButton type="submit">登录</GlassButton>
                </form>
            </WindowFrame>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-8">后台管理系统</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Announcements Management */}
            <WindowFrame title="公告管理" className="h-[500px]">
                <div className="flex flex-col gap-4 h-full">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <input
                            placeholder="公告标题"
                            className="w-full p-2 border rounded"
                            value={newAnnouncement.title}
                            onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        />
                        <textarea
                            placeholder="公告内容"
                            className="w-full p-2 border rounded h-20"
                            value={newAnnouncement.content}
                            onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                        />
                        <GlassButton onClick={handlePostAnnouncement}>发布公告</GlassButton>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {announcements.map(ann => (
                            <div key={ann.id} className="p-3 bg-white border rounded flex justify-between items-start">
                                <div>
                                    <div className="font-bold">{ann.title}</div>
                                    <div className="text-sm text-gray-600">{ann.content}</div>
                                    <div className="text-xs text-gray-400 mt-1">{new Date(ann.createdAt).toLocaleString()}</div>
                                </div>
                                <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">删除</button>
                            </div>
                        ))}
                    </div>
                </div>
            </WindowFrame>

            {/* Bookings List */}
            <WindowFrame title="预约记录" className="h-[500px]">
                <div className="space-y-3">
                    {bookings.map(booking => (
                        <div key={booking.id} className="p-3 bg-white border rounded space-y-1">
                            <div className="flex justify-between">
                                <span className="font-bold">{booking.parentName} ({booking.studentName})</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 rounded">{format(new Date(booking.startTime), 'MM-dd HH:mm')}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <div>电话: {booking.phone}</div>
                                <div>科目: {booking.subject} | 年级: {booking.grade}</div>
                                {booking.notes && <div>备注: {booking.notes}</div>}
                            </div>
                            <div className="text-xs text-gray-400">提交于: {new Date(booking.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                    {bookings.length === 0 && <div className="text-center text-gray-500 mt-10">暂无预约</div>}
                </div>
            </WindowFrame>
        </div>
    </div>
  );
}
