import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/v1/search.json?key=4ec68d7f74794075a0a154723252201&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSuggestions(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
      setSuggestions([]);
      setError('Failed to fetch suggestions. Check your internet or API key.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) onSearch(query);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to access location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation not supported by this browser.');
    }
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search location..."
        className="w-full p-2 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition-all duration-300"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className="search-icon text-gray-500 dark:text-gray-400"
        onClick={handleSearch}
      />
      <FontAwesomeIcon
        icon={faLocationCrosshairs}
        className="location-icon text-gray-500 dark:text-gray-400"
        onClick={handleGeolocation}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => {
                setQuery(`${suggestion.name}, ${suggestion.region}, ${suggestion.country}`);
                setSuggestions([]);
                onSearch(`${suggestion.name}, ${suggestion.region}, ${suggestion.country}`);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              {suggestion.name}, {suggestion.region}, {suggestion.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;