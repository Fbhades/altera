import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Get all followers of a user
export const GET = async (req: NextRequest, context: any) => {
  try {
    const { id } = context.params; // User ID for which to get followers

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT * FROM user_followers WHERE user_id = $1;';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'No followers found' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ message: 'Error fetching followers' }, { status: 500 });
  }
};

// POST: Follow a user
export const POST = async (req: NextRequest) => {
  try {
    const { user_id, follower_id } = await req.json();

    if (!user_id || !follower_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO user_followers (user_id, follower_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await client.query(query, [user_id, follower_id]);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ message: 'Error following user' }, { status: 500 });
  }
};

// DELETE: Unfollow a user
export const DELETE = async (req: NextRequest) => {
  try {
    const { user_id, follower_id } = await req.json();

    if (!user_id || !follower_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM user_followers WHERE user_id = $1 AND follower_id = $2 RETURNING *;';
    const result = await client.query(query, [user_id, follower_id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Follow relationship not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ message: 'Error unfollowing user' }, { status: 500 });
  }
};

// POST: Create a new follower
export const POST_FOLLOWER = async (req: NextRequest) => {
  try {
    const { follower_id } = await req.json();

    if (!follower_id) {
      return NextResponse.json({ message: 'Missing follower ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'INSERT INTO follower (follower_id) VALUES ($1) RETURNING *;';
    const result = await client.query(query, [follower_id]);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating follower:', error);
    return NextResponse.json({ message: 'Error creating follower' }, { status: 500 });
  }
};

// DELETE: Delete a follower
export const DELETE_FOLLOWER = async (req: NextRequest) => {
  try {
    const { follower_id } = await req.json();

    if (!follower_id) {
      return NextResponse.json({ message: 'Missing follower ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM follower WHERE follower_id = $1 RETURNING *;';
    const result = await client.query(query, [follower_id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Follower not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Follower deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting follower:', error);
    return NextResponse.json({ message: 'Error deleting follower' }, { status: 500 });
  }
};
