const apiKey = 'b3a11790c786eebf5be32e8f65739dcc'; // Replace with your OpenWeatherMap API key

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-moon',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy',
        '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-moon-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-question';
}

function toggleTheme() {
    const toggleSwitch = document.querySelector('.toggle-switch');
    toggleSwitch.classList.toggle('active');
    document.body.classList.toggle('light-theme');
}

async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const weatherInfo = document.getElementById('weather-info');
    const city = cityInput.value;
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        if (currentWeatherData.cod === '404') {
            weatherInfo.innerHTML = 'City not found';
            return;
        }

        const temperature = Math.round(currentWeatherData.main.temp);
        const icon = currentWeatherData.weather[0].icon;
        const description = currentWeatherData.weather[0].description;
        const feelsLike = Math.round(currentWeatherData.main.feels_like);
        const humidity = currentWeatherData.main.humidity;
        const windSpeed = currentWeatherData.wind.speed;
        const uvIndex = 3; // Placeholder, as OpenWeatherMap doesn't provide UV index in the free tier

        let forecastHTML = '';
        for (let i = 0; i < 6; i++) {
            const forecast = forecastData.list[i];
            const time = new Date(forecast.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
            forecastHTML += `
                <div class="forecast-item">
                    <div>${time}</div>
                    <div class="forecast-icon"><i class="fas ${getWeatherIcon(forecast.weather[0].icon)}"></i></div>
                    <div>${Math.round(forecast.main.temp)}°</div>
                </div>
            `;
        }

        let weeklyForecastHTML = '';
        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecast = forecastData.list[i];
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyForecastHTML += `
                <div class="weekly-item">
                    <span>${dayName}</span>
                    <span><i class="fas ${getWeatherIcon(forecast.weather[0].icon)}"></i></span>
                    <span>${Math.round(forecast.main.temp_max)}° / ${Math.round(forecast.main.temp_min)}°</span>
                </div>
            `;
        }

        weatherInfo.innerHTML = `
            <div class="main-weather">
                <div>
                    <h2>${city}</h2>
                    <div>Chance of rain: ${forecastData.list[0].pop * 100}%</div>
                    <div class="temperature">${temperature}°</div>
                </div>
                <div class="weather-icon"><i class="fas ${getWeatherIcon(icon)}"></i></div>
            </div>
            <div class="forecast">
                ${forecastHTML}
            </div>
            <div class="conditions">
                <div class="condition-item">
                    <span class="condition-icon"><i class="fas fa-temperature-low"></i></span>
                    <span>Real Feel<br>${feelsLike}°</span>
                </div>
                <div class="condition-item">
                    <span class="condition-icon"><i class="fas fa-wind"></i></span>
                    <span>Wind<br>${windSpeed} km/h</span>
                </div>
                <div class="condition-item">
                    <span class="condition-icon"><i class="fas fa-tint"></i></span>
                    <span>Chance of rain<br>${forecastData.list[0].pop * 100}%</span>
                </div>
                <div class="condition-item">
                    <span class="condition-icon"><i class="fas fa-sun"></i></span>
                    <span>UV Index<br>${uvIndex}</span>
                </div>
            </div>
            <div class="weekly-forecast">
                <h3>7-DAY FORECAST</h3>
                ${weeklyForecastHTML}
            </div>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = 'An error occurred while fetching weather data';
    }
}

document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});