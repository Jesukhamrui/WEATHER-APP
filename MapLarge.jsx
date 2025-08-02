import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapLarge = ({ weatherData }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);

  if (!weatherData) return null;

  useEffect(() => {
    setMapCenter([weatherData.location.lat, weatherData.location.lon]);
  }, [weatherData]);

  return (
    <div className="map-large border border-gray-300 rounded-lg shadow-md mb-4" style={{ height: '500px', width: '100%' }}>
      <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={mapCenter}>
          <Popup>
            {weatherData.location.name}, {weatherData.location.country} <br /> Current Weather: {weatherData.current.condition.text}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapLarge;