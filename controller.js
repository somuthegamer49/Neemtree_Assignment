// Importing necessary libraries and modules
const express = require("express");
const multer = require("multer");
const mongoose1 = require("mongoose");
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');
const each = require('async')
const model = require('./model.js')


const excelToJson = require("convert-excel-to-json");
const { Db } = require("mongodb");

// Defining app object for executing express requests
const app = express();
app.use(express.json());

// Defining multer storage engine for storing original file in 'uploads' folder
const storage1 = multer.diskStorage({
  destination: "uploads",

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Defining upload variable to access multer functions
const upload = multer({ storage: storage1 });

app.use(express.static("public"));


// Using post method for routing to response page on clicking upload button
app.post("/upload", upload.single("input"), (req, res) => {

  res.sendFile(path.join(__dirname, './public/response.html'))
  
  // Database storage process executing inside post method, when upload button is pressed
  // Executing Model function when Upload button is pressed
    model.model(req.file.filename)
});

// The app is running at port 3000
// Click on the console.log link through terminal to open the project
app.listen(3000, () => console.log("http://localhost:3000"));

