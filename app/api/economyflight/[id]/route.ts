import { NextResponse, NextRequest } from 'next/server';
import pool from '@/db';

export const GET = async (req: NextRequest, context: any) => {
  const id = context.params.id; // Assuming the flight_id is passed through the URL
  try {
    const client = await pool.connect();
    try {
      // First Query: Fetch economy flight details
      const flightQuery = `
        SELECT 
          f.id AS flight_id,
          f.Destination,
          f.Depart,
          f.Airline,
          f.Date,
          ef.Available_Seats AS economy_available_seats,
          ef.Flight_Price AS economy_price,
          ef.Baggage_Capacity AS economy_baggage_capacity,
          ef.Extra_Baggage_Cost AS economy_extra_baggage_cost
        FROM Flight f
        JOIN EconomyFlight ef ON f.id = ef.flight_id
        WHERE ef.id = $1;
      `;
      
      const flightResult = await client.query(flightQuery, [id]);
      const economyFlightInfo = flightResult.rows[0]; // Assuming there is only one result

      // Second Query: Fetch meal options for the economy flight
      const mealQuery = `
        SELECT * 
        FROM mealoption 
        WHERE id IN (
          SELECT meal_option_id 
          FROM economyflightmealoption 
          WHERE economy_flight_id = $1
        );
      `;
      
      const mealResult = await client.query(mealQuery, [id]);
      const meals = mealResult.rows;

      // Combine flight info and meals
      const response = {
        ...economyFlightInfo,
        meals: meals
      };

      console.log("Fetched economy flight and meal data:", response);
      return NextResponse.json(response, { status: 200 });
    } finally {
      await client.release();
    }
  } catch (error) {
    console.error('Error fetching economy flight and meal data:', error);
    return NextResponse.json({ message: "Error fetching economy flight and meal data" }, { status: 500 });
  }
};
