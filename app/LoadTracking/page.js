"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const center = { lat: 28.6139, lng: 77.2090 };

export default function LoadTracking() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await axios.get("/api/tracker/get", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setLoads(response.data.loads);
    } catch (error) {
      console.error("Error fetching load locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-2">Track Your Loads</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={5} center={center}>
            {loads.map((load) =>
              load.location ? (
                <Marker
                  key={load._id}
                  position={{ lat: load.location.latitude, lng: load.location.longitude }}
                  title={`Load Status: ${load.status}`}
                />
              ) : null
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}
