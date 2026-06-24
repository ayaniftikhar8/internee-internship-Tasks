const apiKey = "e29fff52d652df1a66508b573ca8120f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const geoBtn = document.getElementById("geo-btn");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name.", "warning");
    return;
  }

  if (apiKey === "") {
    showMessage("Replace with your OpenWeatherMap API key in script.js.", "danger");
    return;
  }

  fetchWeather(city);
});

// Geolocation button
geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    geoBtn.disabled = true;
    geoBtn.textContent = "🔍 Detecting...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        geoBtn.disabled = false;
        geoBtn.textContent = "📍 Use My Location";
      },
      (error) => {
        showMessage(`Geolocation error: ${error.message}`, "warning");
        geoBtn.disabled = false;
        geoBtn.textContent = "📍 Use My Location";
      }
    );
  } else {
    showMessage("Geolocation is not supported by your browser.", "warning");
  }
});

async function fetchWeatherByCoords(lat, lon) {
  setLoading(true);
  try {
    const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error("Unable to fetch weather data.");
    }
    const data = await response.json();
    renderWeather(data);
    updateBackground(data);
  } catch (error) {
    showMessage(error.message, "danger");
  } finally {
    setLoading(false);
  }
}

async function fetchWeather(city) {
  setLoading(true);

  try {
    const response = await fetch(`${apiUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name and try again.");
      }
      throw new Error("Unable to fetch weather data. Please try again later.");
    }

    const data = await response.json();
    renderWeather(data);
    updateBackground(data);
  } catch (error) {
    showMessage(error.message, "danger");
  } finally {
    setLoading(false);
  }
}

function updateBackground(data) {
  const weather = (data.weather && data.weather[0]) || {};
  const main = weather.main || '';
  
  console.log('Weather condition:', main);
  
  let bg = '';
  
  if (main === 'Clear' || main === 'Sunny') {
    bg = 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)';
  } else if (main === 'Clouds' || main === 'Partly cloudy') {
    bg = 'linear-gradient(135deg, #A8A8A8 0%, #5A5A5A 100%)';
  } else if (main === 'Rain' || main === 'Drizzle') {
    bg = 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)';
  } else if (main === 'Snow') {
    bg = 'linear-gradient(135deg, #E3E8EF 0%, #B3B8C4 100%)';
  } else if (main === 'Thunderstorm') {
    bg = 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)';
  } else if (main === 'Mist' || main === 'Smoke' || main === 'Haze' || main === 'Dust' || main === 'Fog' || main === 'Sand') {
    bg = 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)';
  }
  
  if (bg) {
    document.body.style.background = bg;
    console.log('Background changed to:', bg);
  }
}

function svgToDataUrl(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getWeatherImageUrl(data) {
  const weather = (data.weather && data.weather[0]) || {};
  const condition = (weather.main || '').toLowerCase();
  const temp = data.main && typeof data.main.temp === 'number' ? data.main.temp : null;

  const images = {
    clear: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="24" fill="#FFD54F"/><g stroke="#F59E0B" stroke-width="8" stroke-linecap="round"><line x1="60" y1="12" x2="60" y2="28"/><line x1="60" y1="92" x2="60" y2="108"/><line x1="12" y1="60" x2="28" y2="60"/><line x1="92" y1="60" x2="108" y2="60"/><line x1="22" y1="22" x2="34" y2="34"/><line x1="86" y1="86" x2="98" y2="98"/><line x1="22" y1="98" x2="34" y2="86"/><line x1="86" y1="34" x2="98" y2="22"/></g></svg>`,
    clouds: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="68" rx="36" ry="24" fill="#CBD5E1"/><ellipse cx="44" cy="62" rx="24" ry="18" fill="#E2E8F0"/><ellipse cx="76" cy="62" rx="24" ry="18" fill="#E2E8F0"/></svg>`,
    rain: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="54" rx="34" ry="22" fill="#94A3B8"/><ellipse cx="44" cy="48" rx="22" ry="16" fill="#CDD6E0"/><ellipse cx="76" cy="48" rx="22" ry="16" fill="#CDD6E0"/><g stroke="#60A5FA" stroke-width="8" stroke-linecap="round"><line x1="48" y1="78" x2="48" y2="98"/><line x1="60" y1="78" x2="60" y2="98"/><line x1="72" y1="78" x2="72" y2="98"/></g></svg>`,
    thunderstorm: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="54" rx="34" ry="22" fill="#64748B"/><ellipse cx="44" cy="48" rx="22" ry="16" fill="#CBD5E1"/><ellipse cx="76" cy="48" rx="22" ry="16" fill="#CBD5E1"/><polygon points="58,70 70,70 62,88 74,88 60,108 64,90 56,90" fill="#FBBF24"/></svg>`,
    snow: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="54" rx="34" ry="22" fill="#E2E8F0"/><ellipse cx="44" cy="48" rx="22" ry="16" fill="#F1F5F9"/><ellipse cx="76" cy="48" rx="22" ry="16" fill="#F1F5F9"/><g stroke="#60A5FA" stroke-width="8" stroke-linecap="round"><line x1="60" y1="70" x2="60" y2="98"/><line x1="48" y1="78" x2="72" y2="90"/><line x1="72" y1="78" x2="48" y2="90"/></g></svg>`,
    mist: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><ellipse cx="60" cy="50" rx="34" ry="22" fill="#CBD5E1"/><ellipse cx="44" cy="44" rx="22" ry="16" fill="#E2E8F0"/><ellipse cx="76" cy="44" rx="22" ry="16" fill="#E2E8F0"/><g stroke="#94A3B8" stroke-width="8" stroke-linecap="round"><line x1="24" y1="88" x2="96" y2="88"/><line x1="30" y1="102" x2="90" y2="102"/><line x1="36" y1="76" x2="84" y2="76"/></g></svg>`,
    cold: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect x="10" y="10" width="100" height="100" rx="24" fill="#DBEAFE"/><g stroke="#2563EB" stroke-width="10" stroke-linecap="round"><line x1="60" y1="30" x2="60" y2="90"/><line x1="30" y1="60" x2="90" y2="60"/><line x1="40" y1="40" x2="80" y2="80"/><line x1="80" y1="40" x2="40" y2="80"/></g></svg>`
  };

  if (condition === 'clouds') {
    return svgToDataUrl(images.clouds);
  }

  if (condition === 'rain' || condition === 'drizzle') {
    return svgToDataUrl(images.rain);
  }

  if (condition === 'thunderstorm') {
    return svgToDataUrl(images.thunderstorm);
  }

  if (condition === 'snow') {
    return svgToDataUrl(images.snow);
  }

  if (condition === 'mist' || condition === 'smoke' || condition === 'haze' || condition === 'dust' || condition === 'fog' || condition === 'sand') {
    return svgToDataUrl(images.mist);
  }

  if (temp !== null && temp <= 10) {
    return svgToDataUrl(images.cold);
  }

  if (condition === 'clear') {
    return svgToDataUrl(images.clear);
  }

  return weather.icon ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png` : '';
}

function renderWeather(data) {
  const weather = (data.weather && data.weather[0]) || {};
  const iconUrl = getWeatherImageUrl(data);
  const temp = data.main && typeof data.main.temp === 'number' ? data.main.temp.toFixed(1) : '';
  const feels = data.main && typeof data.main.feels_like === 'number' ? data.main.feels_like.toFixed(1) : '';
  const humidity = data.main && typeof data.main.humidity === 'number' ? data.main.humidity : '';
  const wind = data.wind && typeof data.wind.speed === 'number' ? data.wind.speed.toFixed(1) : '';
  const pressure = data.main && typeof data.main.pressure === 'number' ? data.main.pressure : '';
  const visibility = typeof data.visibility === 'number' ? (data.visibility / 1000).toFixed(1) : '';
  const sunrise = data.sys ? formatTime(data.sys.sunrise, data.timezone) : '';
  const sunset = data.sys ? formatTime(data.sys.sunset, data.timezone) : '';

  weatherResult.innerHTML = `
    <div class="card border-primary">
      <div class="card-body">
        <h2 class="card-title">${data.name || ''}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}</h2>
        <p class="card-text text-muted text-capitalize">${weather.description || ''}</p>
        <div class="d-flex align-items-center gap-3">
          ${iconUrl ? `<img src="${iconUrl}" alt="${weather.description}">` : ''}
          <div>
            <p class="fs-1 mb-0">${temp ? temp + '°C' : ''}</p>
            <p class="mb-1">Feels like ${feels ? feels + '°C' : ''}</p>
            <p class="mb-0">Humidity: ${humidity ? humidity + '%' : ''}</p>
            <p class="mb-0">Wind: ${wind ? wind + ' m/s' : ''}</p>
            <p class="mb-0">Pressure: ${pressure ? pressure + ' hPa' : ''}</p>
            <p class="mb-0">Visibility: ${visibility ? visibility + ' km' : ''}</p>
            <p class="mb-0">Sunrise: ${sunrise}</p>
            <p class="mb-0">Sunset: ${sunset}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showMessage(message, type = "info") {
  weatherResult.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
}

function setLoading(isLoading) {
  if (isLoading) {
    weatherResult.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>
        <span>Loading weather...</span>
      </div>
    `;
  }
}

// Helpers
function formatTime(unixSec, tzOffsetSeconds) {
  if (!unixSec) return '';
  // Shift by timezone offset then format using UTC to get local time for the city
  const dt = new Date((unixSec + (tzOffsetSeconds || 0)) * 1000);
  return dt.toUTCString().split(' ')[4]; // HH:MM:SS
}

// Clean stray references if any
// (previous accidental token removed)