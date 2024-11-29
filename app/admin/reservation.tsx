import React, { useState, useEffect } from 'react';
import { reservation } from '../Interface/interface'; // Adjust the import path as necessary

const Reservations = () => {
    const [reservations, setReservations] = useState<reservation[]>([]);
    const [newReservation, setNewReservation] = useState<reservation>({
        id: 0,
        flightId: 0,
        userId: 0,
        price: 0,
        done: false,
    });

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('/api/admin/reservation'); // Adjust API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReservations(data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };
        fetchReservations();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setNewReservation({
            ...newReservation,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (create or update reservation)
        console.log('New reservation submitted:', newReservation);
        
        // Reset form after submission
        setNewReservation({
            id: 0,
            flightId: 0,
            userId: 0,
            price: 0,
            done: false,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Reservations</h2>
            
            <div className="mt-4">
                {reservations.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {reservations.map((reservation) => (
                            <li key={reservation.id} className="mb-2">
                                <strong className="text-yellow-300">Reservation ID:</strong> {reservation.id} - 
                                <strong className="text-yellow-300"> Flight ID:</strong> {reservation.flightId} - 
                                <strong className="text-yellow-300"> User ID:</strong> {reservation.userId} - 
                                <strong className="text-yellow-300"> Price:</strong> ${reservation.price.toFixed(2)} - 
                                <strong className="text-yellow-300"> Status:</strong> {reservation.done ? 'Completed' : 'Pending'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reservations available.</p>
                )}
            </div>

            {/* Form for adding new reservation */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Add New Reservation</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        name="flightId"
                        placeholder="Flight ID"
                        value={newReservation.flightId}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="userId"
                        placeholder="User ID"
                        value={newReservation.userId}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newReservation.price}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center text-yellow-300">
                        <input
                            type="checkbox"
                            name="done"
                            checked={newReservation.done}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Completed
                    </label>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add Reservation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reservations;