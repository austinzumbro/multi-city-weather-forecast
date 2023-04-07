// Helper functions
//
// Return the average of the values in an array
// Currently used to average the every-3-hour response
// from the 5-day forecast API
function arrayAverage(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "number") {
      sum += arr[i];
    }
  }
  return sum / arr.length;
}

// Take arrays stored in an object, average them, and
// store the average in a new key.
// Currently used while averaging the every-3-hour response
// from the 5-day forecast API
function avgForecastArrays(obj) {
  for (let x in obj) {
    let newKey = x + "Avg";
    obj[newKey] = arrayAverage(obj[x]);
  }
}

// Open Weather API
//
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
      let lat = data[0].lat;
      let lon = data[0].lon;
      getCurrentWeather(lat, lon);
      get5DayForecast(lat, lon);
    });
}

// Get current weather
// This works
function getCurrentWeather(lat, lon) {
  let currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    openWeatherMapAPI;

  fetch(currentWeatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // This works!  TODO: populate the HTML
      console.log("Current Weather Response\n*****************");
      console.log(data);
    });
}

// Get a 5-day forecast based on latitude and longitude
function get5DayForecast(lat, lon) {
  let forecastURL =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
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
      let forecastList = data.list;
      let forecastObject = {};
      for (let i = 0; i < forecastList.length; i++) {
        let date = forecastList[i].dt_txt;
        date = date.split(" ")[0];
        let temp = forecastList[i].main.temp;
        let windSpeed = forecastList[i].wind.speed;
        let humidity = forecastList[i].main.humidity;
        if (!forecastObject.hasOwnProperty(date)) {
          forecastObject[date] = {
            tempArray: [temp],
            windArray: [windSpeed],
            humidityArray: [humidity],
          };
        } else {
          forecastObject[date].tempArray.push(temp);
          forecastObject[date].windArray.push(windSpeed);
          forecastObject[date].humidityArray.push(humidity);
        }
      }
      for (let x in forecastObject) {
        avgForecastArrays(forecastObject[x]);
      }
      console.log(forecastObject);
    });
}

function dedupeIntoObject(arr) {
  let newObject = {};
  for (let i = 0; i < arr.length; i++) {
    if (!newObject.hasOwnProperty(arr[i])) {
      newObject[arr[i]] = [];
    }
  }
  return newObject;
}

// Construct the DOM
// Declare level elements
const body = document.body;
const header = document.createElement("header");
header.setAttribute("class", "row p-3 text-bg-dark");

const headerCol1 = document.createElement("div");
const headerCol2 = document.createElement("div");
headerCol1.setAttribute("class", "col-3");
headerCol2.setAttribute("class", "col-9");

const title = document.createElement("h1");
title.setAttribute("class", "text-center");
title.textContent = "Multi-City Weather Forecast";
headerCol2.appendChild(title);

header.appendChild(headerCol1);
header.appendChild(headerCol2);

const sectionMain = document.createElement("section");
sectionMain.setAttribute("class", "container row p-4");
sectionMain.setAttribute("id", "main-section");

// Construct the Search Column
const colSearch = document.createElement("section");
colSearch.setAttribute("class", "col-3 p-3");
const colSearchForm = document.createElement("form");
const colSearchFormH2 = document.createElement("h2");
colSearchFormH2.textContent = "Search for a City:";
const colSearchFormInput = document.createElement("input");
colSearchFormInput.setAttribute("class", "form-control mb-3 w-100");
const colSearchFormSubmit = document.createElement("button");
colSearchFormSubmit.setAttribute("class", "btn btn-primary mb-3 w-100");
colSearchFormSubmit.setAttribute("id", "search-button");
colSearchFormSubmit.textContent = "Search";

colSearchForm.appendChild(colSearchFormH2);
colSearchForm.appendChild(colSearchFormInput);
colSearchForm.appendChild(colSearchFormSubmit);
colSearch.appendChild(colSearchForm);

// Construct the Weather Column
const colWeather = document.createElement("section");
colWeather.setAttribute("class", "col");
// Current weather
const colWeatherCurrent = document.createElement("section");
colWeatherCurrent.setAttribute("class", "container border");
const colWeatherCurrentH2 = document.createElement("h2");
colWeatherCurrentH2.textContent = "Placeholder City Name and Date";
const colWeatherCurrentStats = document.createElement("div");
colWeatherCurrent.appendChild(colWeatherCurrentH2);
colWeatherCurrent.appendChild(colWeatherCurrentStats);
// 5-Day Forecast
const colWeatherForecast = document.createElement("section");
colWeatherForecast.setAttribute("class", "container");
const colWeatherForecastH2 = document.createElement("h3");
colWeatherForecastH2.textContent = "5-Day Forecast:";
colWeatherForecast.appendChild(colWeatherForecastH2);

colWeather.appendChild(colWeatherCurrent);
colWeather.appendChild(colWeatherForecast);

sectionMain.appendChild(colSearch);
sectionMain.appendChild(colWeather);

body.appendChild(header);
body.appendChild(sectionMain);

colSearchFormSubmit.addEventListener("click", function (element) {
  element.preventDefault();
  let city = colSearchFormInput.value;
  let geoCode = getGeoCode(city);
});
