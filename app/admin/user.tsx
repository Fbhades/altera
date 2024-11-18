import React, { useState, useEffect } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Manage Users</h2>
            {/* Add your CRUD functionalities here */}
        </div>
    );
};

export default Users;