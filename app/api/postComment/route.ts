import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a comment by postId and commentId
export const GET = async (req: NextRequest) => {
  try {
    const { postId, commentId } = await req.json(); // Fetch postId and commentId from the body

    if (!postId || !commentId) {
      return NextResponse.json({ message: 'Missing postId or commentId in request' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM postComment WHERE postId = $1 AND commentId = $2;';
      const result = await client.query(query, [postId, commentId]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'No comment found for this post and commentId' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0], { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching post comment:', error);
    return NextResponse.json({ message: 'Error fetching post comment' }, { status: 500 });
  }
};

// POST: Create a new comment for a post
export const POST = async (req: NextRequest) => {
  try {
    const { postId, userId, content } = await req.json(); // Fetch postId, userId, and content from the body

    if (!postId || !userId || !content) {
      return NextResponse.json({ message: 'Missing required fields (postId, userId, content)' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO postComment (postId, userId, content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [postId, userId, content];
      const result = await client.query(query, values);

      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating post comment:', error);
    return NextResponse.json({ message: 'Error creating post comment' }, { status: 500 });
  }
};

// PUT: Update a comment by postId and commentId
export const PUT = async (req: NextRequest) => {
  try {
    const { postId, commentId, content } = await req.json(); // Fetch postId, commentId, and content from the body

    if (!postId || !commentId || !content) {
      return NextResponse.json({ message: 'Missing required fields (content)' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = `
        UPDATE postComment
        SET content = $1
        WHERE postId = $2 AND commentId = $3
        RETURNING *;
      `;
      const values = [content, postId, commentId];
      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'Comment not found or not updated' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0], { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating post comment:', error);
    return NextResponse.json({ message: 'Error updating post comment' }, { status: 500 });
  }
};

// DELETE: Delete a comment by postId and commentId
export const DELETE = async (req: NextRequest) => {
  try {
    const { postId, commentId } = await req.json(); // Fetch postId and commentId from the body

    if (!postId || !commentId) {
      return NextResponse.json({ message: 'Missing postId or commentId in request' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = 'DELETE FROM postComment WHERE postId = $1 AND commentId = $2 RETURNING *;';
      const result = await client.query(query, [postId, commentId]);

      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'No comment found to delete' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting post comment:', error);
    return NextResponse.json({ message: 'Error deleting post comment' }, { status: 500 });
  }
};
