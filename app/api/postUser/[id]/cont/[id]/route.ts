import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Count all upvotes and downvotes for a specific post
export const GET = async (req: NextRequest, context: any) => {
  try {
    const { id } = context.params; // Assuming 'id' is the post ID

    if (!id) {
      return NextResponse.json({ message: 'Missing post ID in request' }, { status: 400 });
    }

    const client = await pool.connect();

    // Query to count upvotes and downvotes for the specific post
    const query = `
      SELECT 
        SUM(upvote) AS total_upvotes,
        SUM(downvote) AS total_downvotes
      FROM post_user 
      WHERE postid = $1;
    `;
    const result = await client.query(query, [id]);
    client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'No votes found for the specified post' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error counting votes:', error);
    return NextResponse.json({ message: 'Error counting votes' }, { status: 500 });
  }
};
