import React, { useState, useEffect } from 'react';
import { MealOption } from '../Interface/interface'; // Adjust the import path as necessary

const MealOptions = () => {
    const [mealOptions, setMealOptions] = useState<MealOption[]>([]);
    const [newMealOption, setNewMealOption] = useState<MealOption>({
        id: 0,
        snack: false,
        mealType: '',
        description: '',
        cost: 0,
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (create or update meal option)
        console.log('New meal option submitted:', newMealOption);
        
        // Reset form after submission
        setNewMealOption({
            id: 0,
            snack: false,
            mealType: '',
            description: '',
            cost: 0,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Meal Options</h2>
            
            <div className="mt-4">
                {mealOptions.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {mealOptions.map((meal) => (
                            <li key={meal.id} className="mb-2">
                                <strong className="text-yellow-300">Type:</strong> {meal.mealType} - 
                                <strong className="text-yellow-300"> Description:</strong> {meal.description} - 
                                <strong className="text-yellow-300"> Cost:</strong> ${meal.cost} - 
                                <strong className="text-yellow-300"> Snack:</strong> {meal.snack ? 'Yes' : 'No'}
                            </li>
                        ))}
                    </ul>
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
                        Add Meal Option
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MealOptions;