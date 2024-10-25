"use client";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Hero from "@/app/components/Hero";
import PopularDestinations from "@/app/components/PopularDestinations";
import Footer from "@/app/components/Footer";

export default function Home() {
  const { userId } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    const handleCreateUser = async () => {
      try {
        if (!isLoaded || !isSignedIn || !user) return;

        const email = user?.emailAddresses[0].toString();
        const name = user?.fullName?.toString();

        // If user does not exist, create the user
        const createResponse = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, role: false }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create user");
        }

        const data = await createResponse.json();
        console.log("User created:", data);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    if (userId) {
      handleCreateUser();
    }
    console.log(userId);
  }, [user]);

  return (
    <div className="App">
      <Hero />
      <PopularDestinations />
      <Footer />
    </div>
  );
}
