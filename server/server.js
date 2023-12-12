const express = require("express");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan("dev"));


const mongoUri = `mongodb+srv://fyp:fyp@cluster0.bxg2yrd.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => {
    "DB connection failed", err;
  });

/* Reading the routes folder and then mapping over the files 
in the folder and then requiring them. */
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);

/* This is a middleware that is used to protect the server from cross site request forgery. */
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server listening on port:8000");
});
