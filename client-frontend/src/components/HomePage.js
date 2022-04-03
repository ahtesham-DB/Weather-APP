import React, { useEffect, useState, useRef } from "react";
import "./homepage.css";
import axios from "axios";
import Autocomplete from "react-google-autocomplete";
import utils from "../utils/countryCodes.json";

//For test and Developemt Please Use Env File to store API KEYS  URLS
const baseURL = "https://weather-app-db-new.herokuapp.com/postWeatherApi";

//For test and Developemt Please Use Env File to store API KEYS

function HomePage() {
  const [city, setCity] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [searchTarm, setSearchTarm] = useState("city");
  const [cuntryCode, setCuntryCode] = useState(null);

  const [weatherData, setWatherData] = useState({
    weatherFahrenheit: 85.98,
    weatherCelsiusL: "29.99",
    weatherDescription: "smoke",
    country: "IN",
    city: "Mumbai",
  });

  let notificationBar = useRef(null);

  const searchBtnHandler = (e) => {
    if (!inputValue) {
      notificationBar.current.style.display = "block";
      notificationBar.current.innerHTML =
        "<p>Please enter City ZipCode or City Name </p>";
      return;
    }

    axios
      .post(baseURL, {
        data:
          searchTarm === "city"
            ? `${searchTarm}_${city}`
            : `${searchTarm}_${inputValue}_${cuntryCode}`,
      })
      .then((response) => {
        // console.log(inputValue);
        setWatherData(response.data);
        // console.log(response.status);
        if (response.status === 201) {
          // console.log(response.status);

          notificationBar.current.style.display = "none";
          notificationBar.current.innerHTML = null;
        }
        // console.log("homepage data res", response);
      })
      .catch(function (error) {
        // console.log(error);
        if (error.response.status > 300) {
          notificationBar.current.style.display = "block";
          notificationBar.current.innerHTML =
            "<p>Please enter correct City Name Or City ZipCode</p>";
        }
      });
  };
  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const setCuntryCodeHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setCuntryCode(event.target.value.toLowerCase());
    // console.log(cuntryCode);
  };

  const setSearchType = (et) => {
    et.preventDefault();
    setSearchTarm(et.target.value);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(setLatLong, showError);
    } else {
      notificationBar.current.style.display = "block";
      notificationBar.current.innerHTML =
        "<p>Browser doesn't Support Geolocation</p>";
    }

    // SET USER'S POSITION
    function setLatLong(position) {
      // console.log("lll");
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      // let api = `${baseURL}${latitude},${longitude}`
      let api = `https://weather-app-db-new.herokuapp.com/get`;
      // let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid={id here};
      console.log(latitude + " " + longitude);
      axios
        .get(api, { params: { lat: latitude, long: longitude } })
        .then((response) => {
          // console.log(inputValue);
          // setWatherData(response.data);
          console.log(response.status);
          console.log(response);
          if (response.status === 200) {
            let weatherTemp = response.data.main.temp - 273;
            let weatherName = response.data.name;
            let weathercountry = response.data.sys.country;
            let weatherdec = response.data.weather[0].description;

            let data = {
              weatherFahrenheit: 85.98,
              weatherCelsiusL: Math.floor(weatherTemp),
              weatherDescription: weatherdec,
              country: weathercountry,
              city: weatherName,
            };
            console.log(
              weatherTemp + weatherName + weathercountry + weatherdec
            );
            setWatherData(data);
            // if (response.data.weather.main == undefined) return
          }
        })
        .catch(function (error) {
  
          if (error.response.status > 300) {
            notificationBar.current.style.display = "block";
            notificationBar.current.innerHTML =
              "<p>Please enter correct City Name Or City ZipCode</p>";
          }
        });

      // getWeather(latitude, longitude);
      // console.log(latitude + longitude);
    }

    // SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
    function showError(error) {
      notificationBar.current.style.display = "block";
      notificationBar.current.innerHTML = `<p> ${error.message} </p>`;
    }
  }, []);
  // useEffect(() => {
  //   axios
  //     .post(baseURL, {
  //       data: searchTarm === "city" ? `${searchTarm}_${city}` : `${searchTarm}_${inputValue}`
  //     })
  //     .then((response) => {
  //       console.log(inputValue)
  //       setWatherData(response.data);
  //       // if(response.status >= 200){
  //       //   notificationBar.current.style.display = "none";
  //       //   notificationBar.current.innerHTML = null;
  //       // }
  //     });
  //   console.log(weatherData);
  // }, [city,searchTarm]);

  // if (!weatherData) return null;
  return (
    <>
      <h1>Weather App</h1>
      <Autocomplete
        className="inputSearch"
        apiKey="AIzaSyD0mh6XGHLCdowCFx2gImZ6NeSoCaU4eoo"
        type="number/text"
        onChange={onChangeHandler}
        onPlaceSelected={(place) => {
          setCity(place.address_components[0].long_name);
        }}
      />
      <div className="containerCheckBoxs">
        <div className="selector">
          <div className="selecotr-item" onChange={setSearchType}>
            <label
              htmlFor="radio1"
              value="city"
              className="selector-item_label"
            >
              City Name
            </label>
            <input
              type="radio"
              value="city"
              id="radio1"
              name="selector"
              className="selector-item_radio"
            />
            <label
              htmlFor="radio2"
              value="zipcode"
              className="selector-item_label"
            >
              City Zip Code
            </label>
            <input
              type="radio"
              value="zipcode"
              id="radio3"
              name="selector"
              className="selector-item_radio"
            />
            <div></div>
            <select onChange={setCuntryCodeHandler}>
              {utils.map((item, index) => (
                <option key={index}> {item.Code}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="btnSearch" onClick={searchBtnHandler}>
        Search
      </button>

      <div className="container">
        <div className="app-title">
          <p>Weather</p>
        </div>
        <div ref={notificationBar} className="notification">
          {" "}
        </div>
        <div className="weather-container">
          <div className="weather-icon">
            <img src={`icons/${weatherData.icon}.png`} alt="" />
          </div>
          <div className="temperature-value">
            <p>
              {weatherData.weatherCelsiusL} °<span>C</span>
            </p>
          </div>
          <div className="temperature-description">
            <p> {weatherData.weatherDescription} </p>
          </div>
          <div className="location">
            <p>
              {weatherData.city} {weatherData.country}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;