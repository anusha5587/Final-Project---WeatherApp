function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekdays[date.getDay()];

  return `${day}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function forecastingReport(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecastreport");

  let forecastHTML = `<div class="row-col-1">
 <table class="dailytable">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<tr>
          <td id="days">${formatDay(forecastDay.dt)}
          </td>
          <td>
           <img src="https://openweathermap.org/img/wn/${
             forecastDay.weather[0].icon
           }@2x.png" width="30px" />
           </td>
           <td class="numbers">
               <span class="dailyMinTemp">${Math.round(forecastDay.temp.max)}
              </span> °C </td>
              
              <td class="numbers">
                <span class="dailyMaxTemp">${Math.round(forecastDay.temp.max)}
              </span> °C </td>
         </tr>`;
    }
  });
  forecastHTML = forecastHTML + `</table></div>`;
  forecastElement.innerHTML = forecastHTML;
}

function dailyForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "50fa4024e3b1d5eac2f51ab18a47e997";
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrlForecast);
  axios.get(apiUrlForecast).then(forecastingReport);
}

function formatHour(timestamp) {
  let date = new Date(timestamp * 1000);
  let timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  date = new Date(date.getTime() + timezoneOffset);
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let formattedTime = `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
}

function hourlyReport(response) {
  let forecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector(".weather-table");
  let hourlyForecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastHour, index) {
    if (index < 6) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `<div class="col-2">
        <div class="weather-table-time">${formatHour(forecastHour.dt)}</div>
          <img src="https://openweathermap.org/img/wn/${
            forecastHour.weather[0].icon
          }@2x.png" width="30px"/>
          <div class="weather-table-temp">${Math.round(
            forecastHour.temp
          )}°C</div>
            <div class="weather-table-feelslike">Feels like ${Math.round(
              forecastHour.feels_like
            )}°C</div>
      </div>
    `;
    }
  });

  hourlyForecastHTML = hourlyForecastHTML + `</div>`;
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

function hourlyForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "50fa4024e3b1d5eac2f51ab18a47e997";
  let apiUrlHourly = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrlHourly).then(hourlyReport);
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#tempNumber");
  let cityElement = document.querySelector("#city");
  let feelsLikeElement = document.querySelector("#feelsLike");
  let windSpeedElement = document.querySelector("#windSpeed");
  let datetimeElement = document.querySelector("#datetime");
  let maxtempElement = document.querySelector("#maxtemperature");
  let mintempElement = document.querySelector("#mintemperature");
  let iconElement = document.querySelector("#icon");
  let descriptionElement = document.querySelector("#description");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;

  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  console.log(response.data.main.temp);
  windSpeedElement.innerHTML = response.data.wind.speed;
  datetimeElement.innerHTML = formatDate(response.data.dt * 1000);
  maxtempElement.innerHTML = Math.round(response.data.main.temp_max);
  mintempElement.innerHTML = Math.round(response.data.main.temp_min);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  descriptionElement.innerHTML = response.data.weather[0].description;
  if (response.data.weather[0].main.includes("Clouds")) {
    setVideoBackground("images/Clouds.mp4");
  } else if (response.data.weather[0].main.includes("Thunderstorm")) {
    setVideoBackground("images/thunderstorm.mp4");
  } else if (response.data.weather[0].main.includes("Drizzle")) {
    setVideoBackground("images/Drizzle.mp4");
  } else if (response.data.weather[0].main.includes("Rain")) {
    setVideoBackground("images/Raining.mp4");
  } else if (response.data.weather[0].main.includes("Snow")) {
    setVideoBackground("images/snow.mp4");
  } else if (response.data.weather[0].main.includes("Fog", "Mist")) {
    setVideoBackground("images/fog.mp4");
  } else if (response.data.weather[0].main.includes("Clear")) {
    setVideoBackground("images/Clear_skyies.mp4");
  }
  dailyForecast(response.data.coord);
  hourlyForecast(response.data.coord);
}

function setVideoBackground(videoUrl) {
  let videoElement = document.createElement("video");
  videoElement.src = videoUrl;
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.id = "background-video";
  document.body.appendChild(videoElement);
}

function clearBackground() {
  let videoElement = document.getElementById("background-video");
  if (videoElement) {
    videoElement.parentNode.removeChild(videoElement);
  }
}

function search(city) {
  let apiKey = "50fa4024e3b1d5eac2f51ab18a47e997";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function searchingCity(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#cityInput");
  search(cityInputElement.value);
}

function weatherDataByGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let apiKey = "50fa4024e3b1d5eac2f51ab18a47e997";
      let apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      axios.get(apiUrlCurrent).then(displayTemperature);
    });
  }
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#tempNumber");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displaycelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#tempNumber");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", searchingCity);
let currentlocation = document.querySelector("#current-location-btn");
currentlocation.addEventListener("click", weatherDataByGeolocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displaycelsiusTemp);

search("London");
