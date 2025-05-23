Weather Dashboard 🌤️
Overview
The Weather Dashboard (Weathery) is a web application that provides real-time weather information for any location worldwide. Built with HTML, CSS, and JavaScript, it leverages the WeatherAPI to fetch weather data and integrates with Google Maps and Leaflet for location-based features. The app supports light and dark themes, weather-specific animations, and interactive elements like hourly forecasts, weather maps, and detailed weather metrics.
Features

Real-Time Weather Data: Displays current temperature, feels-like temperature, weather condition, and more.
Weather Animations: Dynamic backgrounds and animations (rain, snow, fog) in the current weather section based on the weather condition.
Theme Support: Toggle between light and dark themes with automatic persistence using local storage.
Location Search: Autocomplete search for locations using WeatherAPI's search endpoint.
Bookmarks & Recent Searches: Save favorite locations and view recent searches, stored in local storage.
Interactive Maps: Mini and large maps using Leaflet to show the location and weather layers.
Hourly Forecast: Tabs for hourly temperature, precipitation, wind, air quality, humidity, and sunrise/sunset times.
Weather Details: Detailed metrics including UV index, humidity, wind speed, visibility, pressure, and sun/moon phases.
Temperature Unit Toggle: Switch between Celsius and Fahrenheit.
Responsive Design: Optimized for mobile, tablet, and desktop devices.

Technologies Used

HTML5: Structure of the application.
CSS3: Styling with support for light/dark themes and weather animations.
JavaScript (ES6+): Core functionality, API integration, and DOM manipulation.
WeatherAPI: For fetching weather data (API key required).
Leaflet.js: For interactive maps.
Google Maps API: For location autocomplete (API key required).
Chart.js: For temperature graph visualization.
Font Awesome: For icons.
Local Storage: For persisting theme, bookmarks, and recent searches.

Setup Instructions
Prerequisites

API Keys:

Obtain a WeatherAPI key from WeatherAPI.
Obtain a Google Maps API key from Google Cloud Console with the Places API enabled.


Browser: A modern browser (Chrome, Firefox, Edge, etc.) with JavaScript enabled.


Installation

Clone or Download the Repository:
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard


Update API Keys:

Open index.html.
Replace YOUR_GOOGLE_API_KEY in the Google Maps script tag with your Google Maps API key:<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places&callback=initMap"></script>


Replace the apiKey variable in the JavaScript section with your WeatherAPI key:const apiKey = 'YOUR_WEATHER_API_KEY';




Serve the Application:

Since this is a static web app, you can serve it using a local server. Use a tool like live-server or any static file server:npm install -g live-server
live-server


Alternatively, open index.html directly in your browser, but note that some features (e.g., API requests) may require a server due to CORS restrictions.


Access the App:

Open your browser and navigate to http://localhost:8080 (or the port provided by your server).



Usage

Search for a Location:

Use the search bar to find a location. Suggestions will appear as you type.
Press Enter or click the search icon to fetch weather data.


Toggle Theme:

Click the sun/moon icon in the header to switch between light and dark themes.


Bookmark Locations:

After searching for a location, click the "Bookmark" button to save it.
Click the bookmark icon in the header to view or remove bookmarked locations.


Switch Temperature Units:

Click the "F°/C°" button to toggle between Celsius and Fahrenheit.


Explore Features:

View the current weather with dynamic animations.
Check the hourly forecast using the tabs (temperature, precipitation, etc.).
Interact with maps to zoom in/out or switch between standard and infrared layers.
Review detailed weather metrics like UV index, wind speed, and moon phase.



File Structure

index.html: Main HTML file containing the structure, styles, and scripts.
README.md: Project documentation (this file).

Limitations

API Dependency: Requires active internet and valid API keys for WeatherAPI and Google Maps.
No Backend: Data persistence (bookmarks, recent searches) uses local storage, which is browser-specific.
CORS: Some features may not work if index.html is opened directly without a local server.
Google Maps API: The current location feature is set to a default location (Mumbai, India) due to privacy settings; you can modify this in the JavaScript.

Future Improvements

Add support for multiple-day forecasts.
Implement user authentication for cloud-based bookmark storage.
Enhance weather animations with more effects.
Add support for additional weather map layers (e.g., temperature, wind).

Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, reach out at jesukhamrui@gmail.com.

🚧 Note: This project is under active development. New features are coming soon! 🌟
