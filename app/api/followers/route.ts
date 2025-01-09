import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET request to count followers for a specific user
export const GET = async (req: NextRequest, context:any) => {
  const userId = context.params.id;
  try {
    const client = await pool.connect();
    try {
      // Query to get all followers
      const query = `
        SELECT follower_id 
        FROM user_followers 
        WHERE user_id = $1;
      `;
      
      const result = await client.query(query, [userId]);
      const followers = result.rows.map(row => row.follower_id);

      return NextResponse.json({ followers }, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ message: "Error fetching followers" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId, followerId } = await req.json();

    if (!userId || !followerId) {
      return NextResponse.json(
        { message: "User ID or follower ID is missing" }, 
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // First check if the follow relationship already exists
      const checkQuery = `
        SELECT * FROM user_followers 
        WHERE user_id = $1 AND follower_id = $2;
      `;
      
      const existingFollow = await client.query(checkQuery, [userId, followerId]);
      
      if (existingFollow.rows.length > 0) {
        return NextResponse.json(
          { message: "Already following this user" }, 
          { status: 409 }
        );
      }

      // If not already following, insert new follow relationship
      const insertQuery = `
        INSERT INTO user_followers (user_id, follower_id, follow_date) 
        VALUES ($1, $2, NOW())
        RETURNING *;
      `;
      
      const result = await client.query(insertQuery, [userId, followerId]);
      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error in follow operation:', error);
    return NextResponse.json(
      { message: "Error processing follow request" }, 
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { userId, followerId } = await req.json();

    if (!userId || !followerId) {
      return NextResponse.json(
        { message: "User ID or follower ID is missing" }, 
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const deleteQuery = `
        DELETE FROM user_followers 
        WHERE user_id = $1 AND follower_id = $2
        RETURNING *;
      `;
      
      const result = await client.query(deleteQuery, [userId, followerId]);
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "Follow relationship not found" }, 
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Successfully unfollowed" }, 
        { status: 200 }
      );
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error in unfollow operation:', error);
    return NextResponse.json(
      { message: "Error processing unfollow request" }, 
      { status: 500 }
    );
  }
};