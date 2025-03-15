"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useRouter(); 

  const postData = async () => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);
      setEmail("");
      setPassword("");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      navigate.push("/");
    } catch (error) {
      alert("Login failed: " + error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Login
        </h1>

        <input
          type="text"
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
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={postData}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Login
        </button>

        {/* Register Section */}
        <div className="text-center mt-4">
          <p className="text-gray-600">If you haven't registered, register first.</p>
          <button
            onClick={() => navigate.push("/signup")}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
