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

// GET: Show posts by followed users
export const GET_FOLLOWING_POSTS = async (req: NextRequest, context: any) => {
  try {
    const { id } = context.params; // Logged-in user ID

    if (!id) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      SELECT 
        p.id AS post_id,
        p.content AS post_content,
        p.created_at AS post_created_at,
        u.username AS author_username,
        COUNT(pu.upvote) AS upvotes,
        COUNT(pu.downvote) AS downvotes
      FROM post p
      JOIN user_followers uf ON uf.user_id = p.userid
      JOIN users u ON p.userid = u.id
      LEFT JOIN post_user pu ON pu.postid = p.id
      WHERE uf.follower_id = $1
      GROUP BY p.id, u.username, p.content, p.created_at
      ORDER BY p.created_at DESC;
    `;
    const result = await client.query(query, [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'No posts found from followed users' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts from followed users:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
};
