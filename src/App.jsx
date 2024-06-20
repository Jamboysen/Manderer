import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useRef } from "react";

export default function App() {
  const [location, setLocation] = useState(null);
  const [center, setCenter] = useState([51.505, -0.09]); // Default center before location is loaded
  const [watchId, setWatchId] = useState(null);
  const mapRef = useRef(null);

  // Function to handle recentering the map to current location
  const recenterMap = () => {
    if (location && mapRef.current) {
      const { lat, lng } = location;
      const zoom = 15; // Set the desired zoom level

      setCenter([lat, lng]);
      mapRef.current.setView([lat, lng], zoom);
    }
  };

  // Effect to start watching location updates and set initial center
  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setCenter([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      },
      { enableHighAccuracy: true }
    );
    setWatchId(id);

    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, []);

  // Effect to update location every 10 seconds and update center accordingly
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setCenter([latitude, longitude]); // Update center along with location
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        },
        { enableHighAccuracy: true }
      );
    }, 10000); // Update every 10 seconds (10000 milliseconds)

    return () => clearInterval(interval);
  }, []);

  if (!location) {
    return <div>LOADING...</div>;
  }

  return (
    <div>
      <MapContainer center={center} zoom={20} ref={mapRef} className="map-container">
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {location && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here</Popup>
            {console.log(location.lat + " and " + location.lng)}
          
          </Marker>
        )}
        <div className="button-container">
          <button onClick={recenterMap}>Recenter Map</button>
        </div>
      </MapContainer>
    </div>
  );
}
