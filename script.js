// DEPENDENCIES
var searchText = $("#searchCity");
var searchBtn = $("#searchBtn");
var jumbotron = $(".jumbotron");
var historyList = $("#history");


// VARIABLES
var owRequestURL = "https://api.openweathermap.org/data/2.5";
var requestForcast = "/forecast?q=";
var requestWeather = "/weather?q=";
var requestUVI = "/uvi?";
var requestID = "&appid=0e47a5193b5607e62acca851e1deefa1&units=imperial";
var cityName = "";
var searchHistory = [];



// FUNCTIONS
// Search for city inputed
function searchCity(event) {
    event.preventDefault();
    cityName = searchText.val();
    getWeather(cityName);
    getForcast(cityName);
}

// Fetch API data
function getWeather(city) {
    var weatherURL = owRequestURL + requestWeather + city + requestID;
    fetch(weatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setJumbotron(data);
            getUVIndex(data);
            storeCity(data.name)
            // console.log(data);
        });
}

// Set Jumbotron using information from OpenWeather data object
function setJumbotron(weather) {
    jumbotron.children("h1").text(weather.name);
    jumbotron.children("#temp").text("Temp: " + weather.main.temp + "℉");
    jumbotron.children("#wind").text("Wind: " + weather.wind.speed + " mph");
    jumbotron.children("#humid").text("Humid: " + weather.main.humidity + "%");
}
// Convert kelvin temp to farenheit
// function kToF(kelvin) {
//     return Math.round((kelvin - 273.15) * 9/5 + 32);
// }

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

// Stores city name in local storage
function storeCity(city) {
    if (searchHistory.includes(city)) {
        return;
    } else if (searchHistory.length >= 5) {
        searchHistory.unshift(city);
        searchHistory.pop();
        updateLocal();
        updateHistory()
    } else {
        searchHistory.unshift(city);
        updateLocal();
        updateHistory();
    }
}

// Update local storage info
function updateLocal() {
    localStorage.setItem("SearchHistory", JSON.stringify(searchHistory));
}

// Update history buttons
function updateHistory() {
    if (searchHistory.length) {
        historyList.text("");
        searchHistory = JSON.parse(localStorage.getItem("SearchHistory"));
        // Generate buttons and set event listener 
        for (i = 0; i < searchHistory.length; i++) {
            var cityBtn = $('<button type="button" class="list-group-item list-group-item-action"></button>');
            cityBtn.text(searchHistory[i]);
            historyList.append(cityBtn);
        }
        historyList.children("button").on("click", function(){
            getWeather($(this).text());
            getForcast($(this).text());
        });
    }
}


// Get forcast data from API
function getForcast(city) {
    var forcastURL = owRequestURL + requestForcast + city + requestID;
    fetch(forcastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setCards(data.list);
            // console.log(data);
        });
}

// Set cards using forcast data
function setCards(forcast) {
    var arrayIndex, card, date;
    for (i = 0; i < 5; i++){
        arrayIndex = 4 + i * 8;
        card = $("#day" + i);
        date = moment(forcast[arrayIndex].dt_txt).format("M/D/YYYY");
        card.children(".card-header").text(date);
        card.children(".card-body").children(".temp").text("Temp: " + forcast[arrayIndex].main.temp + "℉")
        card.children(".card-body").children(".wind").text("Wind: " + forcast[arrayIndex].wind.speed + " mph")
        card.children(".card-body").children(".humid").text("Humidity: " + forcast[arrayIndex].main.humidity + "%")
    }
}


// EVENT LISTENER
searchBtn.on("click", searchCity);



// INITIALIZATION
function init() {
    updateHistory();
}

init();