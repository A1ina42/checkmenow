const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const categoryRoute = require("./routes/category");
const questionRoute = require("./routes/question");
const userRoute = require("./routes/user");
const testbankRoute = require("./routes/testbank");
const passingRoute = require("./routes/passing");
const groupRoute = require("./routes/group");
const statisticsRoute = require("./routes/statistics");
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db!");
  }
);

app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use("/api/users", authRoute);
app.use("/api/category", categoryRoute);
app.use("/api/question", questionRoute);
app.use("/api/testbank", testbankRoute);
app.use("/api/passing", passingRoute);
app.use("/api/group", groupRoute);
app.use("/api/statistics", statisticsRoute);
//Выполняется при каждом обращении с фронта для проверки авторизации текущего пользователя
app.use('/api/user', userRoute);

app.listen(3000, () => console.log("Server Up and running"));
