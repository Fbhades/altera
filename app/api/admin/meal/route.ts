import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

// GET: Fetch all meal options
export const GET = async (req: NextRequest) => {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM mealoption;';
    const result = await client.query(query);
    const mealOptions = result.rows;
    await client.release();

    return NextResponse.json(mealOptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching meal options:', error);
    return NextResponse.json({ message: 'Error fetching meal options' }, { status: 500 });
  }
};

// POST: Create a new meal option
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { snack, mealType, description, cost } = body;

    if (snack === undefined || !mealType || !description || cost === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO mealoption (snack, mealType, description, cost)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [snack, mealType, description, cost];
    const result = await client.query(query, values);
    await client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating meal option:', error);
    return NextResponse.json({ message: 'Error creating meal option' }, { status: 500 });
  }
};

// PUT: Update an existing meal option
export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, snack, mealType, description, cost } = body;

    if (!id || snack === undefined || !mealType || !description || cost === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      UPDATE mealoption
      SET snack = $1, mealType = $2, description = $3, cost = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [snack, mealType, description, cost, id];
    const result = await client.query(query, values);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Meal option not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error updating meal option:', error);
    return NextResponse.json({ message: 'Error updating meal option' }, { status: 500 });
  }
};

// DELETE: Delete a meal option
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Missing meal option ID' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = 'DELETE FROM mealoption WHERE id = $1 RETURNING *;';
    const result = await client.query(query, [id]);
    await client.release();

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Meal option not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Meal option deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting meal option:', error);
    return NextResponse.json({ message: 'Error deleting meal option' }, { status: 500 });
  }
};
