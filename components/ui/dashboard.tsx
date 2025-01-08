import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    users: 0,
    flights: 0,
    reservations: 0,
    flightData: [],
    reservationsByMonth: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [usersRes, flightsRes, reservationsRes] = await Promise.all([
          fetch('/api/admin/user'),
          fetch('/api/flight'),
          fetch('/api/admin/resevation')
        ]);

        const users = await usersRes.json();
        const flights = await flightsRes.json();
        const reservations = await reservationsRes.json();

        // Process reservation data by month
        const reservationsByMonth = reservations.reduce((acc, res) => {
          const month = new Date(res.date).getMonth();
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        setStats({
          users: users.length,
          flights: flights.length,
          reservations: reservations.length,
          flightData: flights,
          reservationsByMonth
        });

      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  const reservationChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Reservations per Month',
      data: Object.values(stats.reservationsByMonth),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
    }]
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Active Flights</h3>
          <p className="text-3xl font-bold text-green-600">{stats.flights}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Total Reservations</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.reservations}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Reservations Over Time</h3>
          <Line 
            data={reservationChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Reservations'
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Flight Distribution</h3>
          <Bar
            data={{
              labels: ['Economy', 'Business'],
              datasets: [{
                label: 'Flights by Class',
                data: [
                  stats.flightData.filter(f => f.economy_price).length,
                  stats.flightData.filter(f => f.business_price).length
                ],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;