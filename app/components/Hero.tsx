"use client"
import React, { useState, useEffect } from 'react';
import { searchFlight } from '../Interface/interface';
import Link from "next/link"
import { useRouter } from "next/navigation";


const Hero = () => {
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [flightClass, setFlightClass] = useState('economy');
  const [flights, setFlights] = useState<searchFlight[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/search?destination=${destination}&class=${flightClass}&price=${price}`);
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        setFlights(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching flights. Please try again.');
      }
    };

    if (destination) {
      fetchData();
    }
  }, [destination, price, flightClass]);

  return (
    <div className="bg-[url('https://s3-alpha-sig.figma.com/img/2d12/f49d/69c185423bd46e4478a5ae7711c29fa5?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QKxN8qEhG1Nho1XjpwYJU2wvC3X8fB47Q9Sar6pJDPTSY~2E35q6HXd266ujYCPbj5w2XP-nYpkXfXqgWxIs2dhjhC0AJ~~9LBhz0bCXugc0QzJd3QjODh6LozqYzoaS1jwcGWgqQDDOLqgfbtzQNx4p8jc1SjJuA~QTSeESPP6FxD~58ptlNwG4DJKuaxo7i3T1g2ukkjhOW4SSuamiiEfE65OYwI917HhuBTtU-wm~dVGmFhkpC8CTGtoFAnUtVFV6fL1QDougHJBrZCqJeD5r-hMnzUYLNfkLfGYZBu2hjvNz1HOqXK5YTVB2mSvnjOJifkS~XoybBVfky~4Ltg__')] bg-cover bg-center text-center py-20 text-white">
      <h1 className="text-5xl mb-8">DISCOVER THE</h1>
      <h1 className="text-6xl font-bold mb-8">EXTRAORDINARY</h1>

      <div className="flex justify-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-4 rounded-full text-black placeholder-gray-500 border border-gray-300"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-4 rounded-full text-black placeholder-gray-500 border border-gray-300"
        />
        <select
          value={flightClass}
          onChange={(e) => setFlightClass(e.target.value)}
          className="p-4 rounded-full text-black border border-gray-300"
        >
          <option value="economy">Economy</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div className="mt-8">
        {flights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mx-4">
            {flights.map((flight) => (
              <article key={flight.flight_id} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <img
                  alt=""
                  src= "https://assets.editorial.aetnd.com/uploads/2019/03/topic-london-gettyimages-760251843-feature.jpg?width=1920&height=960&crop=1920%3A960%2Csmart&quality=75&auto=webp" // Use a default image if none is provided"
                  className="h-56 w-full object-cover"
                />

                <div className="p-4 sm:p-6">
                  <a href="#">
                    <h3 className="text-lg font-medium text-gray-900">{flight.airline}</h3>
                  </a>

                  <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                    Destination: {flight.destination}<br />
                    Date: {flight.date}<br />
                    Price: {flight.flight_price}$
                  </p>

                  <span className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                  <button onClick={() => router.push('/flightpage/' + flight.flight_id)}>
                    Find out more
                  </button>
                    <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
                      &rarr;
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{error || 'No flights found.'}</p>
        )}
      </div>
    </div>
  );
};

export default Hero;