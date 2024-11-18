import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a single reservation by ID
export const GET = async (req: NextRequest,context: any) => {
  try {
    const id = context.params.id;


    if (!id) {
      return NextResponse.json({ message: 'Missing reservation ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT * FROM reservation WHERE id = $1;';
    const result = await client.query(query, [id]);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json({ message: 'Error fetching reservation' }, { status: 500 });
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

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ message: 'Error updating reservation' }, { status: 500 });
  }
};

// DELETE: Delete a reservation by ID
export const DELETE = async (req: NextRequest,context: any) => {
  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json({ message: 'Missing reservation ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM reservation WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Reservation deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json({ message: 'Error deleting reservation' }, { status: 500 });
  }
};
