import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest, context: any) => {
  const { id } = await context.params; // Await the context.params before accessing the id
  const userId = id; // Get the user ID from URL parameters

  console.log('User ID received:', userId); // Debugging line

  try {
    const client = await pool.connect();
    try {
      // Query to count following users
      const countQuery = `
        SELECT COUNT(follower_id) AS following_count 
        FROM user_followers 
        WHERE follower_id = $1;
      `;
      
      const result = await client.query(countQuery, [userId]);
      const followingCount = result.rows[0]?.following_count || 0; // Default to 0 if no followings

      return NextResponse.json({ following_count: followingCount }, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching following count:', error);
    return NextResponse.json({ message: "Error fetching following count" }, { status: 500 });
  }
};
