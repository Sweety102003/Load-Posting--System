"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TruckerLocation({ loadid }) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const storedToken = localStorage.getItem("token");
          const response = await axios.post(
            "/api/tracker/update",
            { loadid, latitude, longitude },
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          alert("Location updated successfully!");
        } catch (error) {
          console.error("Error updating location:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Update Your Location</h2>
      <button
        onClick={updateLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Location"}
      </button>
      {location.latitude && (
        <p className="mt-2 text-gray-600">
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </div>
  );
}
