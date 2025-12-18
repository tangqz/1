
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parentName, studentName, phone, email, subject, grade, notes, startTime, endTime } = body;

    const booking = await prisma.booking.create({
      data: {
        parentName,
        studentName,
        phone,
        email,
        subject,
        grade,
        notes,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });

    // Send email notification
    const emailContent = `
      <h1>新预约通知</h1>
      <p><strong>家长:</strong> ${parentName}</p>
      <p><strong>学生:</strong> ${studentName}</p>
      <p><strong>电话:</strong> ${phone}</p>
      <p><strong>时间:</strong> ${new Date(startTime).toLocaleString('zh-CN')} - ${new Date(endTime).toLocaleString('zh-CN')}</p>
      <p><strong>科目:</strong> ${subject || '未填'}</p>
      <p><strong>年级:</strong> ${grade || '未填'}</p>
      <p><strong>备注:</strong> ${notes || '无'}</p>
    `;

    // Non-blocking email sending
    sendNotificationEmail(`新预约: ${parentName} - ${studentName}`, emailContent);

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
    // For admin to list bookings
    const bookings = await prisma.booking.findMany({
        orderBy: { startTime: 'desc' }
    });
    return NextResponse.json(bookings);
}
