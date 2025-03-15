"use client";
import { useState } from "react";
import axios from "axios";

export default function Postload() {
  const [pickuplocation, setPickup] = useState("");
  const [dropofflocation, setDropoff] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [maxTime, setMaxTime] = useState(""); 
  const postdata = async () => {
    try {
        const storedtoken=localStorage.getItem("token");
       console.log(storedtoken);
      const response = await axios.post("/api/load/post", {
        pickuplocation,
        dropofflocation,
        weight,
        description,
        maxTime,
        
      }, {
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${storedtoken}` ,
          
        },
      });

      console.log(response.data.message);
      console.log(response);
      
      alert(response.data.message);
      setDescription("");
      setDropoff("");
      setPickup("");
      setWeight("");
      setMaxTime("");
    } catch (error) {
      console.error("Error posting load:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Post a Load</h1>
        <input
          type="text"
          value={pickuplocation}
          placeholder="Enter the pickup location"
          className="w-full px-4 py-2 border rounded-lg mb-2"
          onChange={(e) => setPickup(e.target.value)}
        />
        <input
          type="text"
          value={dropofflocation}
          placeholder="Enter the drop-off location"
          className="w-full px-4 py-2 border rounded-lg mb-2"
          onChange={(e) => setDropoff(e.target.value)}
        />
         <input
          type="number"
          value={weight}
          placeholder="Enter the weight (kg)"
          className="w-full px-4 py-2 border rounded-lg mb-2"
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
        />
        <textarea
          value={description}
          placeholder="Enter the description"
          className="w-full px-4 py-2 border rounded-lg mb-2"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          value={maxTime}
          placeholder="Max Time (hours)"
          className="w-full px-4 py-2 border rounded-lg mb-2"
          onChange={(e) => setMaxTime(parseFloat(e.target.value) || 0)}
        />

       
        <button
          onClick={()=>{postdata();
           
          }
          }
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Post a Load
        </button>
      </div>
    </div>
  );
}
