import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';
export const GET = async (req: NextRequest, context: any) => {
    try {
      const { id: userId } = context.params; // Extract userId from dynamic route params
  
      if (!userId) {
        return NextResponse.json({ message: 'Missing userId in request' }, { status: 400 });
      }
  
      const client = await pool.connect();
      try {
        const query = 'SELECT * FROM Reservation WHERE userID = $1;';
        const result = await client.query(query, [userId]);
  
        if (result.rowCount === 0) {
          return NextResponse.json({ message: 'No reservations found for this user' }, { status: 404 });
        }
  
        return NextResponse.json(result.rows, { status: 200 });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return NextResponse.json({ message: 'Error fetching reservations' }, { status: 500 });
    }
  };

  
export const POST = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const role = false;
      try {
        const { userID, flightID, mealID, price } = await req.json();
        const query = `
          INSERT INTO Reservation (userID, flightID, mealID, price, done)
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