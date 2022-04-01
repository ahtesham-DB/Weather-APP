import mongoose from "mongoose";

const weatherDB = mongoose.Schema({
  weatherFahrenheit: String,
  weatherCelsiusL: String,
  weatherTemp: String,
  weatherDescription: String,
  country: String,
  city: String,
  icon: String,
});

var weatherDBModel = mongoose.model("weatherDB", weatherDB);

export default weatherDBModel;
