"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Bidsview() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const fetchBids = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await axios.get("/api/bid/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setBids(response.data.bids);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBidStatus = async (bidid, status) => {
    try {
      const storedToken = localStorage.getItem("token");
      await axios.post(
        "/api/bid/update",
        { bidid, status },
        {
          headers: { Authorization: `Bearer ${storedToken}`, "Content-Type": "application/json" },
        }
      );
      alert(`Bid ${status} successfully!`);
      fetchBids(storedToken);
    } catch (error) {
      console.error("Error updating bid status:", error);
    }
  };

  const acceptLowestBid = async (loadid) => {
    try {
      const storedToken = localStorage.getItem("token");

      const lowestBid = bids
        .filter((bid) => bid.loadid === loadid && bid.status === "pending")
        .sort((a, b) => a.bidamount - b.bidamount)[0];

      if (!lowestBid) {
        alert("No pending bids available for this load.");
        return;
      }

      await axios.post(
        "/api/bid/update",
        { bidid: lowestBid._id, status: "accepted" },
        {
          headers: { Authorization: `Bearer ${storedToken}`, "Content-Type": "application/json" },
        }
      );
      alert("Lowest bid accepted successfully!");
      fetchBids(storedToken);
    } catch (error) {
      console.error("Error accepting lowest bid:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchBids(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.loadid]) acc[bid.loadid] = [];
    acc[bid.loadid].push(bid);
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Bids on Your Loads
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading bids...</p>
        ) : Object.keys(groupedBids).length === 0 ? (
          <p className="text-center text-gray-500">No bids placed yet.</p>
        ) : (
          Object.entries(groupedBids).map(([loadid, loadBids]) => (
            <div key={loadid} className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">Load ID: {loadid}</h2>
              
              <ul>
                {loadBids.map((bidItem) => (
                  <li key={bidItem._id} className="p-3 border-b border-gray-200">
                    <p><strong>Bid Amount:</strong> ${bidItem.bidamount}</p>
                    <p><strong>Trucker:</strong> {bidItem.truckersid?.name} ({bidItem.truckersid?.email})</p>
                    <p><strong>Status:</strong> {bidItem.status}</p>

                    {bidItem.status === "pending" && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => updateBidStatus(bidItem._id, "accepted")}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateBidStatus(bidItem._id, "rejected")}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => acceptLowestBid(loadid)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
              >
                Accept Lowest Bid for This Load
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
