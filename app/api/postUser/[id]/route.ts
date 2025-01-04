import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a specific record by ID
export const GET = async (req:NextRequest, context:any) => {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: 'Missing ID in request' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT * FROM post_user WHERE id = $1;';
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
    const { id: userId } = context.params; // Assuming 'id' in the route is the user ID
    const body = await req.json();
    const { postid, upvote, downvote } = body;

    if (!userId || !postid || upvote === undefined || downvote === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO post_user (postid, userid, upvote, downvote)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [postid, userId, upvote, downvote];
    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post_user record:', error);
    return NextResponse.json({ message: 'Error creating post_user record' }, { status: 500 });
  }
};

// PUT: Update an existing post_user record
export const PUT = async (req:NextRequest, context:any) => {
  try {
    const { id } = context.params; // Assuming 'id' is the record ID
    const body = await req.json();
    const { postid, userid, upvote, downvote } = body;

    if (!id || !postid || !userid || upvote === undefined || downvote === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE post_user
      SET postid = $1, userid = $2, upvote = $3, downvote = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [postid, userid, upvote, downvote, id];
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
