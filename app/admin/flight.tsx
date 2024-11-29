import React, { useState, useEffect } from 'react';
import { Flight } from '../Interface/interface'; // Adjust the import path as necessary

const Flights = () => {
    const [flights, setFlights] = useState<Flight[]>([]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('/api/admin/flight'); // Adjust API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFlights(data);
            } catch (error) {
                console.error('Error fetching flights:', error);
            }
        };
        fetchFlights();
    }, []);
    
    const [newFlight, setNewFlight] = useState<Flight>({
        id: 0,
        destination: '',
        depart: '',
        airline: '',
        date: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewFlight({ ...newFlight, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (create or update flight)
        console.log('New flight submitted:', newFlight);
        
        // Reset form after submission
        setNewFlight({
            id: 0,
            destination: '',
            depart: '',
            airline: '',
            date: '',
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Manage Flights</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={newFlight.destination}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="depart"
                    placeholder="Departure Time (e.g., 14:30)"
                    value={newFlight.depart}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="airline"
                    placeholder="Airline"
                    value={newFlight.airline}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    name="date"
                    value={newFlight.date}
                    onChange={handleInputChange}
                    required
                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
                >
                    Add Flight
                </button>
            </form>

            {/* Displaying the list of flights */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Existing Flights</h3>
                {flights.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {flights.map((flight) => (
                            <li key={flight.id} className="mb-2">
                                <strong className="text-yellow-300">Destination:</strong> {flight.destination} - 
                                <strong className="text-yellow-300"> Airline:</strong> {flight.airline} - 
                                <strong className="text-yellow-300"> Date:</strong> {flight.date} - 
                                <strong className="text-yellow-300"> Departure:</strong> {flight.depart}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No flights available.</p>
                )}
            </div>
        </div>
    );
};

export default Flights;