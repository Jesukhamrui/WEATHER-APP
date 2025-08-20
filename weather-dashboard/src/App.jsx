import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCurrent from './components/WeatherCurrent';
import MapMini from './components/MapMini';
import ForecastTabs from './components/ForecastTabs';
import TempGraph from './components/TempGraph';
import WeatherDetails from './components/WeatherDetails';
import MapLarge from './components/MapLarge';
import Footer from './components/Footer';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = '4ec68d7f74794075a0a154723252201';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    console.log('Theme set to:', theme, document.documentElement.getAttribute('data-theme'));
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    console.log('Toggled to:', newTheme);
  };

  const toggleUnit = () => setIsCelsius(!isCelsius);

  const fetchWeather = async (query) => {
    if (!query || query.trim() === '') {
      setError('Please enter a location');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=1&aqi=yes`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      setError(`Failed to fetch weather: ${error.message}`);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} text-gray-900 dark:text-gray-100 transition-all duration-300 flex flex-col`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="container mx-auto flex-grow p-4">
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <SearchBar onSearch={fetchWeather} />
        {weatherData ? (
          <>
            <WeatherCurrent weatherData={weatherData} isCelsius={isCelsius} toggleUnit={toggleUnit} />
            <MapMini weatherData={weatherData} />
            <ForecastTabs weatherData={weatherData} isCelsius={isCelsius} />
            <TempGraph weatherData={weatherData} isCelsius={isCelsius} />
            <WeatherDetails weatherData={weatherData} isCelsius={isCelsius} />
            <MapLarge weatherData={weatherData} />
          </>
        ) : !loading && !error && (
          <div className="loading">Enter a location to see weather data...</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
