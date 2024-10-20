import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination'); // Get destination from query params
  const flightClass = searchParams.get('class'); // Get class (economy or business) from query params
  const price = searchParams.get('price'); // Get price from query params (maximum price)

  try {
    const client = await pool.connect();
    try {
      let query = '';
      let queryParams: any[] = [];

      // Check for flight class (economy or business) and build the query dynamically
      if (flightClass === 'economy') {
        query = `
          SELECT 
            f.id AS flight_id,
            f.Destination,
            f.Depart,
            f.Airline,
            f.Date,
            ef.Available_Seats AS available_seats,
            ef.Flight_Price AS flight_price,
            ef.Baggage_Capacity AS baggage_capacity,
            ef.Extra_Baggage_Cost AS extra_baggage_cost
          FROM Flight f
          JOIN EconomyFlight ef ON f.flight_id = ef.flight_id
          WHERE LOWER(f.Destination) = LOWER($1) AND ef.Flight_Price <= $2;
        `;
        queryParams = [destination, price];
      } else if (flightClass === 'business') {
        query = `
          SELECT 
            f.id AS flight_id,
            f.Destination,
            f.Depart,
            f.Airline,
            f.Date,
            bf.Available_Seats AS available_seats,
            bf.Flight_Price AS flight_price,
            bf.Baggage_Allowance AS baggage_allowance,
            bf.lounge_Access AS lounge_access
          FROM Flight f
          JOIN BusinessFlight bf ON f.id = bf.flight_id
         WHERE LOWER(f.Destination) = LOWER($1) AND bf.Flight_Price <= $2;
        `;
        queryParams = [destination, price];
      } else {
        return NextResponse.json({ message: "Invalid class parameter. Must be either 'economy' or 'business'." }, { status: 400 });
      }

      // Execute the query
      const result = await client.query(query, queryParams);
      const flights = result.rows;

      console.log("Fetched filtered flights:", flights);
      return NextResponse.json(flights, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching filtered flights:', error);
    return NextResponse.json({ message: "Error fetching flights" }, { status: 500 });
  }
};
