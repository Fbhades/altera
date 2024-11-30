import React, { useState, useEffect } from 'react';
import { user } from '../Interface/interface'; // Adjust the import path as necessary
import { DeleteButton } from "@/components/ui/delete-button"
import { UpdateButton } from "@/components/ui/update-button"

const Users = () => {
    const [users, setUsers] = useState<user[]>([]);
    const [newUser, setNewUser] = useState<user>({
        id: 0,
        name: '',
        email: '',
        role: false,
    });
    const [editingUser, setEditingUser] = useState<user | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/user'); // Adjust API endpoint as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

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
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/admin/user/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Update existing user
            try {
                const response = await fetch(`/api/admin/user/${editingUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedUser = await response.json();
                setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            // Create new user
            try {
                const response = await fetch('/api/admin/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const createdUser = await response.json();
                setUsers([...users, createdUser]);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }

        // Reset form and editing state after submission
        setNewUser({
            id: 0,
            name: '',
            email: '',
            role: false,
        });
        setEditingUser(null);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Users</h2>
            
            <div className="mt-4">
                {users.length > 0 ? (
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="py-2">{user.name}</td>
                                    <td className="py-2">{user.email}</td>
                                    <td className="py-2">{user.role ? 'Admin' : 'User'}</td>
                                    <td className="py-2 space-x-2">
                                        <UpdateButton onClick={() => handleUpdate(user)} />
                                        <DeleteButton onClick={() => handleDelete(user.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users available.</p>
                )}
            </div>

            {/* Form for adding new user */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2 text-yellow-300">Add New User</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center text-yellow-300">
                        <input
                            type="checkbox"
                            name="role"
                            checked={newUser.role}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Admin Role
                    </label>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        {editingUser ? 'Update User' : 'Add User'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Users;
