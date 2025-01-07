import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest, context: any) => {
  try {
    const { userId } = context.params;
    const response = await fetch(`/api/ai/recommendations/${userId}`);
    const recommendations = await response.json();
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json({ message: 'Error fetching recommendations' }, { status: 500 });
  }
};