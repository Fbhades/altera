import React, { useState, useEffect } from 'react';
import { user } from '../Interface/interface'; // Adjust the import path as necessary

const Users = () => {
    const [users, setUsers] = useState<user[]>([]);
    const [newUser, setNewUser] = useState<user>({
        id: 0,
        name: '',
        email: '',
        role: false,
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission (create or update user)
        console.log('New user submitted:', newUser);
        
        // Reset form after submission
        setNewUser({
            id: 0,
            name: '',
            email: '',
            role: false,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Users</h2>
            
            <div className="mt-4">
                {users.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {users.map((user) => (
                            <li key={user.id} className="mb-2">
                                <strong className="text-yellow-300">Name:</strong> {user.name} - 
                                <strong className="text-yellow-300"> Email:</strong> {user.email} - 
                                <strong className="text-yellow-300"> Role:</strong> {user.role ? 'Admin' : 'User'}
                            </li>
                        ))}
                    </ul>
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
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Users;