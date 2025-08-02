import { useEffect } from 'react';

const WeatherDetails = ({ weatherData, isCelsius }) => {
  if (!weatherData) return null;

  const tempUnit = isCelsius ? '°C' : '°F';
  const windUnit = isCelsius ? 'km/h' : 'mph';
  const pressureUnit = isCelsius ? 'hPa' : 'inHg';
  const visibilityUnit = isCelsius ? 'km' : 'mi';

  return (
    <div className="weather-details mb-4">
      <div className="section-header flex justify-between items-center mb-2">
        <h2 className="section-title text-xl font-semibold text-blue-500">Weather Details</h2>
        <a href="#" className="section-link text-blue-500 hover:text-blue-700">See more</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="detail-card p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <div className="card-title text-gray-600 dark:text-gray-400">Temperature</div>
          <div className="card-value text-2xl font-bold">{Math.round(isCelsius ? weatherData.current.temp_c : weatherData.current.temp_f)}°</div>
          <div className="card-desc text-gray-600 dark:text-gray-400">Feels like {Math.round(isCelsius ? weatherData.current.feelslike_c : weatherData.current.feelslike_f)}°</div>
        </div>
        {/* Add more detail cards as needed */}
      </div>
    </div>
  );
};

export default WeatherDetails;