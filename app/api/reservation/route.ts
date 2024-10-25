import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';


export const POST = async (req: NextRequest) => {
  try {
    const client = await pool.connect();
    const role = false;
    try {
      const { userID, flightID, mealID, price } = await req.json();
      const query = `
        INSERT INTO Reservation (userID, flightID, mealID, price)
        VALUES ($1, $2, $3, $4 , $5)
        RETURNING *;
      `;
      const values = [userID, flightID, mealID, price,role];
      const result = await client.query(query, values);
      return NextResponse.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.error();
  }
};