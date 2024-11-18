import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a single reservation by ID
export const GET = async (req: NextRequest) => {
  try {

    const client = await pool.connect();
    const query = 'SELECT * FROM reservation ';
    const result = await client.query(query);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json({ message: 'Error fetching reservation' }, { status: 500 });
  }
};

// POST: Create a new reservation
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { flightId, userId, price, done } = body;

    if (!flightId || !userId || !price || done === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO reservation (flightId, userId, price, done)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [flightId, userId, price, done];
    const result = await client.query(query, values);
    await client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ message: 'Error creating reservation' }, { status: 500 });
  }
};

// PUT: Update an existing reservation by ID
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, flightId, userId, price, done } = body;

    if (!id || !flightId || !userId || !price || done === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE reservation
      SET flightId = $1, userId = $2, price = $3, done = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [flightId, userId, price, done, id];
    const result = await client.query(query, values);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ message: 'Error updating reservation' }, { status: 500 });
  }
};


