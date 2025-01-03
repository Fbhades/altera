import React, { useState, useEffect } from 'react';
import { DeleteButton } from "@/components/ui/delete-button";
import { UpdateButton } from "@/components/ui/update-button";
import { useToast } from "@/components/ui/useToast";
import { Toaster } from "@/components/ui/toaster";
import { MealOption } from '../Interface/interface';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Meals = () => {
    const { toast } = useToast();
    const [meals, setMeals] = useState<MealOption[]>([]);
    const [newMeal, setNewMeal] = useState<MealOption>({
        id: 0,
        snack: false,
        meal_type: '',
        cost: 0,
        description: '',
    });
    const [editingMeal, setEditingMeal] = useState<MealOption | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const response = await fetch('/api/admin/meal');
            if (!response.ok) throw new Error('Failed to fetch meals');
            const data = await response.json();
            setMeals(data);
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch meals",
            });
        }
    };

    const handleUpdate = (meal: MealOption) => {
        setEditingMeal(meal);
        setNewMeal(meal);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/meal/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete meal');
            setMeals(meals.filter(meal => meal.id !== id));
            toast({
                title: "Success",
                description: "Meal deleted successfully!",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete meal",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMeal) {
                // Update existing meal
                const response = await fetch(`/api/admin/meal/${editingMeal.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMeal),
                });
                if (!response.ok) throw new Error('Failed to update meal');
                const updatedMeal = await response.json();
                setMeals(meals.map(meal => 
                    meal.id === updatedMeal.id ? updatedMeal : meal
                ));
                toast({
                    title: "Success",
                    description: "Meal updated successfully!",
                });
            } else {
                // Create new meal
                const response = await fetch('/api/admin/meal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMeal),
                });
                if (!response.ok) throw new Error('Failed to add meal');
                const data = await response.json();
                setMeals([...meals, data]);
                toast({
                    title: "Success",
                    description: "Meal added successfully!",
                });
            }

            // Reset form
            setNewMeal({
                id: 0,
                snack: false,
                meal_type: '',
                cost: 0,
                description: '',
            });
            setEditingMeal(null);
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to ${editingMeal ? 'update' : 'add'} meal`,
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
        const { name, value } = e.target;
        setMeals(meals.map(meal => {
            if (meal.id === id) {
                return {
                    ...meal,
                    [name]: name === 'cost' ? Number(value) : 
                           name === 'snack' ? value === 'true' : 
                           value
                };
            }
            return meal;
        }));
    };

    const handleSaveUpdate = async (meal: MealOption) => {
        try {
            const response = await fetch(`/api/admin/meal/${meal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meal),
            });
            if (!response.ok) throw new Error('Failed to update meal');
            
            setEditingMeal(null);
            toast({
                title: "Success",
                description: "Meal updated successfully!",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update meal",
            });
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewMeal({
            id: 0,
            snack: false,
            meal_type: '',
            cost: 0,
            description: '',
        });
        setEditingMeal(null);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-yellow-300">Manage Meals</h2>
                    <button
                        onClick={() => {
                            setNewMeal({
                                id: 0,
                                snack: false,
                                meal_type: '',
                                cost: 0,
                                description: '',
                            });
                            setEditingMeal(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Add New Meal
                    </button>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[450px] bg-white rounded-lg shadow-lg z-[100]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                                {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            handleModalClose();
                        }} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label htmlFor="meal_type" className="text-sm font-medium">Meal Type</label>
                                <input
                                    id="meal_type"
                                    type="text"
                                    name="meal_type"
                                    value={newMeal.meal_type}
                                    onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={newMeal.description}
                                    onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cost" className="text-sm font-medium">Cost</label>
                                <input
                                    id="cost"
                                    type="number"
                                    name="cost"
                                    value={newMeal.cost}
                                    onChange={(e) => setNewMeal({ ...newMeal, cost: Number(e.target.value) })}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="snack"
                                    type="checkbox"
                                    name="snack"
                                    checked={newMeal.snack}
                                    onChange={(e) => setNewMeal({ ...newMeal, snack: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="snack" className="text-sm font-medium">
                                    Is Snack
                                </label>
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
                                    {editingMeal ? 'Update Meal' : 'Add Meal'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <h3 className="text-xl font-semibold p-4 bg-gray-50 text-gray-700 border-b">Existing Meals</h3>
                    {meals.length > 0 ? (
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Meal Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Snack
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cost
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {meals.map((meal) => (
                                    <tr key={meal.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingMeal?.id === meal.id ? (
                                                <input
                                                    type="text"
                                                    name="meal_type"
                                                    value={meal.meal_type}
                                                    onChange={(e) => handleInputChange(e, meal.id)}
                                                    className="w-full p-1 border rounded"
                                                />
                                            ) : (
                                                meal.meal_type
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingMeal?.id === meal.id ? (
                                                <input
                                                    type="text"
                                                    name="description"
                                                    value={meal.description}
                                                    onChange={(e) => handleInputChange(e, meal.id)}
                                                    className="w-full p-1 border rounded"
                                                />
                                            ) : (
                                                meal.description
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingMeal?.id === meal.id ? (
                                                <select
                                                    name="snack"
                                                    value={meal.snack.toString()}
                                                    onChange={(e) => handleInputChange(e, meal.id)}
                                                    className="w-full p-1 border rounded"
                                                >
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </select>
                                            ) : (
                                                meal.snack ? 'Yes' : 'No'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingMeal?.id === meal.id ? (
                                                <input
                                                    type="number"
                                                    name="cost"
                                                    value={meal.cost}
                                                    onChange={(e) => handleInputChange(e, meal.id)}
                                                    className="w-full p-1 border rounded"
                                                />
                                            ) : (
                                                meal.cost
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            <UpdateButton onClick={() => handleUpdate(meal)} />
                                            <DeleteButton onClick={() => handleDelete(meal.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-gray-500 text-center">No meals available.</p>
                    )}
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default Meals;