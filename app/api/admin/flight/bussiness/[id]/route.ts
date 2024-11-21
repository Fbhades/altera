import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest,context: any) => {
    const id = context.params.id;
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM businessflight WHERE flight_id = $1;';
      const result = await client.query(query, [id]);
      const users = result.rows;
      await client.release();
      
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
  };


export const PUT = async (req: NextRequest,context: any) => {
    try {
      const { id, baggageAllowance, loungeAccess, flightPrice, availableSeats, flightId } = await req.json();
  
      if (!id || !baggageAllowance || loungeAccess === undefined || !flightPrice || !availableSeats || !flightId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const query = `
        UPDATE business_flight
        SET baggage_allowance = $1, lounge_access = $2, flight_price = $3, available_seats = $4, flight_id = $5
        WHERE flight_id = $6 RETURNING *;
      `;
      const values = [baggageAllowance, loungeAccess, flightPrice, availableSeats, flightId, id];
      const result = await client.query(query, values);
      await client.release();
  
      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'Business flight not found' }, { status: 404 });
      }
  
      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      console.error('Error updating business flight:', error);
      return NextResponse.json({ message: 'Error updating business flight' }, { status: 500 });
    }
  };

  export const DELETE = async (req: NextRequest,context: any) => {
    try {
        const id = context.params.id;
  
      if (!id) {
        return NextResponse.json({ message: 'Missing business flight ID' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const query = 'DELETE FROM business_flight WHERE flight_id = $1 RETURNING *;';
      const result = await client.query(query, [id]);
      await client.release();
  
      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'Business flight not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Business flight deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting business flight:', error);
      return NextResponse.json({ message: 'Error deleting business flight' }, { status: 500 });
    }
  };
  