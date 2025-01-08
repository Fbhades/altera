// pages/api/searchHotels.ts
import { NextResponse, NextRequest } from 'next/server';
import Amadeus from 'amadeus-ts';

// Initialize Amadeus client
if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
  throw new Error("Missing Amadeus API credentials in environment variables.");
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET,
});

// GET request to search for hotels by city code
export const GET = async (req: NextRequest,context:any) => {
  const { contry } = await context.params

  // Validate query parameter
  if (!contry || typeof contry !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid "country" parameter.' }, { status: 400 });
  }

  try {
    // Fetch hotel offers from Amadeus
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: contry, // Use the city code for the hotel search
    });

    // Send the hotel data as a response
    return NextResponse.json({ hotels: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching hotel data:', error.message || error);
    return NextResponse.json({ error: error.message || 'An error occurred while fetching hotels.' }, { status: 500 });
  }
};
