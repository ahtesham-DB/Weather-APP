import express from "express";
import { getWeather, postWeather } from "../controllers/weatherController.js";
import { notFound , errorHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("server running ");
});
router.get("/get", getWeather);
router.post("/postWeatherApi", postWeather);

// Error Handling middlewares
router.use(notFound);
router.use(errorHandler);


export default router;
