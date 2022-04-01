import express from "express";
// import mongoose from "mongoose";
// import weatherDBModel from "../models/weatherDBModel.js";
import request from "request";

const router = express.Router();
const weatherApiKey = `${process.env.WEATHERAPIKEY}`;

export const getWeather = async (req, res) => {
  // if want  to store users Data to DATABASE MongoDB
  // const data = await goalsMogooseModel.findOne();
  // try {
  //   res.status(200).json(data);
  // } catch (error) {
  //   res.status(404).json({
  //     message: error.message,
  //     ErrorDatabase: "No user Data Set in  Database ",
  //   });
  // }

  const { lat, long } = req.query;
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=0e8653259a8d5a9634be266951e936ce`;

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

  if (data.split("_")[0] === "city") {
    let city = data.split("_")[1];
    url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`;
    console.log("city");
  } else if (data.split("_")[0] === "zipcode") {
    let zipcode = parseInt(data.split("_")[1].trim());
    url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=0e8653259a8d5a9634be266951e936ce`;
    console.log("zipcode", zipcode);
    // url = `https://api.openweathermap.org/data/2.5/weather?zip=${parseInt(zipcode)},us&appid=${weatherApiKey}`
  }

  // Use that city name to fetch data
  // Use the API_KEY in the '.env' file
  // let urlZip = `https://api.openweathermap.org/data/2.5/weather?zip=${zip code},${country code}&appid=${weatherApiKey}`
  // Request for data using the URL

  request(url, function (err, response, body) {
    // On return, check the json data fetched
    if (err) {
      res.status(401).send({ weather: null, error: "Error, please try again" });
    } else {
      let weather = JSON.parse(body);

      if (weather.main == undefined) {
        res
          .status(301)
          .send({ weather: null, error: "Error, please try again" });
      } else {
        // we shall use the data got to set up your output
        let place = `${weather.name}, ${weather.sys.country}`,
          /* you shall calculate the current timezone using the data fetched*/
          weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
          )}`;
        let weatherTemp = `${weather.main.temp}`,
          weatherPressure = `${weather.main.pressure}`,
          weatherDescription = `${weather.weather[0].description}`,
          humidity = `${weather.main.humidity}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        // you shall also round off the value of the degrees fahrenheit calculated into two decimal places
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
  });
};
