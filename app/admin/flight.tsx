import React, { useState, useEffect } from 'react';
import { Flight } from '../Interface/interface'; // Adjust the import path as necessary
import { DeleteButton } from "@/components/ui/delete-button"
import { UpdateButton } from "@/components/ui/update-button"
import { useToast } from "@/components/ui/useToast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const Flights = () => {
    const { toast } = useToast();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [newFlight, setNewFlight] = useState<Flight>({
        id: 0,
        destination: '',
        depart: '',
        airline: '',
        date: '',
    });
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        // Validate the departure date
        if (name === 'date') {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                toast({
                    variant: "destructive",
                    title: "Invalid Date",
                    description: "Departure date cannot be earlier than today's date.",
                });
                return;
            }
        }

        // Validate departure time format (HH:mm)
        if (name === 'depart') {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(value) && value !== '') {
                toast({
                    variant: "destructive",
                    title: "Invalid Time Format",
                    description: "Please enter time in 24-hour format (e.g., 14:30)",
                });
                return;
            }
        }

        // Validate destination and airline (no numbers allowed)
        if ((name === 'destination' || name === 'airline') && /\d/.test(value)) {
            toast({
                variant: "destructive",
                title: "Invalid Input",
                description: `${name.charAt(0).toUpperCase() + name.slice(1)} cannot contain numbers.`,
            });
            return;
        }

        setNewFlight(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = (flight: Flight) => {
        setEditingFlight(flight);
        setNewFlight(flight);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewFlight({
            id: 0,
            destination: '',
            depart: '',
            airline: '',
            date: '',
        });
        setEditingFlight(null);
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
                toast({
                    title: "Success",
                    description: "Flight updated successfully!",
                });
                handleModalClose();
            } catch (error) {
                console.error('Error updating flight:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update flight. Please try again.",
                });
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
                toast({
                    title: "Success",
                    description: "New flight added successfully!",
                });
                handleModalClose();
            } catch (error) {
                console.error('Error creating flight:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create flight. Please try again.",
                });
            }
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-yellow-300">Manage Flights</h2>
                    <button
                        onClick={() => {
                            setEditingFlight(null);
                            setNewFlight({
                                id: 0,
                                destination: '',
                                depart: '',
                                airline: '',
                                date: '',
                            });
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add New Flight
                    </button>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                            <DialogTitle>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            handleModalClose();
                        }} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label htmlFor="destination" className="text-sm font-medium">Destination</label>
                                <input
                                    id="destination"
                                    type="text"
                                    name="destination"
                                    value={newFlight.destination}
                                    onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="airline" className="text-sm font-medium">Airline</label>
                                <input
                                    id="airline"
                                    type="text"
                                    name="airline"
                                    value={newFlight.airline}
                                    onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="date" className="text-sm font-medium">Date</label>
                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={newFlight.date}
                                    onChange={(e) => setNewFlight({ ...newFlight, date: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="depart" className="text-sm font-medium">Departure Time</label>
                                <input
                                    id="depart"
                                    type="text"
                                    name="depart"
                                    placeholder="14:30"
                                    value={newFlight.depart}
                                    onChange={(e) => setNewFlight({ ...newFlight, depart: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingFlight ? 'Update Flight' : 'Add Flight'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <h3 className="text-xl font-semibold p-4 bg-gray-50 text-gray-700 border-b">Existing Flights</h3>
                    {flights.length > 0 ? (
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Destination
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Airline
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Departure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {flights.map((flight) => (
                                    <tr key={flight.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {flight.destination}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {flight.airline}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {flight.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {flight.depart}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            <UpdateButton onClick={() => handleUpdate(flight)} />
                                            <DeleteButton onClick={() => handleDelete(flight.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-gray-500 text-center">No flights available.</p>
                    )}
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default Flights;
