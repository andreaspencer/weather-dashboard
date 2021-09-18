var cityInput= document.querySelector('#city-input');
var cityBtn= document.querySelector('#search-btn');
var cityNameEl= document.querySelector('#city-name');
var cityArr = [];

var formHandler = function(event) {
    var selectCity = cityInput.ariaValueMax.trim()

    if (selectedCity) {
        getCoords(selectedCity);
        cityInput.value = '';
    } else {
        textInput("Please enter a city!");
    };
};

var getCoords = function(city) {
    var currentWeatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=e4ab7318fab329c7de8c4fd9dd5056d7";

    fetch(currentWeatherApi).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat'];
                getCityForecast(city,lon,lat);

                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
            });
        } else{
            textInput("Error: " + response.statusText)
        }
    })
    .catch(function(error) {
        textInput("Unable to load weather.");
    })
}

