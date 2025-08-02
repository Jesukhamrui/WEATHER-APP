import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapMini = ({ weatherData }) => {
  if (!weatherData) return null;

  const position = [weatherData.location.lat, weatherData.location.lon];

  return (
    <div className="map-mini border border-gray-300 rounded-lg shadow-md mb-4 h-48">
      <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            {weatherData.location.name}, {weatherData.location.country} <br /> Current Weather: {weatherData.current.condition.text}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapMini;