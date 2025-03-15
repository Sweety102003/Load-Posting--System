"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    router.push("/");
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      

 
  
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push("/")}>
           LoadBids
        </h1>

        <ul className="hidden md:flex space-x-6">
          <li className="cursor-pointer hover:text-gray-300 mt-2" onClick={() => router.push("/")}>Home</li>
          {role === "shipper" && (
            <>
              <li className="cursor-pointer hover:text-gray-300 mt-2" onClick={() => router.push("/postload")}>Post Load</li>
              <li className="cursor-pointer hover:text-gray-300   mt-2" onClick={() => router.push("/bids/view")}>View Bids</li>
            </>
          )}
          {role === "trucker" && (
            <li className="cursor-pointer hover:text-gray-300 mt-2" onClick={() => router.push("/loaddisplay")}>View Loads & Place Bids</li>
          )}
          {token ? (
            <li className="cursor-pointer bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition" onClick={handleLogout}>
              Logout
            </li>
          ) : (
            <li className="cursor-pointer bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 transition" onClick={() => router.push("/login")}>
              Login
            </li>
          )}
        </ul>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center mb-0  space-y-4 mt-4 bg-gray-800 py-4 rounded-lg">
          <li className="cursor-pointer hover:text-gray-300 " onClick={() =>{ router.push("/");
             setMenuOpen(!menuOpen);}
          }>Home</li>
          {role === "shipper" && (
            <>
              <li className="cursor-pointer hover:text-gray-300 " onClick={() => {router.push("/postload");
                setMenuOpen(!menuOpen);
              }}>Post Load</li>
              <li className="cursor-pointer hover:text-gray-300" onClick={() => {router.push("/bids/view");
                 setMenuOpen(!menuOpen);}
              }>View Bids</li>
            </>
          )}
          {role === "trucker" && (
            <li className="cursor-pointer hover:text-gray-300" onClick={() => {router.push("/loaddisplay");
              setMenuOpen(!menuOpen);}
            }>View Loads & Place Bids</li>
          )}
          {token ? (
            <li className="cursor-pointer bg-red-500 px-4  mt-0 rounded-md hover:bg-red-700 transition" onClick={handleLogout}>
              Logout
            </li>
          ) : (
            <li className="cursor-pointer bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 transition" onClick={() => router.push("/login")}>
              Login
            </li>
          )}
        </ul>
      )}
    </nav>
  
<div className="mt-0">
        {children}</div>
      </body>
    </html>
  );
}
