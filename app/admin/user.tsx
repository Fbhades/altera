import React, { useState, useEffect } from 'react';
import { user } from '../Interface/interface';
import { DeleteButton } from "@/components/ui/delete-button";
import { UpdateButton } from "@/components/ui/update-button";
import { useToast } from "@/components/ui/useToast";
import { Toaster } from "@/components/ui/toaster";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Users = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<user[]>([]);
    const [editingUser, setEditingUser] = useState<user | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<user>({
        id: 0,
        name: '',
        email: '',
        role: false,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/user');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch users",
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setNewUser({
            ...newUser,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleUpdate = (user: user) => {
        setEditingUser(user);
        setNewUser(user);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewUser({
            id: 0,
            name: '',
            email: '',
            role: false,
        });
        setEditingUser(null);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/user/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Network response was not ok');
            setUsers(users.filter(user => user.id !== id));
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete user",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const response = await fetch(`/api/admin/user/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const updatedUser = await response.json();
                setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
                toast({
                    title: "Success",
                    description: "User updated successfully",
                });
            }
            handleModalClose();
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update user",
            });
        }
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-yellow-300">Manage Users</h2>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="role"
                                    type="checkbox"
                                    name="role"
                                    checked={newUser.role}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="role" className="text-sm font-medium">
                                    Admin Role
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
                                    Update User
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 shadow-md">
                    <h3 className="text-xl font-semibold p-4 bg-gray-50 text-gray-700 border-b">
                        Existing Users
                    </h3>
                    {users.length > 0 ? (
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {user.role ? 'Admin' : 'User'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                            <UpdateButton onClick={() => handleUpdate(user)} />
                                            <DeleteButton onClick={() => handleDelete(user.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-gray-500 text-center">No users available.</p>
                    )}
                </div>
            </div>
            <Toaster />
        </>
    );
};

export default Users;
