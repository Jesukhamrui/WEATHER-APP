import { useState } from 'react';

const ForecastTabs = ({ weatherData, isCelsius }) => {
  const [activeTab, setActiveTab] = useState('hourly');
  const hourlyData = weatherData?.forecast.forecastday[0].hour.slice(0, 8) || [];

  const formatTime = (date) => (new Date(date).getHours() === 0 ? 'Now' : new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

  const getTabContent = () => {
    return hourlyData.map((hour, index) => {
      const time = formatTime(hour.time);
      let value;
      switch (activeTab) {
        case 'hourly': value = `${Math.round(isCelsius ? hour.temp_c : hour.temp_f)}°`; break;
        case 'precipitation': value = `${hour.precip_mm} mm`; break;
        case 'wind': value = `${Math.round(isCelsius ? hour.wind_kph : hour.wind_mph)} ${isCelsius ? 'km/h' : 'mph'}`; break;
        case 'air-quality': value = hour.air_quality?.['us-epa-index'] || 'N/A'; break;
        case 'humidity': value = `${hour.humidity}%`; break;
        case 'sunset-sunrise': value = index === 0 ? formatTime(weatherData.forecast.forecastday[0].astro.sunrise) : index === 1 ? formatTime(weatherData.forecast.forecastday[0].astro.sunset) : ''; break;
        default: value = '';
      }
      return (
        <div key={index} className="forecast-item flex justify-between items-center p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <span className="forecast-time text-gray-600 dark:text-gray-400">{time}</span>
          {activeTab === 'hourly' && <i className="fas fa-cloud forecast-icon text-gray-600 dark:text-gray-400" />}
          <span className="forecast-value text-gray-900 dark:text-gray-100">{value}</span>
        </div>
      );
    });
  };

  return (
    <div className="hourly-forecast mb-4">
      <div className="forecast-tabs flex justify-center gap-2 mb-2 overflow-x-auto">
        {['hourly', 'precipitation', 'wind', 'air-quality', 'humidity', 'sunset-sunrise'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab p-2 rounded cursor-pointer ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>
      <div className="forecast-items flex flex-col gap-2">{getTabContent()}</div>
    </div>
  );
};

export default ForecastTabs;