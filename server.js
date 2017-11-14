'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json;
const mongoose = require('mongoose');
var logger = require('morgan');
const port = process.env.port || 3000;

const routes = require('./routes');

app.use(jsonParser());
app.use(logger("dev"));

mongoose.connect("mongodb://localhost:27017/qa");

var db = mongoose.connection;

db.on("error", (err) => {
  console.error("connection error: ", err);
});

db.once("open", () => {
  console.log("db connection successful");
});

//confirming request
// app.use((req,res,next) => {
//   console.log("recieve request successfully");
//
//   next();
// })
app.use("/questions", routes);

//error handling

//404 error
app.use((req,res,next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error handler
app.use((err,req,res,next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});



//
// app.use((req,res,next) => {
//   if (req.body) {
//     console.log("the body property exist");
//   } else {
//     console.log("There is no body property");
//   }
//   })




app.listen(port, () => {
  console.log("Server is listening on port: " + port + ". Crtl + C to quit.");
})
