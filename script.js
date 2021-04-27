// DEPENDENCIES
var searchText = $("#searchCity");
var searchBtn = $("#searchBtn");
var jumbotron = $(".jumbotron");


// VARIABLES
var owRequestURL = "https://api.openweathermap.org/data/2.5";
var requestForcast = "/forecast?q=";
var requestWeather = "/weather?q=";
var requestUVI = "/uvi?";
var requestID = "&appid=0e47a5193b5607e62acca851e1deefa1";
var cityName = "";




// FUNCTIONS
// Search for city inputed
function searchCity(event) {
    event.preventDefault();
    getWeather(searchText.val());
    console.log(searchText.val());
}

// Fetch API data
function getWeather(city) {
    var weatherURL = owRequestURL + requestWeather + city + requestID;
    var forcastURL = owRequestURL + requestForcast + city + requestID;
    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setJumbotron(data);
            getUVIndex(data);
            // console.log(data);
        });
}

// Set Jumbotron using information from OpenWeather data object
function setJumbotron(weather) {
    jumbotron.children("h1").text(weather.name);
    jumbotron.children("#temp").text("Temp: " + kToF(weather.main.temp) + "℉");
    jumbotron.children("#wind").text("Wind: " + weather.wind.speed + " mph");
    jumbotron.children("#humid").text("Humid: " + weather.main.humidity + "%");
}
// Convert kelvin temp to farenheit
function kToF(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}
// Get UV index using city lon+lat values
function getUVIndex(weather) {
    var lon = "lon=" + weather.coord.lon;
    var lat = "&lat=" + weather.coord.lat;
    var UVIndexURL = owRequestURL + requestUVI + lon + lat + requestID;
    fetch(UVIndexURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Set UV index in jumbotron
            // 0-2 Favorable, 3-5 moderate, 6+ severe
            jumbotron.children("#uvInd").text("UV Index: " + data.value);
            // console.log(data);
        });
}

function setForcast(forcast) {

}


// EVENT LISTENER
searchBtn.on("click", searchCity);

