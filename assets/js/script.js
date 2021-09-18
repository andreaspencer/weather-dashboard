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

var getCityForecast = function(city, lon, lat) {
    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=e4ab7318fab329c7de8c4fd9dd5056d7";

    fetch(oneCallApi).then(function(response) {
        response.json().then(function(data) {
            cityNameEl.textContent = city + (moment().format("MM/DD/YYYY"));

            currentForecast(data);
            fiveDayForecast(data);
        });
    })
}

var displayTemp = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
}

var currentForecast = function(forecast) {

    var forecastEl = document.querySelector('.city-forecast');
    forecastEl.classList.remove('hide');

    var weatherIconEl= document.querySelector('#today-icon');
    var currentIcon = forecast.current.weather[0].icon;
    weatherIconEl.setAttribute('src', "http://openweathermap.org/img/wn/" + currentIcon + ".png");
    weatherIconEl.setAttribute('alt', forecast.daily[0].main)

    displayTemp("#current-temp", forecast.current["temp"]);

    var currentHumidityEl = document.querySelector("#current-humidity");
    currentHumidityEl.textContent = forecast.current['humidity'];

    var currentWindEl = document.querySelector('#current-wind-speed');
    currentHumidityEl.textContent = forecast.current['wind-speed'];

    var uviEl = document.querySelector('#current-uvi');
    var currentUVI = forecast.current["uvi"];
    uviel.textContent = currentUvi;

    switch (true) {
        case (currentUvi <=2):
            uviEl.className = 'badge badge-success';
            break;
        case(currentUvi <= 5):
            uviEl.className= "badge badge-warning";
            break;
        case (currentUvi <=7):
            uviEl.className = "badge badge-danger";
            break;
        default:
            uviEl.className = 'badge text-light';
            uviEl.setAttribute('style', 'background-color: #553C7B');
    }
}

var fiveDayForecast = function(forecast) {
    for (var i=1; i < 6; i++) {
        var dateP = document.querySelector('#date-' +i);
        dateP.textContent = moment().add(i, "days").format("MM/DD/YYYY");

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode= forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', "http://openweathermap.org/img/wn/" + iconCode + ".png");
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;

        var windSpan = document.querySelector('#wind-speed-' + i);
        windSpan.textContent = forecast.daily[i].wind-speed;

        var uviSpan = document.querySelector("#uvi-" + i);
        uviSpan.textContent = forecast.daily[i].uvi;
    }
}

var saveCity = function(city) {
    for (var i= 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr));
}

var loadCities = function() {
    cityArr = JSON.parse(localStorage.getItem('cities'));

    if (!cityArr) {
        cityArr = [];
        return false;
    } else if (cityArr.length > 5) {
        cityArr.shift();
    }


}