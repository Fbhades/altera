import React, { useState, useEffect } from 'react';
import { Flight } from '../Interface/interface';

const Flights = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const fetchFlights = async () => {
            const response = await fetch('/api/flights');
            const data = await response.json();
            setFlights(data);
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
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={newFlight.destination}
                onChange={handleInputChange}
                required
                className="border p-2 mb-2 w-full" // Example styling
            />
            <input
                type="text"
                name="depart"
                placeholder="Departure Time (e.g., 14:30)"
                value={newFlight.depart}
                onChange={handleInputChange}
                required
                className="border p-2 mb-2 w-full" // Example styling
            />
            <input
                type="text"
                name="airline"
                placeholder="Airline"
                value={newFlight.airline}
                onChange={handleInputChange}
                required
                className="border p-2 mb-2 w-full" // Example styling
            />
            <input
                type="date"
                name="date"
                value={newFlight.date}
                onChange={handleInputChange}
                required
                className="border p-2 mb-2 w-full" // Example styling
            />
            <button type="submit" className="btn">
                Add Flight
            </button>
        </form>
    );
};

export default Flights;