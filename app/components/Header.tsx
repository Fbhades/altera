"use client";
import React from "react";
import { useAuth, UserButton } from "@clerk/nextjs"; // Import Clerk components
import Link from "next/link";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth(); // Get authentication state

  return (
    <header className="bg-blue-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          ALTERRA <span className="text-2xl font-bold text-yellow-500">TRAVELS</span>
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#services" className="hover:underline">Services</a></li>
            <li><a href="#news" className="hover:underline">News</a></li>
            <li><a href="#about" className="hover:underline">About Us</a></li>
            
            {isLoaded && isSignedIn ? (
              // Show Sign Out and profile button if user is signed in
              <>
                <li><UserButton /></li> 
              </>
            ) : (
              // Show Sign In button if user is not signed in
              <li>
                <Link href="/sign-in">
                  <button className="bg-blue-500 hover:bg-blue-600 p-3 rounded-md text-white my-2">Sign In</button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
