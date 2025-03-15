"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("shipper");
  const [accidents, setAccidents] = useState("");
  const [theftcomplaints, setTheftComplaints] = useState("");
  const [truckage, setTruckAge] = useState("");
  const [licenseheldYears, setLicenseHeldYears] = useState("");
  const router = useRouter();

  const postData = async () => {
    try {
      if (role === "trucker") 
      {const userData = {
        name,
        email,
        password,
        role,
        accidents,
        theftcomplaints,
        truckage,
        licenseheldYears,
      };
      console.log(userData);
      const response = await axios.post("/api/auth/signup", userData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setAccidents("");
      setTheftComplaints("");
      setTruckAge("");
      setLicenseHeldYears("");
      router.push("/login");
    }
      else{
        const userData = {
          name,
          email,
          password,
          role,};
      

     

      const response = await axios.post("/api/auth/signup", userData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      setName("");
      setEmail("");
      setPassword("");
     

      router.push("/login");}
    } catch (error) {
      alert("Error signing up: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Registration Form
        </h1>

        <input
          type="text"
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />

        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />

        <input
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="shipper">Shipper</option>
          <option value="trucker">Trucker</option>
        </select>

        {role === "trucker" && (
          <>
            <input
              type="number"
              placeholder="Accidents (should be 0)"
              className="border rounded p-2 w-full mb-2"
              value={accidents}
              onChange={(e) => setAccidents(e.target.value)}
            />
            <input
              type="number"
              placeholder="Theft Complaints (should be 0)"
              className="border rounded p-2 w-full mb-2"
              value={theftcomplaints}
              onChange={(e) => setTheftComplaints(e.target.value)}
            />
            <input
              type="number"
              placeholder="Truck Age (≤ 5 years)"
              className="border rounded p-2 w-full mb-2"
              value={truckage}
              onChange={(e) => setTruckAge(e.target.value)}
            />
            <input
              type="number"
              placeholder="License Held for (≥ 5 years)"
              className="border rounded p-2 w-full mb-2"
              value={licenseheldYears}
              onChange={(e) => setLicenseHeldYears(e.target.value)}
            />
          </>
        )}

        <button
          onClick={postData}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}
