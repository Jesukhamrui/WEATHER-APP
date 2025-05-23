 const apiKey = '4ec68d7f74794075a0a154723252201';
        let isCelsius = true;
        let currentData = null;
        let miniMap, largeMap, tempChart;
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        let debounceTimer;
        const MAX_RECENT_SEARCHES = 5;
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        let bookmarkedLocations = JSON.parse(localStorage.getItem('bookmarkedLocations') || '[]');
        let isGoogleMapsLoaded = false;

        const weatherIcons = {
            1000: { icon: 'fa-sun', bg: 'sunny' },
            1003: { icon: 'fa-cloud-sun', bg: 'cloudy' },
            1006: { icon: 'fa-cloud', bg: 'cloudy' },
            1009: { icon: 'fa-cloud', bg: 'cloudy' },
            1030: { icon: 'fa-smog', bg: 'foggy' },
            1063: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1066: { icon: 'fa-snowflake', bg: 'snowy' },
            1069: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1072: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1087: { icon: 'fa-bolt', bg: 'rainy' },
            1114: { icon: 'fa-snowflake', bg: 'snowy' },
            1117: { icon: 'fa-snowflake', bg: 'snowy' },
            1135: { icon: 'fa-smog', bg: 'foggy' },
            1147: { icon: 'fa-smog', bg: 'foggy' },
            1150: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1153: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1168: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1171: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1180: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1183: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1186: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1189: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1192: { icon: 'fa-cloud-showers-heavy', bg: 'rainy' },
            1195: { icon: 'fa-cloud-showers-heavy', bg: 'rainy' },
            1198: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1201: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1204: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1207: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1210: { icon: 'fa-snowflake', bg: 'snowy' },
            1213: { icon: 'fa-snowflake', bg: 'snowy' },
            1216: { icon: 'fa-snowflake', bg: 'snowy' },
            1219: { icon: 'fa-snowflake', bg: 'snowy' },
            1222: { icon: 'fa-snowflake', bg: 'snowy' },
            1225: { icon: 'fa-snowflake', bg: 'snowy' },
            1237: { icon: 'fa-snowflake', bg: 'snowy' },
            1240: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1243: { icon: 'fa-cloud-showers-heavy', bg: 'rainy' },
            1246: { icon: 'fa-cloud-showers-heavy', bg: 'rainy' },
            1249: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1252: { icon: 'fa-cloud-rain', bg: 'rainy' },
            1255: { icon: 'fa-snowflake', bg: 'snowy' },
            1258: { icon: 'fa-snowflake', bg: 'snowy' },
            1261: { icon: 'fa-snowflake', bg: 'snowy' },
            1264: { icon: 'fa-snowflake', bg: 'snowy' },
            1273: { icon: 'fa-bolt', bg: 'rainy' },
            1276: { icon: 'fa-bolt', bg: 'rainy' },
            1279: { icon: 'fa-bolt', bg: 'snowy' },
            1282: { icon: 'fa-bolt', bg: 'snowy' }
        };

        function initMap() {
            isGoogleMapsLoaded = true;
            console.log('Google Maps API loaded successfully');
            initializeApp();
        }

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
            if (!suggestionsDiv) {
                console.error('Suggestions div not found');
                return;
            }
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
            const locationInput = document.getElementById('location');
            if (!locationInput) {
                console.error('Location input not found');
                return;
            }
            locationInput.value = location;
            const suggestionsDiv = document.getElementById('suggestions');
            if (suggestionsDiv) suggestionsDiv.style.display = 'none';
            getWeather();
        }

        function updateRecentSearches() {
            const recentSearchesDiv = document.getElementById('recent-searches');
            if (!recentSearchesDiv) {
                console.error('Recent searches div not found');
                return;
            }
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

        function updateBookmarkedLocations() {
            const bookmarkedLocationsDiv = document.getElementById('bookmarked-locations');
            if (!bookmarkedLocationsDiv) {
                console.error('Bookmarked locations div not found');
                return;
            }
            if (!bookmarkedLocations.length) {
                bookmarkedLocationsDiv.style.display = 'none';
                return;
            }
            bookmarkedLocationsDiv.innerHTML = `
                <h3>Bookmarked Locations</h3>
                ${bookmarkedLocations.map(location => `
                    <div class="bookmarked-location">
                        <span onclick="selectSuggestion('${location}')">${location}</span>
                        <button class="remove-bookmark" onclick="removeBookmark('${location}')">Remove</button>
                    </div>
                `).join('')}
            `;
            bookmarkedLocationsDiv.style.display = 'none'; // Initially hidden
        }

        function toggleBookmarkedLocations() {
            const bookmarkedLocationsDiv = document.getElementById('bookmarked-locations');
            if (bookmarkedLocationsDiv) {
                const isHidden = bookmarkedLocationsDiv.style.display === 'none';
                bookmarkedLocationsDiv.style.display = isHidden ? 'block' : 'none';
            }
        }

        function addToRecentSearches(weatherData) {
            const location = `${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}`;
            recentSearches = recentSearches.filter(search => search.location !== location);
            recentSearches.unshift({ location });
            if (recentSearches.length > MAX_RECENT_SEARCHES) {
                recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
            }
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            updateRecentSearches();
        }

        function addToBookmarks(location) {
            if (!bookmarkedLocations.includes(location)) {
                bookmarkedLocations.push(location);
                localStorage.setItem('bookmarkedLocations', JSON.stringify(bookmarkedLocations));
                updateBookmarkedLocations();
            }
        }

        function removeBookmark(location) {
            bookmarkedLocations = bookmarkedLocations.filter(loc => loc !== location);
            localStorage.setItem('bookmarkedLocations', JSON.stringify(bookmarkedLocations));
            updateBookmarkedLocations();
        }

        function formatTime(date) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(' AM', 'AM').replace(' PM', 'PM');
        }

        function getMoonPhase(moonPhase) {
            const phases = [
                'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
                'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
            ];
            const illumination = Math.round(moonPhase * 100);
            const phaseIndex = Math.floor(moonPhase * 8) % 8;
            return { phase: phases[phaseIndex], illumination };
        }

        async function getWeather(lat = null, lon = null) {
            loading.style.display = 'block';
            error.style.display = 'none';
            const locationInput = document.getElementById('location');
            const query = lat && lon ? `${lat},${lon}` : (locationInput ? locationInput.value : 'Mumbai, India');
            if (!query) {
                error.textContent = 'Please enter a location';
                error.style.display = 'block';
                loading.style.display = 'none';
                return;
            }

            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=1&aqi=yes`
                );
                if (!response.ok) throw new Error('Weather data not found');
                const data = await response.json();
                addToRecentSearches(data);
                updateWeatherDisplay(data, query);
            } catch (err) {
                error.textContent = 'Error fetching weather data: ' + err.message;
                error.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }

        function useDefaultLocation(message) {
            console.log(message);
            const locationInput = document.getElementById('location');
            if (locationInput) locationInput.value = 'Mumbai, India';
            getWeather();
        }

        function getCurrentLocation() {
            if (!loading || !error) {
                console.error('Loading or error elements not found');
                return;
            }

            loading.style.display = 'block';
            error.style.display = 'none';

            useDefaultLocation('Using default location (Mumbai, India) as per privacy settings.');
        }

        function updateWeatherDisplay(data, userQuery = '') {
            currentData = data;
            const isFahrenheit = !isCelsius;
            const tempUnit = isFahrenheit ? '°F' : '°C';
            const tempField = isFahrenheit ? 'temp_f' : 'temp_c';
            const feelsLikeField = isFahrenheit ? 'feelslike_f' : 'feelslike_c';
            const windSpeedField = isFahrenheit ? 'wind_mph' : 'wind_kph';
            const windSpeedUnit = isFahrenheit ? 'mph' : 'km/h';
            const pressureField = isFahrenheit ? 'pressure_in' : 'pressure_mb';
            const pressureUnit = isFahrenheit ? 'inHg' : 'hPa';
            const visibilityField = isFahrenheit ? 'vis_miles' : 'vis_km';
            const visibilityUnit = isFahrenheit ? 'mi' : 'km';
            const dewPointField = isFahrenheit ? 'dewpoint_f' : 'dewpoint_c';

            const weatherCondition = weatherIcons[data.current.condition.code] || { icon: 'fa-cloud', bg: 'cloudy' };
            const currentWeatherSection = document.querySelector('.current-weather');
            if (currentWeatherSection) {
                currentWeatherSection.className = 'current-weather'; // Reset classes
                currentWeatherSection.classList.add(weatherCondition.bg); // Apply weather-specific class
            }

            const locationName = document.getElementById('location-name');
            if (locationName) {
                const apiLocation = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
                if (userQuery && !apiLocation.toLowerCase().includes(userQuery.toLowerCase())) {
                    locationName.innerHTML = `${apiLocation}<br>
                        <small style="color: var(--error-text);">(Showing results for: ${apiLocation})</small>`;
                } else {
                    locationName.textContent = data.location.name;
                }
            }

            const locationCountry = document.getElementById('location-country');
            if (locationCountry) locationCountry.textContent = data.location.country;

            const currentTemp = Math.round(data.current[tempField]);
            const feelsLikeTemp = Math.round(data.current[feelsLikeField]);

            const weatherIcon = document.getElementById('weather-icon');
            let iconClass = 'fas fa-cloud fa-2x';
            if (weatherIcon) {
                iconClass = `fas ${weatherCondition.icon} fa-2x`;
                weatherIcon.className = iconClass;
            } else {
                console.error('Weather icon element (#weather-icon) not found in the DOM. Using default icon.');
            }

            const tempValue = document.getElementById('temp-value');
            if (tempValue) {
                tempValue.innerHTML = `${currentTemp} <i class="${iconClass}"></i>`;
            } else {
                console.error('Temperature value element (#temp-value) not found in the DOM.');
            }

            const tempUnitElement = document.getElementById('temp-unit');
            if (tempUnitElement) tempUnitElement.textContent = tempUnit;

            const feelsLike = document.getElementById('feels-like');
            if (feelsLike) feelsLike.textContent = `Feels like: ${feelsLikeTemp}°`;

            const currentTime = document.getElementById('current-time');
            if (currentTime) currentTime.textContent = formatTime(new Date());

            const forecastMessage = document.getElementById('forecast-message');
            if (forecastMessage) {
                forecastMessage.textContent = `Today will be ${data.current.condition.text.toLowerCase()}. The high will reach ${Math.round(isFahrenheit ? data.forecast.forecastday[0].day.maxtemp_f : data.forecast.forecastday[0].day.maxtemp_c)}° on this day.`;
            }

            if (miniMap) miniMap.remove();
            const miniMapElement = document.getElementById('mini-map');
            if (miniMapElement) {
                miniMap = L.map('mini-map').setView([data.location.lat, data.location.lon], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(miniMap);
                L.marker([data.location.lat, data.location.lon]).addTo(miniMap);
            }

            const hourlyData = data.forecast.forecastday[0].hour.slice(0, 8);
            const forecastItems = document.getElementById('forecast-items');
            const updateForecast = (tab) => {
                if (!forecastItems) return;
                forecastItems.innerHTML = hourlyData.map((hour, index) => {
                    const time = new Date(hour.time);
                    const displayTime = index === 0 ? 'Now' : formatTime(time);
                    let value;
                    switch (tab) {
                        case 'hourly':
                            value = `${Math.round(isFahrenheit ? hour.temp_f : hour.temp_c)}°`;
                            break;
                        case 'precipitation':
                            value = `${hour.precip_mm} mm`;
                            break;
                        case 'wind':
                            value = `${Math.round(isFahrenheit ? hour.wind_mph : hour.wind_kph)} ${windSpeedUnit}`;
                            break;
                        case 'air-quality':
                            value = hour.air_quality?.['us-epa-index'] || 'N/A';
                            break;
                        case 'humidity':
                            value = `${hour.humidity}%`;
                            break;
                        case 'sunset-sunrise':
                            value = index === 0 ? formatTime(new Date(data.forecast.forecastday[0].astro.sunrise)) : index === 1 ? formatTime(new Date(data.forecast.forecastday[0].astro.sunset)) : '';
                            break;
                    }
                    return `
                        <div class="forecast-item">
                            <div class="forecast-time">${displayTime}</div>
                            ${tab === 'hourly' ? `<i class="fas ${weatherIcons[hour.condition.code]?.icon || 'fa-cloud'} forecast-icon"></i>` : ''}
                            <div class="${tab === 'hourly' ? 'forecast-temp' : 'forecast-value'}">${value}</div>
                        </div>
                    `;
                }).join('');
            };
            updateForecast('hourly');

            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.removeEventListener('click', tab.clickHandler);
                tab.clickHandler = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    updateForecast(tab.dataset.tab);
                };
                tab.addEventListener('click', tab.clickHandler);
            });

            const labels = hourlyData.map((hour, index) => index === 0 ? 'Now' : formatTime(new Date(hour.time)));
            const temps = hourlyData.map(hour => Math.round(isFahrenheit ? hour.temp_f : hour.temp_c));
            if (tempChart) tempChart.destroy();
            const tempChartCanvas = document.getElementById('temp-chart');
            if (tempChartCanvas) {
                const ctx = tempChartCanvas.getContext('2d');
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const chartLineColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-line-color').trim();
                
                const gradientFill = ctx.createLinearGradient(0, 0, 0, 200);
                gradientFill.addColorStop(0, chartLineColor + '66');
                gradientFill.addColorStop(1, chartLineColor + '00');

                tempChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Temperature',
                            data: temps,
                            borderColor: chartLineColor,
                            backgroundColor: gradientFill,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                            pointHoverRadius: 6,
                            pointBackgroundColor: chartLineColor,
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointHoverBackgroundColor: chartLineColor,
                            pointHoverBorderColor: '#ffffff',
                            pointHoverBorderWidth: 3,
                        }]
                    },
                    options: {
                        animation: {
                            duration: 1500,
                            easing: 'easeInOutQuad'
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim(),
                                    maxTicksLimit: 8,
                                },
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                ticks: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim(),
                                    callback: value => value + '°',
                                },
                                grid: {
                                    color: getComputedStyle(document.documentElement).getPropertyValue('--chart-grid-color').trim(),
                                    drawBorder: false,
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleFont: { size: 14 },
                                bodyFont: { size: 12 },
                                callbacks: {
                                    label: function(context) {
                                        return `Temperature: ${context.parsed.y}°${isFahrenheit ? 'F' : 'C'}`;
                                    }
                                }
                            },
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                    },
                });
            }

            const tempCardValue = document.getElementById('temp-card-value');
            if (tempCardValue) tempCardValue.textContent = `${currentTemp}°`;

            const tempDesc = document.getElementById('temp-desc');
            if (tempDesc) tempDesc.textContent = `Feels like ${feelsLikeTemp}°`;

            const tempMin = document.getElementById('temp-min');
            if (tempMin) tempMin.textContent = `${Math.round(isFahrenheit ? data.forecast.forecastday[0].day.mintemp_f : data.forecast.forecastday[0].day.mintemp_c)}°`;

            const tempMax = document.getElementById('temp-max');
            if (tempMax) tempMax.textContent = `${Math.round(isFahrenheit ? data.forecast.forecastday[0].day.maxtemp_f : data.forecast.forecastday[0].day.maxtemp_c)}°`;

            const tempRange = (isFahrenheit ? data.forecast.forecastday[0].day.maxtemp_f : data.forecast.forecastday[0].day.maxtemp_c) - (isFahrenheit ? data.forecast.forecastday[0].day.mintemp_f : data.forecast.forecastday[0].day.mintemp_c);
            const tempProgressPercent = tempRange ? ((currentTemp - (isFahrenheit ? data.forecast.forecastday[0].day.mintemp_f : data.forecast.forecastday[0].day.mintemp_c)) / tempRange) * 100 : 0;

            const tempProgress = document.getElementById('temp-progress');
            if (tempProgress) tempProgress.style.width = `${tempProgressPercent}%`;

            const tempMarker = document.getElementById('temp-marker');
            if (tempMarker) tempMarker.style.left = `${tempProgressPercent}%`;

            const windSpeed = document.getElementById('wind-speed');
            if (windSpeed) windSpeed.textContent = `${Math.round(data.current[windSpeedField])} ${windSpeedUnit}`;

            const windDir = document.getElementById('wind-dir');
            if (windDir) windDir.textContent = data.current.wind_dir;

            const windArrow = document.getElementById('wind-arrow');
            if (windArrow) windArrow.style.transform = `rotate(${data.current.wind_degree}deg)`;

            const humidityValue = document.getElementById('humidity-value');
            if (humidityValue) humidityValue.textContent = `${data.current.humidity}%`;

            const dewPoint = document.getElementById('dew-point');
            if (dewPoint) dewPoint.textContent = `Dew point: ${Math.round(data.current[dewPointField])}°`;

            const humidityProgress = document.getElementById('humidity-progress');
            if (humidityProgress) humidityProgress.style.width = `${data.current.humidity}%`;

            const uvValue = document.getElementById('uv-value');
            if (uvValue) uvValue.textContent = data.current.uv;

            const uvLevel = document.getElementById('uv-level');
            if (uvLevel) {
                if (data.current.uv <= 2) uvLevel.textContent = 'Low';
                else if (data.current.uv <= 5) uvLevel.textContent = 'Moderate';
                else if (data.current.uv <= 7) uvLevel.textContent = 'High';
                else if (data.current.uv <= 10) uvLevel.textContent = 'Very High';
                else uvLevel.textContent = 'Extreme';
            }

            const uvMarker = document.getElementById('uv-marker');
            if (uvMarker) uvMarker.style.left = `${(data.current.uv / 11) * 100}%`;

            const visibilityValue = document.getElementById('visibility-value');
            if (visibilityValue) visibilityValue.textContent = `${data.current[visibilityField]} ${visibilityUnit}`;

            const visibilityDesc = document.getElementById('visibility-desc');
            if (visibilityDesc) visibilityDesc.textContent = data.current[visibilityField] < 1 ? 'Very poor visibility' : 'Good visibility';

            const pressureValue = document.getElementById('pressure-value');
            if (pressureValue) pressureValue.textContent = `${data.current[pressureField]} ${pressureUnit}`;

            const pressureDesc = document.getElementById('pressure-desc');
            if (pressureDesc) pressureDesc.textContent = data.current[pressureField] < 1000 ? 'Low pressure' : 'High pressure';

            const pressureMin = isFahrenheit ? 29 : 980;
            const pressureMax = isFahrenheit ? 31 : 1030;
            const pressureRange = pressureMax - pressureMin;
            const pressureProgressPercent = pressureRange ? ((data.current[pressureField] - pressureMin) / pressureRange) * 100 : 0;

            const pressureProgress = document.getElementById('pressure-progress');
            if (pressureProgress) pressureProgress.style.width = `${pressureProgressPercent}%`;

            const pressureMarker = document.getElementById('pressure-marker');
            if (pressureMarker) pressureMarker.style.left = `${pressureProgressPercent}%`;

            const sunriseTime = document.getElementById('sunrise-time');
            if (sunriseTime) sunriseTime.textContent = formatTime(new Date(data.forecast.forecastday[0].astro.sunrise));

            const sunsetTime = document.getElementById('sunset-time');
            if (sunsetTime) sunsetTime.textContent = formatTime(new Date(data.forecast.forecastday[0].astro.sunset));

            const now = new Date();
            const sunrise = new Date(now.toDateString() + ' ' + data.forecast.forecastday[0].astro.sunrise);
            const sunset = new Date(now.toDateString() + ' ' + data.forecast.forecastday[0].astro.sunset);
            const dayLength = (sunset - sunrise) / (1000 * 60);
            const minutesSinceSunrise = (now - sunrise) / (1000 * 60);
            const sunProgressPercent = dayLength ? (minutesSinceSunrise / dayLength) * 100 : 0;

            const sunPosition = document.getElementById('sun-position');
            if (sunPosition) sunPosition.style.left = `${Math.min(Math.max(sunProgressPercent, 0), 100)}%`;

            const moonIcon = document.getElementById('moon-icon');
            const moonVisibility = document.getElementById('moon-visibility');
            const moonPhase = document.getElementById('moon-phase');
            if (moonIcon && moonVisibility && moonPhase) {
                const { phase, illumination } = getMoonPhase(data.forecast.forecastday[0].astro.moon_illumination / 100);
                moonIcon.innerHTML = `
                    <div style="width: 60px; height: 60px; border-radius: 50%; background-color: #ccc; position: relative; overflow: hidden;">
                        <div style="width: ${illumination}%; height: 100%; background-color: #fff; position: absolute; ${phase.includes('Waxing') ? 'left: 0' : 'right: 0'};"></div>
                    </div>
                `;
                moonVisibility.textContent = `${illumination}% visible`;
                moonPhase.textContent = phase;
            }

            if (largeMap) largeMap.remove();
            const largeMapElement = document.getElementById('large-map');
            if (largeMapElement) {
                largeMap = L.map('large-map').setView([data.location.lat, data.location.lon], 8);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(largeMap);
            }
        }

        function initializeApp() {
            const locationInput = document.getElementById('location');
            if (locationInput) {
                locationInput.addEventListener('input', () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(async () => {
                        const suggestions = await getLocationSuggestions(locationInput.value);
                        displaySuggestions(suggestions);
                    }, 300);
                });

                locationInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') getWeather();
                });
            }

            const searchIcon = document.getElementById('search-icon');
            if (searchIcon) {
                searchIcon.addEventListener('click', () => {
                    getWeather();
                });
            }

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#suggestions') && !e.target.closest('#location')) {
                    const suggestionsDiv = document.getElementById('suggestions');
                    if (suggestionsDiv) suggestionsDiv.style.display = 'none';
                }
            });

            const currentLocationBtn = document.getElementById('current-location');
            if (currentLocationBtn) {
                currentLocationBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Current location button clicked');
                    getCurrentLocation();
                });
            } else {
                console.error('Current location button not found');
            }

            const tempUnitBtn = document.getElementById('temp-unit-btn');
            if (tempUnitBtn) {
                tempUnitBtn.addEventListener('click', () => {
                    isCelsius = !isCelsius;
                    tempUnitBtn.textContent = isCelsius ? 'F°/C°' : 'C°/F°';
                    if (currentData) updateWeatherDisplay(currentData);
                });
            }

            const bookmarkBtn = document.getElementById('bookmark-btn');
            if (bookmarkBtn) {
                bookmarkBtn.addEventListener('click', () => {
                    const locationInput = document.getElementById('location');
                    if (locationInput && locationInput.value) {
                        addToBookmarks(locationInput.value);
                    } else {
                        alert('Please search for a location to bookmark.');
                    }
                });
            }

            const bookmarkToggle = document.getElementById('bookmark-toggle');
            if (bookmarkToggle) {
                bookmarkToggle.addEventListener('click', toggleBookmarkedLocations);
            }

            const mapControls = document.querySelectorAll('.map-controls .btn');
            mapControls.forEach(control => {
                control.addEventListener('click', () => {
                    mapControls.forEach(c => c.classList.remove('active'));
                    control.classList.add('active');
                    const zoomLevels = { '1': 10, '3': 9, '12': 8, '24': 7 };
                    const zoom = zoomLevels[control.dataset.hours] || 10;
                    if (miniMap) {
                        miniMap.setZoom(zoom);
                    }
                });
            });

            const mapTabs = document.querySelectorAll('.map-tab');
            mapTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    mapTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const layer = tab.dataset.layer;
                    if (largeMap) {
                        largeMap.eachLayer(layer => {
                            if (layer instanceof L.TileLayer) largeMap.removeLayer(layer);
                        });
                        const tileUrl = layer === 'standard'
                            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            : 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=ef5f32dc6a947e8b6f2a26d4d8423d1';
                        L.tileLayer(tileUrl, {
                            attribution: layer === 'standard' ? '© OpenStreetMap contributors' : '© OpenWeatherMap'
                        }).addTo(largeMap);
                    }
                });
            });

            const themeToggle = document.getElementById('theme-toggle');
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                if (currentData) updateWeatherDisplay(currentData);
            });

            updateRecentSearches();
            updateBookmarkedLocations();
            getCurrentLocation();
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (!isGoogleMapsLoaded) {
                console.log('Google Maps API not loaded, initializing app anyway...');
                setTimeout(() => {
                    if (!isGoogleMapsLoaded) {
                        console.warn('Google Maps API still not loaded, proceeding with default initialization.');
                        initializeApp();
                    }
                }, 5000);
            }
        });
