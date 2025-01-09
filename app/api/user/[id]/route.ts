import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db'; // Ensure you have a database connection setup

export const GET = async (req: NextRequest,context: any) => {
  const email = context.params.id;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id AS userID, name, email, role
        FROM Users
        WHERE id = $1;
      `;
      const result = await client.query(query, [email]);

      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.error();
  }
};