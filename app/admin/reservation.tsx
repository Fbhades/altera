import React, { useState, useEffect } from 'react';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const response = await fetch('/api/reservations');
            const data = await response.json();
            setReservations(data);
        };
        fetchReservations();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Manage Reservations</h2>
            {/* Add your CRUD functionalities here */}
        </div>
    );
};

export default Reservations;