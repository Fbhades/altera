import { NextResponse, NextRequest } from 'next/server';

interface Recommendation {
  id: number;
  destination: string;
  depart: string;
  airline: string;
  date: string;
}

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    if (!params.id || isNaN(Number(params.id))) {
      return NextResponse.json(
        { message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `http://localhost:8000/api/recommendations/${params.id}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${await response.text()}`);
    }

    const recommendations: Recommendation[] = await response.json();
    
    return NextResponse.json(recommendations, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });

  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { message: 'Request timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { message: 'Error fetching recommendations' },
      { status: 500 }
    );
  }
};