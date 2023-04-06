// API key for Open Weather Map
// For future reference, keys like this shouldn't be stored in a public repository
const openWeatherMapAPI = "e31abeb6338435ae6ad3ea19bb63561b";

// Get a set of lat/lon values for a city name
function getGeoCode(locationstring) {
  let geoCodeURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    locationstring +
    "&limit=1&appid=" +
    openWeatherMapAPI;

  let geoCodeResponse = fetch(geoCodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // let lat = data[0].lat;
      // let lon = data[0].lon;
      return data;
    });

  return geoCodeResponse;
}

// Get a 5-day forecast based on lattitude and longitude
function get5DayForecast(lat, lon) {
  let forecastURL =
    "api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    openWeatherMapAPI;

  let forecastResponse = fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });

  return forecastResponse();
}
