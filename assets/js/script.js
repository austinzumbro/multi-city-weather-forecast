// Declare elements
const body = document.body;
const header = document.createElement("header");
header.setAttribute("class", "row p-3 text-bg-dark bg-gradient");

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

const main = document.createElement("main");
main.setAttribute(
  "class",
  "row align-content-start p-4 bg-dark-subtle min-vh-100"
);
main.setAttribute("id", "main-section");

// Construct the Search Column
const colSearchRow = document.createElement("div");
colSearchRow.setAttribute("class", "row align-content-start");
const colSearch = document.createElement("section");
colSearch.setAttribute("class", "d-flex col-md-3 p-3");
colSearch.setAttribute("id", "search-form-section");
const colSearchForm = document.createElement("form");
colSearchForm.setAttribute("class", "form col-3 col-md-12");
const colSearchFormH2 = document.createElement("h2");
colSearchFormH2.textContent = "Search for a City:";
const colSearchFormInput = document.createElement("input");
colSearchFormInput.setAttribute("class", "form-control mb-3 w-100");
const colSearchFormSubmit = document.createElement("button");
colSearchFormSubmit.setAttribute("class", "btn btn-primary mb-3 w-100");
colSearchFormSubmit.setAttribute("id", "search-button");
colSearchFormSubmit.textContent = "Search";
const colSearchHR = document.createElement("hr");
colSearchHR.setAttribute("class", "col-4");
const colSearchPastSearch = document.createElement("section");
colSearchPastSearch.setAttribute("id", "past-searches");
colSearchPastSearch.setAttribute(
  "class",
  "d-flex flex-wrap justify-content-center col-9 col-md-12"
);

colSearchForm.appendChild(colSearchFormH2);
colSearchForm.appendChild(colSearchFormInput);
colSearchForm.appendChild(colSearchFormSubmit);
colSearchRow.appendChild(colSearchForm);
colSearchRow.appendChild(colSearchPastSearch);
colSearch.appendChild(colSearchRow);

// Construct the Weather Column
const colWeather = document.createElement("section");
colWeather.setAttribute("class", "col-12 col-md-9 p-3");
colWeather.setAttribute("id", "forecast-section");
// Current weather
const colWeatherCurrent = document.createElement("section");
colWeatherCurrent.setAttribute("class", "container border p-3 mb-3 text-bg-light");
colWeatherCurrent.innerHTML = "<h2>Weather will display here.</h2><p>Enter a city in the search bar, or select one of the past searches.</p>"
const colWeatherCurrentH2 = document.createElement("h2");
colWeatherCurrentH2.textContent = "Placeholder City Name and Date";
const colWeatherCurrentStats = document.createElement("div");
// 5-Day Forecast
const colWeatherForecast = document.createElement("section");
colWeatherForecast.setAttribute("class", "container py-3");
const colWeatherForecastH2 = document.createElement("h3");
colWeatherForecastH2.textContent = "5-Day Forecast:";

const colWeatherForecastCardRow = document.createElement("div");
colWeatherForecastCardRow.setAttribute("class", "row");

colWeather.appendChild(colWeatherCurrent);
colWeather.appendChild(colWeatherForecast);

main.appendChild(colSearch);
main.appendChild(colWeather);

body.appendChild(header);
body.appendChild(main);

// 10 most-populated cities for page load
let initialCityList = [
  "New York City",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
];

let cityList = [];

// Helper functions

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
  let average = sum / arr.length;
  let roundedAverage = Math.round(average * 100) / 100;
  return roundedAverage;
}

// Take arrays stored in an object, average them, and
// store the average in a new key.
// Currently used while averaging the every-3-hour response
// from the 5-day forecast API
function avgForecastArrays(obj) {
  for (let x in obj) {
    if (typeof obj[x][0] === "number") {
      let newKey = x + "Avg";
      obj[newKey] = arrayAverage(obj[x]);
    }
  }
}

// Open Weather API

// API key for Open Weather Map
// For future reference, keys like this shouldn't be stored in a public repository
const openWeatherMapAPI = "e31abeb6338435ae6ad3ea19bb63561b";

// Get a set of lat/lon values for a city name
function getWeatherData(locationstring) {
  // Clear containers
  colWeatherCurrent.innerHTML = "";
  colWeatherForecast.innerHTML = "";
  colWeatherForecastCardRow.innerHTML = "";
  colWeatherCurrentStats.innerHTML = "";

  // Construct the GeoCode API url
  let geoCodeURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    locationstring +
    "&limit=1&appid=" +
    openWeatherMapAPI;

  // Get the GeoCode
  fetch(geoCodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Parse lat and lon, use them to get weather data
      let lat = data[0].lat;
      let lon = data[0].lon;
      getCurrentWeather(lat, lon);
      get5DayForecast(lat, lon);
    });
}

// Get current weather
function getCurrentWeather(lat, lon) {
  // Construct the URL string
  let currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    openWeatherMapAPI +
    "&units=imperial";


  fetch(currentWeatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Parse data into variables, then append to page
      // Convert date from unix
      let date = dayjs.unix(data.dt);
      let day = date.format("M/D/YYYY");
      let name = data.name;
      let icon = data.weather[0].icon;
      let iconURL = "https://openweathermap.org/img/wn/" + icon + "@4x.png";
      let h2string =
        name + " (" + day + ") <img class='icon' src='" + iconURL + "'>";

      colWeatherCurrentH2.innerHTML = h2string;

      let temp = data.main.temp;
      let wind = data.wind.speed;
      let humidity = data.main.humidity;

      let tempP = document.createElement("p");
      let windP = document.createElement("p");
      let humidityP = document.createElement("p");

      tempP.innerHTML = "Temp: " + temp + " &#176;F";
      windP.innerHTML = "Wind: " + wind + " MPH";
      humidityP.innerHTML = "Humidity: " + humidity + "%";

      colWeatherCurrentStats.appendChild(tempP);
      colWeatherCurrentStats.appendChild(windP);
      colWeatherCurrentStats.appendChild(humidityP);
      colWeatherCurrent.appendChild(colWeatherCurrentH2);
      colWeatherCurrent.appendChild(colWeatherCurrentStats);
    });
}

// Get a 5-day forecast
function get5DayForecast(lat, lon) {
  // Build the URL string
  let forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    openWeatherMapAPI +
    "&units=imperial";

  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Narrow in on the relevant data
      let forecastList = data.list;
      // Because multiple sets of data are available
      // for each day, initialize an object where we
      // can store and average each day's data.
      let forecastObject = {};
      for (let i = 0; i < forecastList.length; i++) {
        // Parse data and assign to variables
        let date = dayjs.unix(forecastList[i].dt);
        let day = date.format("M/D/YYYY");
        let today = dayjs().format("M/D/YYYY");
        // Filter out data related to "today"
        // We already have this information in Current Weather
        if (day !== today) {
          let time = date.format("ha");
          time = time.substring(0, time.length - 1);
          let temp = forecastList[i].main.temp;
          let windSpeed = forecastList[i].wind.speed;
          let humidity = forecastList[i].main.humidity;
          let icon = forecastList[i].weather[0].icon;

          // Construct the Object with days as keys
          // If the "day as key" does not already exist,
          // create it. If it does exist, update it.
          if (!forecastObject.hasOwnProperty(day)) {
            forecastObject[day] = {
              tempArray: [temp],
              windArray: [windSpeed],
              humidityArray: [humidity],
              iconArray: [[time, icon]],
            };
          } else {
            forecastObject[day].tempArray.push(temp);
            forecastObject[day].windArray.push(windSpeed);
            forecastObject[day].humidityArray.push(humidity);
            forecastObject[day].iconArray.push([time, icon]);
          }
        }
      }
      for (let x in forecastObject) {
        // Iterate over the object and get relevant averages.
        avgForecastArrays(forecastObject[x]);
      }
      // Build the cards and append them to the page.
      constructCards(forecastObject);
    });
}

// Card constructor
function constructCards(obj) {
  let cardHeaders = Object.keys(obj);
  for (let i = 0; i < cardHeaders.length; i++) {
    let key = cardHeaders[i];
    let card = document.createElement("div");
    card.setAttribute("class", "card custom-card py-2 m-2 text-bg-dark");

    // Put the date in the header
    let header = document.createElement("h3");
    header.textContent = key;

    // Create the table of times and icons
    let iconTable = document.createElement("table");
    let timeRow = document.createElement("tr");
    let iconRow = document.createElement("tr");
    let iconArray = obj[key].iconArray;
    for (let j = 0; j < iconArray.length; j++) {
      let timeCell = document.createElement("td");
      timeCell.textContent = iconArray[j][0];
      timeRow.appendChild(timeCell);
      let iconCell = document.createElement("td");
      iconCell.innerHTML =
        "<img src='https://openweathermap.org/img/wn/" +
        iconArray[j][1] +
        ".png'>";
      iconRow.appendChild(iconCell);
    }
    iconTable.appendChild(timeRow);
    iconTable.appendChild(iconRow);

    let temp = obj[key].tempArrayAvg;
    let wind = obj[key].windArrayAvg;
    let humidity = obj[key].humidityArrayAvg;

    let tempP = document.createElement("p");
    let windP = document.createElement("p");
    let humidityP = document.createElement("p");

    tempP.innerHTML = "Temp: " + temp + " &#176;F";
    windP.innerHTML = "Wind: " + wind + " MPH";
    humidityP.innerHTML = "Humidity: " + humidity + "%";

    card.appendChild(header);
    card.appendChild(iconTable);
    card.appendChild(tempP);
    card.appendChild(windP);
    card.appendChild(humidityP);
    colWeatherForecastCardRow.appendChild(card);
    colWeatherForecast.appendChild(colWeatherForecastH2);
    colWeatherForecast.appendChild(colWeatherForecastCardRow);
  }
}

// Build and append a list of buttons based on an array of cities.
function buildPastSearchList(array) {
  colSearchPastSearch.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    let cityButton = document.createElement("button");
    cityButton.setAttribute(
      "class",
      "btn btn-secondary my-1 mx-2 col-3 col-md-12"
    );
    cityButton.setAttribute("data-attribute", array[i]);
    cityButton.textContent = array[i];
    colSearchPastSearch.appendChild(cityButton);
  }
}

// Execute the build.
if (localStorage.getItem("cityList")) {
  let pastData = localStorage.getItem("cityList");
  cityList = JSON.parse(pastData);
  buildPastSearchList(cityList);
} else {
  cityList = initialCityList;
  buildPastSearchList(cityList);
}

// When the search form is submitted, get the weather data,
// update the page, update the city array and rebuild the 
// button list.
colSearchFormSubmit.addEventListener("click", function (element) {
  element.preventDefault();
  let city = colSearchFormInput.value;
  getWeatherData(city);
  cityList.pop();
  cityList.unshift(city);
  localStorage.setItem("cityList", JSON.stringify(cityList));
  buildPastSearchList(cityList);
});

// When a "past search" is clicked, get the weather data and 
// update the page.
colSearchPastSearch.addEventListener("click", function (event) {
  let element = event.target;
  if (element.getAttribute("data-attribute")) {
    let city = element.getAttribute("data-attribute");
    getWeatherData(city);
  }
});


localStorage.setItem("cityList", JSON.stringify())