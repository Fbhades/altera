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
      const flightData = result.rows;

      console.log("Fetched flight data:", flightData);
      return NextResponse.json(flightData, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return NextResponse.json({ message: "Error fetching flight data" }, { status: 500 });
  }
};

