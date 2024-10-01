import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('API route: Starting to fetch blueprints');
        
        // Log the database URL (make sure to redact any sensitive information)
        console.log('Database URL:', process.env.DATABASE_URL.replace(/:[^:@]{1,}@/, ':****@'));
        
        const blueprintCount = await prisma.blueprint.count();
        console.log('Total blueprint count:', blueprintCount);
        
        const blueprints = await prisma.blueprint.findMany();
        console.log('API route: Raw blueprints data:', blueprints);
        console.log('API route: Fetched blueprints:', JSON.stringify(blueprints, null, 2));
        
        if (blueprints.length === 0) {
            console.log('API route: No blueprints found in the database');
        }
        
        return NextResponse.json({ blueprints });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to fetch blueprints', details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { id } = await request.json();
        
        // Deactivate all blueprints
        await prisma.blueprint.updateMany({
            data: { isActive: false }
        });

        // Activate the selected blueprint
        const activatedBlueprint = await prisma.blueprint.update({
            where: { id },
            data: { isActive: true }
        });

        return NextResponse.json({ success: true, activatedBlueprint });
    } catch (error) {
        console.error('Error activating blueprint:', error);
        return NextResponse.json({ error: 'Failed to activate blueprint', details: error.message }, { status: 500 });
    }
}