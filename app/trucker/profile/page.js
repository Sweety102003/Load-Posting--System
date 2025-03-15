"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TruckerProfile() {
  const [trucker, setTrucker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("/api/truckereligibility", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setTrucker(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Trucker Profile
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : trucker ? (
          <div>
            <p><strong>Name:</strong> {trucker.name}</p>
            <p><strong>Email:</strong> {trucker.email}</p>
            <p><strong>Accidents:</strong> {trucker.accidents}</p>
            <p><strong>Theft Complaints:</strong> {trucker.theftcomplaints}</p>
            <p><strong>Truck Age:</strong> {trucker.truckage} years</p>
            <p><strong>License Held For:</strong> {trucker.licenseheldYears} years</p>

            <p className={`mt-4 p-2 text-center rounded-md ${trucker.iseligible ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
              {trucker.iseligible ? "Eligible to Place Bids" : " Not Eligible to Place Bids"}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Profile not found.</p>
        )}
      </div>
    </div>
  );
}
