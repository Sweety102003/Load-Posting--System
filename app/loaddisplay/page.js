"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Loaddisplay() {
  const [loads, setLoads] = useState([]); 
  const [token, setToken] = useState(""); 
  const [bidAmounts, setBidAmounts] = useState({}); 
  const [filters, setFilters] = useState({
    pickuplocation: "",
    dropofflocation: "",
    maxTime: "",
  });

  const getLoads = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("Please log in.");
        return;
      }
      setToken(storedToken);

      const isFiltered = filters.pickuplocation || filters.dropofflocation || filters.maxTime;

      let queryParams = "";
      if (isFiltered) {
        queryParams = new URLSearchParams(filters).toString();
      }

      
      const response = await axios.get(`/api/load/get?${queryParams}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setLoads(response.data.loads);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };


  const postBid = async (loadId) => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        alert("Please log in to place a bid.");
        return;
      }

      const response = await axios.post(
        "/api/bid/post",
        {
          loadid: loadId,
          bidamount: bidAmounts[loadId] || 0,
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid.");
    }
  };

  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getLoads(); 
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Available Loads
        </h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Pickup Location"
            className="border p-2 rounded w-full sm:w-auto"
            value={filters.pickuplocation}
            onChange={(e) =>
              setFilters({ ...filters, pickuplocation: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Drop-off Location"
            className="border p-2 rounded w-full sm:w-auto"
            value={filters.dropofflocation}
            onChange={(e) =>
              setFilters({ ...filters, dropofflocation: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max Time (hrs)"
            className="border p-2 rounded w-full sm:w-auto"
            value={filters.maxTime}
            onChange={(e) =>
              setFilters({ ...filters, maxTime: e.target.value })
            }
          />
          <button
            onClick={getLoads} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
        </div>

        {loads.length === 0 ? (
          <p className="text-center text-gray-500">No loads match your criteria.</p>
        ) : (
          <ul>
            {loads.map((load) => (
              <li key={load._id} className="p-4 border-b border-gray-200">
                <p><strong>Pickup:</strong> {load.pickuplocation}</p>
                <p><strong>Drop-off:</strong> {load.dropofflocation}</p>
                <p><strong>Weight:</strong> {load.weight} kg</p>
                <p><strong>Description:</strong> {load.description} </p>
                <p><strong>Max Time:</strong> {load.maxTime ? `${load.maxTime} hours` : "Not specified"}</p>
                <input
                  type="number"
                  className="border rounded p-2 mt-2 w-full"
                  placeholder="Enter your bid amount"
                  value={bidAmounts[load._id] || ""}
                  onChange={(e) =>
                    setBidAmounts({ ...bidAmounts, [load._id]: e.target.value })
                  }
                />

                <button
                  onClick={() => postBid(load._id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 mt-2"
                >
                  Place Bid
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
