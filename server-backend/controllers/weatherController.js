import express from "express";
import request from "request";
// import mongoose from "mongoose";
// import weatherDBModel from "../models/weatherDBModel.js";

const router = express.Router();
const weatherApiKey = `${process.env.WEATHERAPIKEY}`;

export const getWeather = async (req, res) => {
  const { lat, long } = req.query;
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherApiKey}`;

  request(api, function (err, response, body) {
    if (err) {
      res.status(401).send({ weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);

      if (weather.main == undefined) {
        res
          .status(301)
          .send({ weather: null, error: "Error, please try again" });
      } else {
        res.send(body);
      }
    }
  });
};

export const postWeather = async (req, res) => {
  // Get city name passed in the form body
  let data = req.body.data;
  let url;
  console.log("url", url);
  console.log("data get from body", data);

  if (data.split("_")[0] === "city") {
    let city = data.split("_")[1];
    url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;
    console.log("city_data", `${city}${url}${data}`);
  } else if (data.split("_")[0] === "zipcode") {
    let zipcode = data.split("_")[1].trim();
    let cuntry_code = data.split("_")[2].trim();
    console.log("zipcode_data", `${zipcode}${cuntry_code}`);
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${cuntry_code}&appid=0e8653259a8d5a9634be266951e936ce`;
    console.log("url", url);
    console.log("data after req", data);
    // url = `https://api.openweathermap.org/data/2.5/weather?zip=${parseInt(zipcode)},us&appid=${weatherApiKey}`
  }

  // Use that city name to fetch data
  // Use the API_KEY in the '.env' file
  // let urlZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip code},${country code}&appid=${weatherApiKey}`
  // Request for data using the URL

  request(url, function (err, response, body) {
    // On return, check the json data fetched
    try {
      if (err) {
        res
          .status(401)
          .send({ weather: null, error: "Error, please try again" });
      } else {
        let weather = JSON.parse(body);

        if (weather.main == undefined) {
          res
            .status(301)
            .send({ weather: null, error: "Error, please try again" });
        } else {
          let weatherTemp = `${weather.main.temp}`,
            weatherDescription = `${weather.weather[0].description}`,
            weatherFahrenheit;
          weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

          // function roundToTwo(num) {
          //   return +(Math.round(num + "e+2") + "e-2"); replace math floor
          //
          weatherFahrenheit = Math.floor(weatherFahrenheit);

          let country = weather.sys.country;
          let city_ = weather.name;
          let icon = weather.weather[0].icon;

          let temperatureValue = Math.floor(weatherTemp - 273);

          function celsiusToFahrenheit(temperature) {
            return (temperature * 9) / 5 + 32;
          }

          let f = celsiusToFahrenheit(temperatureValue);
          let fahrenheit = Math.floor(f);

          if (weatherTemp > 100) {
            weatherTemp = Math.floor(weatherTemp - 273.15);
          }

          if (weather) {
            res.status(201).send({
              weatherFahrenheit,
              weatherCelsiusL: weatherTemp,
              weatherDescription,
              country,
              city: city_,
              icon,
            });
          } else {
            res.status(402).send({ err });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};
