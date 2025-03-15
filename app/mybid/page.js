"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const response = await axios.get("/api/bid/mybid", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setBids(response.data.bids);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">My Bids</h1>
      {loading ? <p>Loading...</p> : (
        <ul className="w-full max-w-3xl bg-white p-6 shadow-md rounded-md">
          {bids.map((bid) => (
            <li key={bid._id} className="border-b p-4">
              <p><strong>Load:</strong> {bid.loadid.pickuplocation} → {bid.loadid.dropofflocation}</p>
              <p><strong>Bid Amount:</strong> ${bid.bidamount}</p>
              <p><strong>Status:</strong> {bid.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
