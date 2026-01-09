import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    const { searchParams } = request.nextUrl;
    console.log(searchParams);
    const query = searchParams.get('query');
    console.log(query);
    
    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    try {
        const problems = await prisma.problem.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        });

        return NextResponse.json(problems);
    } catch (error) {
        console.error('Error searching problems:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}