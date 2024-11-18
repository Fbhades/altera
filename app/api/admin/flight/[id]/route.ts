import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch a single flight by ID
export const GET = async (req: NextRequest,context: any) => {
  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json({ message: 'Missing flight ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'SELECT * FROM flight WHERE id = $1;';
    const result = await client.query(query, [id]);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json({ message: 'Error fetching flight' }, { status: 500 });
  }
};

// PUT: Update an existing flight by ID
export const PUT = async (req: NextRequest,context: any) => {
  try {
    const body = await req.json();
    const { id, destination, depart, airline, date } = body;

    if (!id || !destination || !depart || !airline || !date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE flight
      SET destination = $1, depart = $2, airline = $3, date = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [destination, depart, airline, date, id];
    const result = await client.query(query, values);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json({ message: 'Error updating flight' }, { status: 500 });
  }
};

// DELETE: Delete a flight by ID
export const DELETE = async (req: NextRequest,context: any) => {
  try {
    const id = context.params.id;

    if (!id) {
      return NextResponse.json({ message: 'Missing flight ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM flight WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Flight not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Flight deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json({ message: 'Error deleting flight' }, { status: 500 });
  }
};
