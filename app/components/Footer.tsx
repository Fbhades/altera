// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-2xl"><i className="fab fa-facebook"></i></a>
          <a href="#" className="text-2xl"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-2xl"><i className="fab fa-snapchat"></i></a>
        </div>
        <p>© 2024 Alterra Travels</p>
      </div>
    </footer>
  );
};

export default Footer;
