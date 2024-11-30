import React, { useState, useEffect } from 'react';
import { Flight } from '../Interface/interface'; // Adjust the import path as necessary
import { DeleteButton } from "@/components/ui/delete-button"
import { UpdateButton } from "@/components/ui/update-button"

const Flights = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [newFlight, setNewFlight] = useState<Flight>({
        id: 0,
        destination: '',
        depart: '',
        airline: '',
        date: '',
    });
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewFlight({ ...newFlight, [name]: value });
    };

    const handleUpdate = (flight: Flight) => {
        setEditingFlight(flight);
        setNewFlight(flight);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/flight/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setFlights(flights.filter(flight => flight.id !== id));
        } catch (error) {
            console.error('Error deleting flight:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFlight) {
            // Update existing flight
            try {
                const response = await fetch(`/api/admin/flight/${editingFlight.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFlight),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedFlight = await response.json();
                setFlights(flights.map(flight => (flight.id === updatedFlight.id ? updatedFlight : flight)));
            } catch (error) {
                console.error('Error updating flight:', error);
            }
        } else {
            // Create new flight
            try {
                const response = await fetch('/api/admin/flight', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFlight),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const createdFlight = await response.json();
                setFlights([...flights, createdFlight]);
            } catch (error) {
                console.error('Error creating flight:', error);
            }
        }

        // Reset form and editing state after submission
        setNewFlight({
            id: 0,
            destination: '',
            depart: '',
            airline: '',
            date: '',
        });
        setEditingFlight(null);
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
                    {editingFlight ? 'Update Flight' : 'Add Flight'}
                </button>
            </form>

            {/* Displaying the list of flights in a table */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Existing Flights</h3>
                {flights.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Destination</th>
                                <th className="py-2">Airline</th>
                                <th className="py-2">Date</th>
                                <th className="py-2">Departure</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight) => (
                                <tr key={flight.id}>
                                    <td className="border px-4 py-2">{flight.destination}</td>
                                    <td className="border px-4 py-2">{flight.airline}</td>
                                    <td className="border px-4 py-2">{flight.date}</td>
                                    <td className="border px-4 py-2">{flight.depart}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <UpdateButton onClick={() => handleUpdate(flight)} />
                                        <DeleteButton onClick={() => handleDelete(flight.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No flights available.</p>
                )}
            </div>
        </div>
    );
};

export default Flights;
