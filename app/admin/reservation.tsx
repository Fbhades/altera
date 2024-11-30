import React, { useState, useEffect } from 'react';
import { reservation } from '../Interface/interface'; // Adjust the import path as necessary
import { DeleteButton } from "@/components/ui/delete-button"
import { UpdateButton } from "@/components/ui/update-button"

const Reservations = () => {
    const [reservations, setReservations] = useState<reservation[]>([]);
    const [newReservation, setNewReservation] = useState<reservation>({
        id: 0,
        flightid: 0,
        userid: 0,
        mealid: 0,
        price: 0,
        done: false,
    });
    const [editingReservation, setEditingReservation] = useState<reservation | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch('/api/admin/resevation'); // Adjust API endpoint as necessary
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

    const handleUpdate = (reservation: reservation) => {
        setEditingReservation(reservation);
        setNewReservation(reservation);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/resevation/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setReservations(reservations.filter(reservation => reservation.id !== id));
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingReservation) {
            // Update existing reservation
            try {
                const response = await fetch(`/api/admin/resevation/${editingReservation.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newReservation),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedReservation = await response.json();
                setReservations(reservations.map(reservation => 
                    reservation.id === updatedReservation.id ? updatedReservation : reservation
                ));
            } catch (error) {
                console.error('Error updating reservation:', error);
            }
        } else {
            // Create new reservation
            try {
                const response = await fetch('/api/admin/resevation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newReservation),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const createdReservation = await response.json();
                setReservations([...reservations, createdReservation]);
            } catch (error) {
                console.error('Error creating reservation:', error);
            }
        }
        
        // Reset form and editing state after submission
        setNewReservation({
            id: 0,
            flightid: 0,
            userid: 0,
            mealid: 0,
            price: 0,
            done: false,
        });
        setEditingReservation(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Reservations</h2>
            
            <div className="mt-4">
                {reservations.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Reservation ID</th>
                                <th className="py-2">Flight ID</th>
                                <th className="py-2">Meal ID</th>
                                <th className="py-2">User ID</th>
                                <th className="py-2">Price</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id} className="border-t">
                                    <td className="py-2">{reservation.id}</td>
                                    <td className="py-2">{reservation.flightid}</td>
                                    <td className="py-2">{reservation.mealid}</td>
                                    <td className="py-2">{reservation.userid}</td>
                                    <td className="py-2">${reservation.price}</td>
                                    <td className="py-2">{reservation.done ? 'Completed' : 'Pending'}</td>
                                    <td className="py-2 space-x-2">
                                        <UpdateButton onClick={() => handleUpdate(reservation)} />
                                        <DeleteButton onClick={() => handleDelete(reservation.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                        value={newReservation.flightid}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                     <input
                        type="number"
                        name="mealId"
                        placeholder="User ID"
                        value={newReservation.mealid}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="userId"
                        placeholder="User ID"
                        value={newReservation.userid}
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
                        {editingReservation ? 'Update Reservation' : 'Add Reservation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reservations;
