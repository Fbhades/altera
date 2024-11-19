// Dashboard.js
import React from 'react';

const Dashboard = () => {
  // Sample data - replace with actual data fetching logic
  const userCount = 120; // Example user count
  const flightCount = 45; // Example flight count
  const reservationCount = 200; // Example reservation count

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-blue-100">
          <h3 className="font-semibold">Users</h3>
          <p>{userCount}</p>
        </div>
        <div className="p-4 border rounded bg-green-100">
          <h3 className="font-semibold">Flights</h3>
          <p>{flightCount}</p>
        </div>
        <div className="p-4 border rounded bg-yellow-100">
          <h3 className="font-semibold">Reservations</h3>
          <p>{reservationCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;