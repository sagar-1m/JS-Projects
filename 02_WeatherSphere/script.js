import dotenv from "dotenv"; // import the dotenv package
dotenv.config({ path: "./.env" }); // configure the dotenv package
document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const weatherConditionDisplay = document.getElementById("weather-condition");
  const errorMessage = document.getElementById("error-msg");

  const API_KEY = process.env.API_KEY; // this is the api key that i got from the openweathermap website, environment variables

  // first i want to get the city name from the input field when the user clicks the button of get weather
  getWeatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) return;
    console.log(city);

    // then i want to fetch the weather data from the api using the city name

    // server may throw you an error, so you need to handle that error
    // server/database is always in another continent, so it takes time to get the data

    try {
      const weatherData = await fetchWeatherData(city); // this is the data that i got from the api using the city name that the user entered
      displayWeatherData(weatherData);
    } catch (error) {
      showError();
    }
  });

  async function fetchWeatherData(city) {
    // fetch the weather data from the api
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`; // this is the url that i will use to fetch the data from the api using the city name that the user entered
    const response = await fetch(url); // this is the response that i got from the api
    console.log(typeof response); // object of type Response
    console.log("RESPONSE", response); // Response {type: "cors", url: "https://api.openweathermap.org/data/2.5/weather?q=cairo&units=metric&appid=74933eb539574d7ccf9d9104b8779904", redirected: false, status: 200, ok: true, …}

    if (!response.ok) {
      throw new Error(`Response status was not ok: ${response.status}`); // if the response status is not ok, then throw an error
    }

    const jsonData = await response.json(); // this is the json data that i got from the api
    return jsonData; // return the json data
  }

  function displayWeatherData(weatherData) {
    // display the weather data on the page
    console.log(weatherData);
    const { name, main, weather } = weatherData; // destructuring the weatherData object to get the name, main, and weather properties from it
    cityNameDisplay.textContent = name; // setting the text content of the cityNameDisplay to the name of the city
    temperatureDisplay.textContent = main.temp; // setting the text content of the temperatureDisplay to the temperature of the city
    weatherConditionDisplay.textContent = weather[0].description; // setting the text content of the weatherConditionDisplay to the weather condition of the city

    //unlocks the hidden class
    weatherInfo.classList.remove("hidden"); // remove the hidden class from the weatherInfo element to show the weather data on the page
    errorMessage.classList.add("hidden"); // add the hidden class to the errorMessage element to hide the error message on the page
  }

  function showError() {
    // show an error message on the page
    errorMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
  }
});
