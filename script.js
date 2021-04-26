// DEPENDENCIES


// VARIABLES
var owRequestURL = "http://api.openweathermap.org/data/2.5";
var requestParam = "/forecast?q=new york city"
var requestID = "&appid=0e47a5193b5607e62acca851e1deefa1"

var weatherURL = owRequestURL + requestParam + requestID;


// FUNCTIONS
// Fetch API data
fetch(weatherURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });
