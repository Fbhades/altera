import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch number of posts for a specific user
export const GET = async (req: NextRequest) => {
  const { userid } = await req.json();
  try {
    const client = await pool.connect();
    const query = 'SELECT COUNT(*) FROM post WHERE userid = $1;';
    const result = await client.query(query, [userid]);
    client.release();

    return NextResponse.json({ numberOfPosts: result.rows[0].count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching number of posts:', error);
    return NextResponse.json({ message: 'Error fetching number of posts' }, { status: 500 });
  }
};
