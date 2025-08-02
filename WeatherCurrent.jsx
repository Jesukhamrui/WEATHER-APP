import { useState, useEffect } from 'react';

const WeatherCurrent = ({ weatherData, isCelsius, toggleUnit }) => {
  const temp = isCelsius ? weatherData.current.temp_c : weatherData.current.temp_f;

  return (
    <div className="p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {weatherData.location.name}
      </h2>
      <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        {Math.round(temp)}°{isCelsius ? 'C' : 'F'}
      </p>
      <button
        onClick={toggleUnit}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Switch to {isCelsius ? '°F' : '°C'}
      </button>
    </div>
  );
};

export default WeatherCurrent;