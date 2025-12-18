
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content } = body;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
    },
  });

  return NextResponse.json(announcement);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.announcement.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
