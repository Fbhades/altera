// components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">ALTERRA <span className="text-2xl font-bold text-yellow-500">TRAVELS</span></h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="#news" className="hover:underline">News</a></li>
            <li><a href="#about" className="hover:underline">About Us</a></li>
            <li><a href="#signin" className="hover:underline">Sign In</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
