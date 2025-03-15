"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TruckerDashboard() {
  const [loads, setLoads] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchLoads(storedToken);
    }
  }, []);

  const fetchLoads = async (authToken) => {
    try {
      const response = await axios.get("/api/load/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLoads(response.data.loads);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  const updateLocation = async (loadId) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        await axios.post(
          "/api/tracker/update",
          { loadid:loadId, latitude, longitude },
          {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          }
        );
        alert("Location updated successfully!");
        fetchLoads(token);
      } catch (error) {
        console.error("Error updating location:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Trucker Dashboard</h1>

      {loads.length === 0 ? (
        <p>No assigned loads.</p>
      ) : (
        <ul className="w-full max-w-3xl">
          {loads.map((load) => (
            <li key={load._id} className="p-4 border rounded-lg shadow-md bg-white mb-2">
              <p><strong>Pickup:</strong> {load.pickuplocation}</p>
              <p><strong>Drop-off:</strong> {load.dropofflocation}</p>
              <p><strong>Weight:</strong> {load.weight} kg</p>
              <p><strong>Status:</strong> {load.status}</p>

              <button
                onClick={() => updateLocation(load._id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update Location
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
