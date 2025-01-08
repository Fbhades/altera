import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';
import { console } from 'inspector';

// GET: Fetch a specific record by ID
export const GET = async (req:NextRequest, context:any) => {
  try {
    const { id } = context.params;

    console.log('GET id:', id);

    if (!id) {
      return NextResponse.json({ message: 'Missing ID in request' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT * FROM post_user WHERE userid = $1;';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching post_user record:', error);
    return NextResponse.json({ message: 'Error fetching post_user record' }, { status: 500 });
  }
};

// POST: Create a new post_user record by user ID
export const POST = async (req:NextRequest, context:any) => {
  try {
    const { userId } = context.params;
    const body = await req.json();
    const { postid, upvote, downvote } = body;
    console.log(userId, body);

    const client = await pool.connect();
    try {
      // Check if user has already upvoted this post
      const checkQuery = `
        SELECT * FROM post_user 
        WHERE postid = $1 AND userid = $2;
      `;
      const checkResult = await client.query(checkQuery, [postid, userId]);
      
      if (checkResult.rowCount && checkResult.rowCount > 0) {
        return NextResponse.json(
          { message: 'User has already voted on this post' },
          { status: 400 }
        );
      }

      // If no existing vote, insert new record
      const query = `
        INSERT INTO post_user (postid, userid, upvote, downvote)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [postid, userId, upvote, downvote];
      const result = await client.query(query, values);

      // Update post upvote count
      const updatePostQuery = `
        UPDATE posts 
        SET upvotes = (
          SELECT COUNT(*)
          FROM post_user 
          WHERE postid = $1 AND upvote = true
        )
        WHERE postid = $1
        RETURNING upvotes;
      `;
      console.log(postid);
      const updateResult = await client.query(updatePostQuery, [postid]);
      
      return NextResponse.json({
        ...result.rows[0],
        upvotes: updateResult.rows[0].upvotes
      }, { status: 201 });
    } finally {
      client.release();
    }
  }
  catch (error) {
    return error;
  }
};

// PUT: Update an existing post_user record
export const PUT = async (req:NextRequest, context:any) => {
  try {
    const { id } = context.params; // Assuming 'id' is the record ID
    const body = await req.json();
    const { postid, userid, upvote, downvote } = body;
    console.log('PUT body:', body);

    if (!id || !postid || !userid || upvote === undefined || downvote === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE post_user
      SET postid = $1, userid = $2, upvote = $3, downvote = $4
      WHERE userid = $5
      RETURNING *;
    `;
    const values = [postid, userid, upvote, downvote];
    console.log('PUT values:', values);
    const result = await client.query(query, values);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating post_user record:', error);
    return NextResponse.json({ message: 'Error updating post_user record' }, { status: 500 });
  }
};
