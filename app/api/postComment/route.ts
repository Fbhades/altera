import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a comment by postid, comment_id, and user_id


// POST: Create a new comment for a post
export const POST = async (req:NextRequest) => {
  try {
    const { postid, user_id, comment_content } = await req.json();

    if (!postid || !user_id || !comment_content) {
      return NextResponse.json(
        { message: 'Missing required fields (postid, user_id, comment_content)' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO post_comment (postid, user_id, comment_content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [postid, user_id, comment_content];
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

// PUT: Update a comment by postid, comment_id, and user_id
export const PUT = async (req:NextRequest) => {
  try {
    const { postid, comment_id, user_id, comment_content } = await req.json();

    if (!postid || !comment_id || !user_id || !comment_content) {
      return NextResponse.json(
        { message: 'Missing required fields (postid, comment_id, user_id, comment_content)' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const query = `
        UPDATE post_comment
        SET comment_content = $1
        WHERE postid = $2 AND comment_id = $3 AND user_id = $4
        RETURNING *;
      `;
      const values = [comment_content, postid, comment_id, user_id];
      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        return NextResponse.json(
          { message: 'Comment not found or not updated' },
          { status: 404 }
        );
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

// DELETE: Delete a comment by postid, comment_id, and user_id
export const DELETE = async (req:NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;
    const postid = searchParams.get('postid');
    const comment_id = searchParams.get('comment_id');
    const user_id = searchParams.get('user_id');

    if (!postid || !comment_id || !user_id) {
      return NextResponse.json(
        { message: 'Missing postid, comment_id, or user_id in query parameters' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM post_comment
        WHERE postid = $1 AND comment_id = $2 AND user_id = $3
        RETURNING *;
      `;
      const result = await client.query(query, [postid, comment_id, user_id]);

      if (result.rowCount === 0) {
        return NextResponse.json(
          { message: 'No comment found to delete' },
          { status: 404 }
        );
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
