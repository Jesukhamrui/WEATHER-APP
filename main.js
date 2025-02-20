const apiKey = '4ec68d7f74794075a0a154723252201';
let debounceTimer;
const MAX_RECENT_SEARCHES = 5;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

// Get location suggestions for autocomplete
async function getLocationSuggestions(query) {
    if (query.length < 3) return [];
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        return await response.json();
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    const suggestionsDiv = document.getElementById('suggestions');
    if (!suggestions.length) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    suggestionsDiv.innerHTML = suggestions
        .map(suggestion => `
            <div class="suggestion" onclick="selectSuggestion('${suggestion.name}, ${suggestion.region}, ${suggestion.country}')">
                ${suggestion.name}, ${suggestion.region}, ${suggestion.country}
            </div>
        `)
        .join('');
    suggestionsDiv.style.display = 'block';
}

function selectSuggestion(location) {
    document.getElementById('location').value = location.split(',')[0];
    document.getElementById('state').value = location.split(',')[1]?.trim() || '';
    document.getElementById('country').value = location.split(',')[2]?.trim() || '';
    document.getElementById('suggestions').style.display = 'none';
    getWeather();
}

function updateRecentSearches() {
    const recentSearchesDiv = document.getElementById('recent-searches');
    if (!recentSearches.length) {
        recentSearchesDiv.style.display = 'none';
        return;
    }

    recentSearchesDiv.innerHTML = `
        <h3>Recent Searches</h3>
        ${recentSearches.map(search => `
            <div class="recent-search" onclick="selectSuggestion('${search.location}')">
                ${search.location}
            </div>
        `).join('')}
    `;
    recentSearchesDiv.style.display = 'block';
}

function addToRecentSearches(weatherData) {
    const location = `${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`;
    
    // Remove existing entry if present
    recentSearches = recentSearches.filter(search => search.location !== location);
    
    // Add to beginning of array
    recentSearches.unshift({ location });
    
    // Keep only MAX_RECENT_SEARCHES items
    if (recentSearches.length > MAX_RECENT_SEARCHES) {
        recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
    }
    
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearches();
}

function updateWeatherDisplay(data, userQuery = '') {
    const locationName = document.getElementById('location-name');
    const apiLocation = `${data.location.name}, ${data.location.region}, ${data.location.country}`;

    // Add warning if API location doesn't match user input
    if (userQuery && !apiLocation.toLowerCase().includes(userQuery.toLowerCase())) {
        locationName.innerHTML = `${apiLocation}<br>
        <small style="color: var(--error-color);">(Showing results for: ${apiLocation})</small>`;
    } else {
        locationName.textContent = apiLocation;
    }

    document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;
    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('feels-like').textContent =
        `${data.current.feelslike_c}°C / ${data.current.feelslike_f}°F`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind').textContent =
        `${data.current.wind_kph} km/h (${data.current.wind_dir})`;

    // Handle air quality data availability
    const airQuality = data.current.air_quality?.["pm2_5"];
    document.getElementById('air-quality').textContent = airQuality ?
        `PM2.5: ${airQuality.toFixed(2)}` : 'Data not available';

    const lastUpdated = new Date(data.current.last_updated).toLocaleString();
    document.getElementById('last-updated').textContent = `Last Updated: ${lastUpdated}`;

    document.getElementById('weather-info').style.display = 'block';
}

// Helper function to validate coordinates
function isValidCoordinate(lat, lon) {
    return !isNaN(lat) && !isNaN(lon) && 
           lat >= -90 && lat <= 90 && 
           lon >= -180 && lon <= 180;
}

function getCurrentLocation() {
    const error = document.getElementById('error');
    const loading = document.getElementById('loading');
    const weatherInfo = document.getElementById('weather-info');
    
    // Clear previous results
    weatherInfo.style.display = 'none';
    error.style.display = 'none';
    loading.style.display = 'block';

    // Check if location services are enabled
    if (!navigator.geolocation) {
        error.textContent = 'Geolocation is not supported by your browser. Please enable location services.';
        error.style.display = 'block';
        loading.style.display = 'none';
        return;
    }

    // More permissive options for better compatibility
    const options = {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 60000
    };

    try {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Location obtained:', latitude, longitude);
                
                // Validate coordinates
                if (!isValidCoordinate(latitude, longitude)) {
                    throw new Error('Invalid coordinates received');
                }
                
                getWeather(latitude, longitude);
            },
            // Error callback
            (err) => {
                loading.style.display = 'none';
                error.style.display = 'block';
                
                let errorMsg;
                switch(err.code) {
                    case 1: // PERMISSION_DENIED
                        errorMsg = 'Please allow location access in your browser settings and try again.';
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMsg = 'Location service is unavailable. Please check if location services are enabled.';
                        break;
                    case 3: // TIMEOUT
                        errorMsg = 'Location request timed out. Please check your internet connection and try again.';
                        break;
                    default:
                        errorMsg = 'An error occurred while getting your location. Please try again.';
                }
                error.textContent = errorMsg;
                console.error('Geolocation error:', err);
            },
            options
        );
    } catch (e) {
        error.textContent = 'Failed to access location services. Please make sure location services are enabled.';
        error.style.display = 'block';
        loading.style.display = 'none';
        console.error('Geolocation error:', e);
    }
}

async function getWeather(lat = null, lon = null) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const weatherInfo = document.getElementById('weather-info');

    loading.style.display = 'block';
    error.style.display = 'none';
    weatherInfo.style.display = 'none';

    try {
        let apiUrl, userQuery;
        if (lat !== null && lon !== null) {
            console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
            apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`;
            userQuery = 'Current Location';
        } else {
            const locationInput = document.getElementById('location').value.trim();
            const stateInput = document.getElementById('state').value.trim();
            const countryInput = document.getElementById('country').value.trim();
            
            if (!locationInput) throw new Error('Please enter a location name');
            userQuery = [locationInput, stateInput, countryInput].filter(Boolean).join(', ');
            apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(userQuery)}&aqi=yes`;
        }

        console.log('Fetching weather from:', apiUrl);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch weather data');
        if (data.error) throw new Error(data.error.message);

        console.log('Weather data received:', data);
        updateWeatherDisplay(data, userQuery);
        addToRecentSearches(data);

    } catch (err) {
        console.error('Weather fetch error:', err);
        error.textContent = err.message;
        error.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', () => {
    // Set up location input event listener with debounce
    const locationInput = document.getElementById('location');
    locationInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const suggestions = await getLocationSuggestions(e.target.value);
            displaySuggestions(suggestions);
        }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#suggestions') && !e.target.closest('#location')) {
            document.getElementById('suggestions').style.display = 'none';
        }
    });

    // Initialize recent searches
    updateRecentSearches();
});