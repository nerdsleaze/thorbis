import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const activeBlueprint = await prisma.blueprint.findFirst({
      where: { isActive: true }
    });

    if (!activeBlueprint) {
      return NextResponse.json({ error: 'No active blueprint found' }, { status: 404 });
    }

    return NextResponse.json({ activeBlueprint });
  } catch (error) {
    console.error('Error fetching active blueprint:', error);
    return NextResponse.json({ error: 'Failed to fetch active blueprint', details: error.message }, { status: 500 });
  }
}