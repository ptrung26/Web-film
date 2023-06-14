import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import * as db from "./src/config/connect.js";
import router from "./src/routes/index.js";
dotenv.config("");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1", router);

db.connect();

const port = process.env.SERVER_PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
