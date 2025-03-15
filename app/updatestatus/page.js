"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UpdateLoad() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get("/api/bid/mybid", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setLoads(response.data.bids.map(bid => bid.loadid));
      } catch (error) {
        console.error("Error fetching loads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoads();
  }, []);

  const updateStatus = async (loadid, status) => {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.post(
        "/api/load/updatestatus",
        { loadid, status },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      alert(`Load status updated to ${status}`);
      
    } catch (error) {
      console.error("Error updating load status:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Update Load Status</h1>
      {loading ? <p>Loading...</p> : (
        <ul className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md">
          {loads.map((load) => (
            <li key={load._id} className="border-b p-4">
              <p><strong>Load:</strong> {load.pickuplocation} → {load.dropofflocation}</p>
              <p><strong>Status:</strong> {load.status}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => updateStatus(load._id, "Picked Up")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Picked Up
                </button>
                <button
                  onClick={() => updateStatus(load._id, "In Transit")}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  In Transit
                </button>
                <button
                  onClick={() => updateStatus(load._id, "Delivered")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Delivered
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
