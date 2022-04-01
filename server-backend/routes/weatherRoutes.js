import express from "express";
import { getWeather, postWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("server running ");
});
router.get("/get", getWeather);
router.post("/postWeatherApi", postWeather);

export default router;
