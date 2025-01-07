import { NextRequest, NextResponse } from 'next/server';
import pool  from '@/db';  // Ensure to import the correct pool instance

export const POST = async (req: NextRequest) => { // Change GET to POST
  try {
    const body = await req.json();
    const { postid } = body; // Fetch user_id and postid from the request body

    if (!postid) {
      return NextResponse.json(
        { message: 'Missing user_id or postid in request body' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          pc.comment_content as comment, 
          u.name AS user_name
        FROM post_comment pc
        JOIN users u ON pc.user_id = u.id
        WHERE pc.postid = $1 ;
      `;
      const result = await client.query(query, [postid]);


      return NextResponse.json(result.rows, { status: 200 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching post comments:', error);
    return NextResponse.json({ message: 'Error fetching post comments' }, { status: 500 });
  }
};
