// In your Next.js API route for following counts
import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';
export const GET = async (req: NextRequest, context:any) => {
    const userId = context.params.userId; // Get the user ID from URL parameters
    try {
      const client = await pool.connect();
      try {
        // Query to count following users
        const countQuery = `
          SELECT COUNT(following_id) AS following_count 
          FROM user_followers 
          WHERE follower_id = $1; // Adjust based on your table structure
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
  