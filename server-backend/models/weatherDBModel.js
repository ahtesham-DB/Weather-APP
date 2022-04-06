import mongoose from "mongoose";

//  To create mongoDB Database Model used Mongoose library 
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
