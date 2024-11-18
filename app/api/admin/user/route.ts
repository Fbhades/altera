import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a single user by ID
export const GET = async (req: NextRequest) => {
  try {

    const client = await pool.connect();
    const query = 'SELECT * FROM users ;';
    const result = await client.query(query);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Error fetching user' }, { status: 500 });
  }
};

// POST: Create a new user
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email || role === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO users (name, email, role)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, email, role];
    const result = await client.query(query, values);
    await client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
};

// PUT: Update an existing user by ID
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, name, email, role } = body;

    if (!id || !name || !email || role === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE users
      SET name = $1, email = $2, role = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [name, email, role, id];
    const result = await client.query(query, values);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
};

