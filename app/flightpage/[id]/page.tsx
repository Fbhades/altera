"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Flight_details_business, Flight_details_economy } from "@/app/Interface/interface";

export default function Home() {
  const router = useRouter();
  const { id } = useParams();
  const [flightDetails, setFlightDetails] = useState<Flight_details_economy | Flight_details_business | null>(null);
  const [flightClass, setFlightClass] = useState('economy'); // State to track selected class
  const [selectedMeal, setSelectedMeal] = useState<number | null>(null); // State to track selected meal

  useEffect(() => {
    if (id) {
      const fetchFlightDetails = async () => {
        try {
          const url = flightClass === 'economy' 
            ? `http://localhost:3000/api/economyflight/${id}`
            : `http://localhost:3000/api/bussinessflight/${id}`;

          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          setFlightDetails(data);
        } catch (error) {
          console.error('Error fetching flight details:', error);
        }
      };

      fetchFlightDetails();
    }
  }, [id, flightClass]); // Re-fetch when id or flightClass changes

  if (!flightDetails) {
    return <div>Loading...</div>;
  }

  // Calculate base price
  const basePrice = flightClass === 'economy' 
    ? parseFloat((flightDetails as Flight_details_economy).economy_price) 
    : parseFloat((flightDetails as Flight_details_business).business_price);

  // Find the selected meal
  const selectedMealData = flightDetails.meals.find(meal => meal.id === selectedMeal);

  // Calculate meal cost safely
  const mealCost = selectedMealData ? parseFloat(selectedMealData.cost) : 0;

  // Calculate total cost
  const totalCost = basePrice + mealCost;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Flight Details: {flightDetails.destination}</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Flight Information</h3>
            <p className="text-gray-700">Destination: {flightDetails.destination}</p>
            <p className="text-gray-700">Departure: {flightDetails.depart}</p>
            <p className="text-gray-700">Airline: {flightDetails.airline}</p>
            <p className="text-gray-700">Date: {new Date(flightDetails.date).toLocaleString()}</p>
            <p className="text-gray-700">Available Seats: {flightClass === 'economy' ? (flightDetails as Flight_details_economy).economy_available_seats : (flightDetails as Flight_details_business).business_available_seats}</p>
            <p className="text-gray-700">Price: ${basePrice.toFixed(2)}</p>
            <p className="text-gray-700">Baggage Capacity: {flightClass === 'economy' ? (flightDetails as Flight_details_economy).economy_baggage_capacity : (flightDetails as Flight_details_business).business_baggage_allowance}</p>
            {flightClass === 'economy' && (
              <p className="text-gray-700">Extra Baggage Cost: ${(flightDetails as Flight_details_economy).economy_extra_baggage_cost}</p>
            )}
            {flightClass === 'business' && (
              <p className="text-gray-700">Lounge Access: {(flightDetails as Flight_details_business).business_lounge_access ? 'Yes' : 'No'}</p>
            )}
          </div>

          {/* Meals Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Meals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {flightDetails.meals.map(meal => (
                <button 
                  key={meal.id} 
                  className={`border rounded-lg p-4 text-left transition duration-200 ease-in-out ${selectedMeal === meal.id ? 'bg-yellow-400 text-gray-900 font-bold' : 'bg-white text-gray-700 hover:bg-yellow-100'}`} 
                  onClick={() => setSelectedMeal(meal.id)}
                >
                  <div className="font-semibold">{meal.mealType}</div>
                  <div>{meal.description}</div>
                  <div className="mt-2 text-sm">${meal.cost}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Flight Class */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Select Flight Class</h3>
            <div className="flex space-x-4">
              <button 
                className={`py-2 px-4 rounded-lg font-semibold ${flightClass === 'economy' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFlightClass('economy')}
              >
                Economy
              </button>
              <button 
                className={`py-2 px-4 rounded-lg font-semibold ${flightClass === 'business' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFlightClass('business')}
              >
                Business
              </button>
            </div>
          </div>

          {/* Total Cost */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Total Cost: ${totalCost.toFixed(2)}</h3>
          </div>

          {/* Booking Button */}
          <div className="text-center">
            <a href="#" className="bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition">BOOK NOW</a>
          </div>
        </div>
      </main>
    </div>
  );
}