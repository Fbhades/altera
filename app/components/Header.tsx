"use client";
import React from "react";
import { useAuth, UserButton } from "@clerk/nextjs"; // Import Clerk components
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import Image from "next/image"; // Import Image from next/image

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth(); // Get authentication state
  const router = useRouter(); // Initialize useRouter

  return (
    <header className="bg-blue-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
      <Image 
          src="/images/logo.png" // Path to the image in the public folder
          alt="Logo" 
          width={300} 
          height={200} 
        />
        <nav>
          <ul className="flex space-x-6">
            {/* <li>
              <button onClick={() => router.push('/Admin')}>
                Services
              </button>
            </li>
            <li><a href="#news" className="hover:underline">News</a></li>
            <li><a href="#about" className="hover:underline">About Us</a></li> */}
            
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