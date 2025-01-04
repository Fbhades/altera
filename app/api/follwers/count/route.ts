import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Count all followers of a user
export const GET_FOLLOWERS_COUNT = async (req: NextRequest, context: any) => {
  try {
    const { id } = context.params; // User ID for which to get the followers count

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT COUNT(*) FROM user_followers WHERE user_id = $1;';
    const result = await client.query(query, [id]);
    client.release();

    return NextResponse.json({ followers_count: result.rows[0].count }, { status: 200 });
  } catch (error) {
    console.error('Error counting followers:', error);
    return NextResponse.json({ message: 'Error counting followers' }, { status: 500 });
  }
};

// GET: Count all users a user is following
export const GET_FOLLOWING_COUNT = async (req: NextRequest, context: any) => {
  try {
    const { id } = context.params; // User ID for which to get the following count

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT COUNT(*) FROM user_followers WHERE follower_id = $1;';
    const result = await client.query(query, [id]);
    client.release();

    return NextResponse.json({ following_count: result.rows[0].count }, { status: 200 });
  } catch (error) {
    console.error('Error counting following:', error);
    return NextResponse.json({ message: 'Error counting following' }, { status: 500 });
  }
};
