"use client";

import { useState, useEffect } from "react";

interface Reservation {
  userID: number;
  flightID: number;
  mealID: number;
  price: number;
}

interface Flight {
  id: number;
  destination: string;
  depart: string;
  airline: string;
  date: string;
  classType: string; // Add classType to the Flight interface
}

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Reservation[]>([]);
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    destination: '',
    depart: '',
    airline: '',
    date: '',
    classType: 'economy', // Default class type
  });

  useEffect(() => {
    // Fetch all reservations
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/reservations');
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    // Fetch all flights
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/flights');
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchReservations();
    fetchFlights();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user?email=${searchEmail}`);
      const data = await response.json();
      if (data.userID) {
        const userReservations = reservations.filter(reservation => reservation.userID === data.userID);
        setSearchResults(userReservations);
      } else {
        console.error('No user found for this email');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching reservations:', error);
      setSearchResults([]);
    }
  };

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFlight),
      });
      const data = await response.json();
      setFlights([...flights, data]);
      setNewFlight({ destination: '', depart: '', airline: '', date: '', classType: 'economy' });
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const handleDeleteFlight = async (flightID: number) => {
    try {
      await fetch(`http://localhost:3000/api/flights/${flightID}`, {
        method: 'DELETE',
      });
      setFlights(flights.filter(flight => flight.id !== flightID));
    } catch (error) {
      console.error('Error deleting flight:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Administrator Page</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Search Reservations by Email</h3>
            <div className="flex mb-4">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter user email"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 transition ml-4"
              >
                Search
              </button>
            </div>
            {searchResults.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-700">Search Results</h4>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-gray-700">User ID</th>
                      <th className="py-2 px-4 border-b text-gray-700">Flight ID</th>
                      <th className="py-2 px-4 border-b text-gray-700">Meal ID</th>
                      <th className="py-2 px-4 border-b text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((reservation, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b text-gray-700">{reservation.userID}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{reservation.flightID}</td>
                        <td className="py-2 px-4 border-b text-gray-700">{reservation.mealID}</td>
                        <td className="py-2 px-4 border-b text-gray-700">${reservation.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">All Reservations</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-700">User ID</th>
                  <th className="py-2 px-4 border-b text-gray-700">Flight ID</th>
                  <th className="py-2 px-4 border-b text-gray-700">Meal ID</th>
                  <th className="py-2 px-4 border-b text-gray-700">Price</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-gray-700">{reservation.userID}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{reservation.flightID}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{reservation.mealID}</td>
                    <td className="py-2 px-4 border-b text-gray-700">${reservation.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Add New Flight</h3>
            <form onSubmit={handleAddFlight}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  value={newFlight.destination}
                  onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="depart">
                  Departure Time
                </label>
                <input
                  id="depart"
                  type="text"
                  value={newFlight.depart}
                  onChange={(e) => setNewFlight({ ...newFlight, depart: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="airline">
                  Airline
                </label>
                <input
                  id="airline"
                  type="text"
                  value={newFlight.airline}
                  onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={newFlight.date}
                  onChange={(e) => setNewFlight({ ...newFlight, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="classType">
                  Class Type
                </label>
                <select
                  id="classType"
                  value={newFlight.classType}
                  onChange={(e) => setNewFlight({ ...newFlight, classType: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-500 transition">
                  Add Flight
                </button>
              </div>
            </form>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">All Flights</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-gray-700">Flight ID</th>
                  <th className="py-2 px-4 border-b text-gray-700">Destination</th>
                  <th className="py-2 px-4 border-b text-gray-700">Departure Time</th>
                  <th className="py-2 px-4 border-b text-gray-700">Airline</th>
                  <th className="py-2 px-4 border-b text-gray-700">Date</th>
                  <th className="py-2 px-4 border-b text-gray-700">Class Type</th>
                  <th className="py-2 px-4 border-b text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-gray-700">{flight.id}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{flight.destination}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{flight.depart}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{flight.airline}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{new Date(flight.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{flight.classType}</td>
                    <td className="py-2 px-4 border-b text-gray-700">
                      <button
                        onClick={() => handleDeleteFlight(flight.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-lg font-semibold hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}