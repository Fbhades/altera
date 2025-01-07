import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest, context: any) => {
    const { id } = await context.params;

  console.log('Fetching followers for User ID:', id); // Debugging line

  try {
    const client = await pool.connect();
    try {
      // Query to fetch all followers' names for the given user
      const followersQuery = `
        SELECT users.name,users.id
        FROM user_followers
        JOIN users ON user_followers.follower_id = users.id
        WHERE user_followers.user_id = $1; 
      `;
      
      const result = await client.query(followersQuery, [id]);
      const followers = result.rows.map(row => row.name); // Extracting only the names of the followers

      // Return the list of follower names as JSON
      return NextResponse.json({ followers: followers }, { status: 200 });
    } finally {
      await client.release(); // Always release the client back to the pool
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ message: 'Error fetching followers' }, { status: 500 });
  }
};
