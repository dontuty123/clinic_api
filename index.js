/** @format */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT_SERVER = 5000;

const mongoose = require("mongoose");
const userRoute = require("./route/user");
const medicineRoute = require("./route/medince");
const roleRoute = require("./route/role");
const activityRoute = require("./route/acitvity");
const consulationRoute = require("./route/consulation");
const patientRoute = require("./route/patient");

// const PORT_SOCKET = 5500;

dotenv.config();

mongoose
  .connect(process.env.APP_DATABASE_URL)
  .then(() => console.log("DB connection successful"))
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT_SERVER, () => {
  console.log(`Example app listening on port ${PORT_SERVER}`);
});

app.get("/", (req, res) => {
  res.send("Welcome guy go to api hehe !");
});

app.use(express.json());

app.use("/api/users", userRoute);
// app.use("/api/medicine", medicineRoute);
// app.use("/api/role", roleRoute);
// app.use("/api/activity", activityRoute);
// app.use("/api/consulation", consulationRoute);
// app.use("/api/patient", patientRoute);
