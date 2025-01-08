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

// GET request to search for hotels by hotel ID
export const GET = async (req: NextRequest, context: any) => {
  const { id } = context.params;

  // Validate query parameter
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid "id" parameter.' }, { status: 400 });
  }

  try {
    // Fetch hotel offers from Amadeus
    const response = await amadeus.shopping.hotelOffersSearch.get({
        hotelIds : id,
    });

    // Send the hotel data as a response
    return NextResponse.json({ hotels: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching hotel data:', error.message || error);
    return NextResponse.json({ error: error.message || 'An error occurred while fetching hotels.' }, { status: 500 });
  }
};
