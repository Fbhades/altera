import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest) => {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM economyflight;';
      const result = await client.query(query);
      const users = result.rows;
      await client.release();
      
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
  };

export const POST = async (req: NextRequest) => {
  try {
    const { baggageCapacity, extraBaggageCost, availableSeats, flightPrice, flightId } = await req.json();

    if (!baggageCapacity || !extraBaggageCost || !availableSeats || !flightPrice || !flightId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await pool.connect();
    const query = `
      INSERT INTO economy_flight (baggage_capacity, extra_baggage_cost, available_seats, flight_price, flight_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [baggageCapacity, extraBaggageCost, availableSeats, flightPrice, flightId];
    const result = await client.query(query, values);
    await client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating economy flight:', error);
    return NextResponse.json({ message: 'Error creating economy flight' }, { status: 500 });
  }
};



  export const PUT = async (req: NextRequest) => {
    try {
      const { id, baggageCapacity, extraBaggageCost, availableSeats, flightPrice, flightId } = await req.json();
  
      if (!id || !baggageCapacity || !extraBaggageCost || !availableSeats || !flightPrice || !flightId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      const client = await pool.connect();
      const query = `
        UPDATE economy_flight
        SET baggage_capacity = $1, extra_baggage_cost = $2, available_seats = $3, flight_price = $4, flight_id = $5
        WHERE id = $6 RETURNING *;
      `;
      const values = [baggageCapacity, extraBaggageCost, availableSeats, flightPrice, flightId, id];
      const result = await client.query(query, values);
      await client.release();
  
      if (result.rowCount === 0) {
        return NextResponse.json({ message: 'Economy flight not found' }, { status: 404 });
      }
  
      return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
      console.error('Error updating economy flight:', error);
      return NextResponse.json({ message: 'Error updating economy flight' }, { status: 500 });
    }
  };
  