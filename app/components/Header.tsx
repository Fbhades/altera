'use client';

import React, { useEffect, useState } from "react";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isSignedIn && user) {
        try {
          const primaryEmail = user.primaryEmailAddress?.emailAddress;
          console.log("Primary email:", primaryEmail);
          if (primaryEmail) {
            const response = await fetch(`/api/auth/${encodeURIComponent(primaryEmail)}`);
            if (response.ok) {
              const data = await response.json();
              console.log("Admin status data:", data.role);
              setIsAdmin(data.role === true);
              console.log("Admin status:", data.role);
            } else {
              console.error("Error fetching admin status:", response.statusText);
            }
          } else {
            console.error("No primary email found for user");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    checkAdminStatus();
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-blue-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image 
            src="/images/logo.png"
            alt="Logo" 
            width={300} 
            height={200} 
          />
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {isSignedIn ? (
              <li className="flex items-center space-x-4">
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <UserButton afterSignOutUrl="/" />
              </li>
            ) : (
              <li>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">Sign In</Button>
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
