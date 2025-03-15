"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center max-w-3xl px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900"> Welcome to LoadBids</h1>
        <p className="text-lg text-gray-700">
          Connecting **shippers** and **truckers** to make **load bidding** simple, efficient, and hassle-free.
        </p>
      </div>

      
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Fast Bidding</h2>
          <p className="text-gray-600">Get competitive bids from truckers in real time.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Secure Payments</h2>
          <p className="text-gray-600">Ensuring safe and seamless transactions.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900">Verified Truckers</h2>
          <p className="text-gray-600">Only certified truckers can place bids.</p>
        </div>
      </div>
    </div>
  );
}
