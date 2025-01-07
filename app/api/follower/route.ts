import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET request to count followers for a specific user
export const GET = async (req: NextRequest, context:any) => {
  const userId = context.params.userId; // Get the user ID from the URL parameters
  try {
    const client = await pool.connect();
    try {
      // Query to count followers
      const countQuery = `
        SELECT COUNT(follower_id) AS follower_count 
        FROM user_followers 
        WHERE user_id = $1;
      `;
      
      const result = await client.query(countQuery, [userId]);
      const followerCount = result.rows[0]?.follower_count || 0; // Default to 0 if no followers

      console.log(`Follower count for user ${userId}:`, followerCount);
      return NextResponse.json({ followerCount }, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching follower count:', error);
    return NextResponse.json({ message: "Error fetching follower count" }, { status: 500 });
  }
};

// POST request to add a new follower
export const POST = async (req: NextRequest) => {
  const { userId, followerId } = await req.json(); // Expecting JSON body with userId and followerId
  try {
    const client = await pool.connect();
    try {
      // Query to insert a new follower
      const insertQuery = `
        INSERT INTO user_followers (user_id, follower_id, follow_date) 
        VALUES ($1, $2, NOW())
        RETURNING *;
      `;
      
      const result = await client.query(insertQuery, [userId, followerId]);
      const newFollower = result.rows[0];

      console.log("New follower added:", newFollower);
      return NextResponse.json(newFollower, { status: 201 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error adding new follower:', error);
    return NextResponse.json({ message: "Error adding new follower" }, { status: 500 });
  }
};
