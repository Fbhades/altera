import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest, context: any) => {
  const id = context.params.id; // Assuming the flight_id is passed through the URL
  try {
    const client = await pool.connect();
    try {
      // First Query: Fetch business flight details
      const flightQuery = `
        SELECT 
          f.id AS flight_id,
          f.Destination,
          f.Depart,
          f.Airline,
          f.Date,
          bf.Available_Seats AS business_available_seats,
          bf.Flight_Price AS business_price,
          bf.Baggage_Allowance AS business_baggage_allowance,
          bf.lounge_Access AS business_lounge_access
        FROM Flight f
        JOIN BusinessFlight bf ON f.id = bf.flight_id
        WHERE bf.id = $1;
      `;
      
      const flightResult = await client.query(flightQuery, [id]);
      const businessFlightInfo = flightResult.rows[0]; // Assuming there is only one result
      
      // Second Query: Fetch meal options for the business flight
      const mealQuery = `
        SELECT * 
        FROM mealoption 
        WHERE id IN (
          SELECT meal_option_id 
          FROM businessflightmealoption 
          WHERE business_flight_id = $1
        );
      `;
      
      const mealResult = await client.query(mealQuery, [id]);
      const meals = mealResult.rows;

      // Combine flight info and meals
      const response = {
        ...businessFlightInfo,
        meals: meals
      };

      console.log("Fetched business flight and meal data:", response);
      return NextResponse.json(response, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching business flight and meal data:', error);
    return NextResponse.json({ message: "Error fetching business flight and meal data" }, { status: 500 });
  }
};
