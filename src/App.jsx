import clouds from './assets/clouds.png';
import cloudyNight from './assets/cloudy-night.png';
import moon from './assets/crescent-moon.png';
import drizzle from './assets/drizzle.png';
import fog from './assets/fog.png';
import rain from './assets/rain.png';
import search from './assets/search.png';
import snow from './assets/snow.png';
import sun from './assets/sun.png';
import Axios from 'axios';
import { useState } from 'react';

export default function App() {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isDay, setIsDay] = useState(true);

  async function getWeatherData(e) {
    e.preventDefault();
    const cityInput = e.target.elements.city.value;
    if (!cityInput) {
      setError("Please enter a city name");
      return;
    }

    try {
      const res = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${API_KEY}&units=metric`);

      // error handling for the API if it returns success even if the city is not found
      if (res.data.cod === "404") {
        setError("City not found. Please try again");
        setWeatherData(null);
        return;
      }

      if (res.data.weather[0].icon.endsWith("d")) {
        setIsDay(true);
      } else {
        setIsDay(false);
      }

      setWeatherData(res.data);
      setCity(cityInput);
      console.log(res.data);
    } catch (error) {
      // error handling for axios
      if (error.response && error.response.status === 404) {
        setError("City not found. Please check the spelling.");
      } else {
        setError("Unable to fetch data. Please check your internet connection.");
      }
      
      setWeatherData(null);
    }
  }

  function getWeatherIcon(weather) {
    switch (weather) {
      case "Thunderstorm":
        return drizzle;
      case "Drizzle":
        return drizzle;
      case "Rain":
        return rain;
      case "Snow":
        return snow;
      case "Clear":
        return isDay ? sun : moon;
      case "Clouds":
        return isDay ? clouds : cloudyNight;;
      case "Fog":
        return fog;
    }
  }

  return (
    <div className={`w-[90%] max-w-lg  text-white mx-auto rounded-3xl py-10 px-9 text-center ${isDay ? "bg-gradient-to-br from-blue-600 via-blue-900 to-blue-900" : "bg-gradient-to-br from-blue-800 via-blue-950 to-blue-950"}`}>
      <form onSubmit={getWeatherData}
       className="relative w-full flex">
        <input
         type="text" 
         placeholder="Abuja" 
         spellCheck="false"
         name="city"
         className="flex-1 bg-white text-neutral-800 px-6 py-2.5 h-14 rounded-full outline-none border-none" />
        <button
        type='submit'
         className="absolute top-3 right-3 p-2 cursor-pointer border-none outline-none">
          <img src={search} alt="search icon" className="w-4" />
        </button>
      </form>

      {error && 
        <div
          className="text-left ml-2.5 text-sm mt-2.5">
          <p>{error}</p>
        </div>
      }
      
      {weatherData &&
        <div className='flex flex-col items-center'>
          <img src={getWeatherIcon(weatherData?.weather[0].main)} alt="weather icon" className="size-32 my-6" />
          <div className="text-3xl font-normal mb-2.5">{weatherData?.weather[0].main}</div>
          <div className="text-7xl">{weatherData?.main.temp}°C</div>
          <div className="text-5xl mt-3.5">{city}</div>
        </div>
      }
    </div>
  )
}