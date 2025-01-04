import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch all posts
export const GET = async (req: NextRequest) => {
    const { userid } = await req.json();
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM post WHERE userid = $1;';
      const result = await client.query(query, [userid]);
      client.release();
      return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
    }
  };
  

// POST: Create a new post
export const POST = async (req:NextRequest) => {
  try {
    const { userid, content } = await req.json();

    if (!userid || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'INSERT INTO post (userid, content) VALUES ($1, $2) RETURNING *;';
    const result = await client.query(query, [userid, content]);
    client.release();
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
};

// PUT: Update a post
export const PUT = async (req:NextRequest) => {
  try {
    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'UPDATE post SET content = $1 WHERE id = $2 RETURNING *;';
    const result = await client.query(query, [content, id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
};

// DELETE: Delete a post
export const DELETE = async (req:NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'Missing post ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM post WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
};
