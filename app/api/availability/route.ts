
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const rules = await prisma.availability.findMany();
    const oneTime = await prisma.oneTimeAvailability.findMany();
    return NextResponse.json({ rules, oneTime });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'rule') {
        const result = await prisma.availability.create({ data });
        return NextResponse.json(result);
    } else if (type === 'onetime') {
        const result = await prisma.oneTimeAvailability.create({ data });
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

// Helper to delete rules via DELETE is also possible
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // 'rule' or 'onetime'

    if (!id || !type) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    if (type === 'rule') {
        await prisma.availability.delete({ where: { id } });
    } else {
        await prisma.oneTimeAvailability.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
}
