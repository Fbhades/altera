"use client";

import { useState, useEffect } from 'react';
import React from 'react';
import DestinationCard from './DestinationCard';

const PopularDestinations = () => {
  interface Destination {
    destination: string;
    date: string;
  }

  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/flight', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="py-12">
      <h2 className="text-4xl font-bold text-center mb-6">Explore The Most Engaging Places</h2>
      <h3 className="text-xl text-center text-yellow-300 mb-12">Our Most Popular Destinations this season</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest, index) => (
          <DestinationCard key={index} name={dest.destination} image={dest.date} />
        ))}
      </div>
    </div>
  );
};

export default PopularDestinations;