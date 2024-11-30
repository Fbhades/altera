import React, { useState, useEffect } from 'react';
import { MealOption } from '../Interface/interface'; // Adjust the import path as necessary
import { DeleteButton } from "@/components/ui/delete-button"
import { UpdateButton } from "@/components/ui/update-button"

const MealOptions = () => {
    const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
    const [newMealOption, setNewMealOption] = useState<MealOption>({
        id: 0,
        snack: false,
        mealType: '',
        description: '',
        cost: 0,
    });
    const [editingMealOption, setEditingMealOption] = useState<MealOption | null>(null);

    useEffect(() => {
        const fetchMealOptions = async () => {
            try {
                const response = await fetch('/api/admin/meal'); // Adjust API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMealOptions(data);
            } catch (error) {
                console.error('Error fetching meal options:', error);
            }
        };
        fetchMealOptions();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setNewMealOption({
            ...newMealOption,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleUpdate = (mealOption: MealOption) => {
        setEditingMealOption(mealOption);
        setNewMealOption(mealOption);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/meal/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setMealOptions(mealOptions.filter(meal => meal.id !== id));
        } catch (error) {
            console.error('Error deleting meal option:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMealOption) {
            // Update existing meal option
            try {
                const response = await fetch(`/api/admin/meal/${editingMealOption.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMealOption),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedMealOption = await response.json();
                setMealOptions(mealOptions.map(meal => meal.id === updatedMealOption.id ? updatedMealOption : meal));
            } catch (error) {
                console.error('Error updating meal option:', error);
            }
        } else {
            // Create new meal option
            try {
                const response = await fetch('/api/admin/meal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newMealOption),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const createdMealOption = await response.json();
                setMealOptions([...mealOptions, createdMealOption]);
            } catch (error) {
                console.error('Error creating meal option:', error);
            }
        }

        // Reset form and editing state after submission
        setNewMealOption({
            id: 0,
            snack: false,
            mealType: '',
            description: '',
            cost: 0,
        });
        setEditingMealOption(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Meal Options</h2>

            <div className="mt-4">
                {mealOptions.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Type</th>
                                <th className="py-2">Description</th>
                                <th className="py-2">Cost</th>
                                <th className="py-2">Snack</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mealOptions.map((meal) => (
                                <tr key={meal.id}>
                                    <td className="border px-4 py-2">{meal.mealType}</td>
                                    <td className="border px-4 py-2">{meal.description}</td>
                                    <td className="border px-4 py-2">${meal.cost}</td>
                                    <td className="border px-4 py-2">{meal.snack ? 'Yes' : 'No'}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <UpdateButton onClick={() => handleUpdate(meal)} />
                                        <DeleteButton onClick={() => handleDelete(meal.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No meal options available.</p>
                )}
            </div>

            {/* Form for adding new meal option */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Add New Meal Option</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="mealType"
                        placeholder="Meal Type"
                        value={newMealOption.mealType}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newMealOption.description}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        name="cost"
                        placeholder="Cost"
                        value={newMealOption.cost}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center text-yellow-300">
                        <input
                            type="checkbox"
                            name="snack"
                            checked={newMealOption.snack}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Snack Option
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        {editingMealOption ? 'Update Meal Option' : 'Add Meal Option'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MealOptions;
