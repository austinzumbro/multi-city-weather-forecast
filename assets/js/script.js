// API key for Open Weather Map
const openWeatherMapAPI = "e31abeb6338435ae6ad3ea19bb63561b";

function getGeoCode(locationstring) {
  let geoCodeURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    locationstring +
    "&appid=" +
    openWeatherMapAPI;

  fetch(geoCodeURL).then(function (response) {
    console.log(response.json());
  });
}
