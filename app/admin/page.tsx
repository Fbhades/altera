"use client";
import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import Flights from "./flight";
import Reservations from "./reservation";
import Users from "./user";
import Meals from "./meal";
import Dashboard from "@/components/ui/dashboard"; // Import the new Dashboard component

export default function Admin() {
  const [currentView, setCurrentView] = useState("dashboard"); // Set initial view to dashboard

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 flex justify-center">Admin Panel</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          onClick={() => setCurrentView("dashboard")}
          className={`${
            currentView === "dashboard" ? "opacity-100" : "opacity-50"
          }`}
          variant="outline"
        >
          Dashboard
        </Button>
        <Button
          onClick={() => setCurrentView("flights")}
          className={`${
            currentView === "flights" ? "opacity-100" : "opacity-50"
          }`}
          variant="outline"
        >
          Flights
        </Button>
        <Button
          onClick={() => setCurrentView("reservations")}
          className={`${
            currentView === "reservations" ? "opacity-100" : "opacity-50"
          }`}
          variant="outline"
        >
          Reservations
        </Button>
        <Button
          onClick={() => setCurrentView("users")}
          className={`${
            currentView === "users" ? "opacity-100" : "opacity-50"
          }`}
          variant="outline"
        >
          Users
        </Button>
        <Button
          onClick={() => setCurrentView("meals")}
          className={`${
            currentView === "meals" ? "opacity-100" : "opacity-50"
          }`}
          variant="outline"
        >
          Meals
        </Button>
      </div>
      <div className="my-4">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "flights" && <Flights />}
        {currentView === "reservations" && <Reservations />}
        {currentView === "users" && <Users />}
        {currentView === "meals" && <Meals />}
      </div>
    </div>
  );
}