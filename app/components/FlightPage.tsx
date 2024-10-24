// pages/flight-options.js
import React from 'react';

export default function Flight() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">ALTERA TRAVELS</h1>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-yellow-400">Services</a></li>
            <li><a href="#" className="hover:text-yellow-400">News</a></li>
            <li><a href="#" className="hover:text-yellow-400">Sign In</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Flight Options - Luxor, Egypt</h2>
          <p className="text-gray-700 mb-8">Customize your travel experience as you journey to Luxor, Egypt. Choose your preferred flight class, seat, meals, and more for a comfortable and memorable trip.</p>

          {/* Class Selection */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Class Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Economy</h4>
                <p className="text-gray-600">Affordable and comfortable experience.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Business Class</h4>
                <p className="text-gray-600">Extra space and premium service.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">First Class</h4>
                <p className="text-gray-600">Ultimate luxury and gourmet meals.</p>
              </div>
            </div>
          </section>

          {/* Seat Preferences */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Seat Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Window Seat</h4>
                <p className="text-gray-600">Enjoy scenic views during your flight.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Aisle Seat</h4>
                <p className="text-gray-600">Easy access to move around during the flight.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Extra Legroom</h4>
                <p className="text-gray-600">Relax with extra space for your legs.</p>
              </div>
            </div>
          </section>

          {/* Meal Preferences */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Meal Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Standard</h4>
                <p className="text-gray-600">Enjoy traditional Egyptian-inspired meals.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Vegetarian</h4>
                <p className="text-gray-600">Fresh, healthy plant-based meals.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Vegan</h4>
                <p className="text-gray-600">Delicious vegan options prepared just for you.</p>
              </div>
            </div>
          </section>

          {/* Extra Options */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Additional Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">In-flight Wi-Fi</h4>
                <p className="text-gray-600">Stay connected throughout your flight.</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-bold">Priority Boarding</h4>
                <p className="text-gray-600">Get on board first and settle in early.</p>
              </div>
            </div>
          </section>

          {/* Destination Details */}
          <section className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Destination Details - Luxor, Egypt</h3>
            <p className="text-gray-700">
              Luxor is home to the ancient treasures of Egypt, including the famous Luxor Temple, the Valley of the Kings, and the sprawling Karnak Temple Complex. Experience breathtaking views of the Nile or take a sunset cruise to end your day in Luxor with unforgettable memories.
            </p>
          </section>

          {/* Book Button */}
          <div className="text-center">
            <a href="#" className="bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition">BOOK NOW</a>
          </div>
        </div>
      </main>
    </div>
  );
}