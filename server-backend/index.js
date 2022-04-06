import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";

import router from "./routes/weatherRoutes.js";

//Env config File to store Secret Data API Keys Connection URL


//Set-up local 3001 ports, but if deployed on Server then Hosting service will provide Open PORT
const PORT = process.env.PORT || 3001;

// iniciate Expresss server 
const app = express();
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(cors());

//setting Routs in saprat modules 
app.use("/", router);

//  Initiate mongoDB connection and passing appropriate options 
export const conn = mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


//Deprecated
// mongoose.set('useFindAndModify', false);
