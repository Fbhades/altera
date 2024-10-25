import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest) => {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          f.id AS flight_id,
          f.Destination,
          f.Depart,
          f.Airline,
          f.Date,
          ef.Available_Seats AS economy_available_seats,
          ef.Flight_Price AS economy_price,
          ef.Baggage_Capacity AS economy_baggage_capacity,
          ef.Extra_Baggage_Cost AS economy_extra_baggage_cost,
          bf.Available_Seats AS business_available_seats,
          bf.Flight_Price AS business_price,
          bf.Baggage_Allowance AS business_baggage_allowance,
          bf.lounge_Access AS business_lounge_access
        FROM Flight f
        LEFT JOIN EconomyFlight ef ON f.id = ef.flight_id
        LEFT JOIN BusinessFlight bf ON f.id = bf.flight_id;
      `;
      const result = await client.query(query);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return NextResponse.error();
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const client = await pool.connect();
    try {
      const { userID, flightID, mealID, price } = await req.json();
      const query = `
        INSERT INTO Reservation (userID, flightID, mealID, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [userID, flightID, mealID, price];
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