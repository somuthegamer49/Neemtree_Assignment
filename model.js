const express = require("express");
const multer = require("multer");
const mongoose1 = require("mongoose");
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');
const each = require('async')
const excelToJson = require("convert-excel-to-json");


 
 
//  Creating function for Model
 function model(fname){
 
 // Converting excel data to Json

 const excelData = excelToJson({
    sourceFile: `./uploads/${fname}`,
    header: {
      // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
      rows: 1, // 2, 3, 4, etc.
    },
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });

  main().catch((err) => console.log(err));


// Connecting to mongodb database by creating 'mydb' database
  async function main() {
    await mongoose1.connect("mongodb://localhost:27017/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Defined the schema or the database keys 
  // - Email is required and unique
  // - Name is required
  const excelSchema = new mongoose1.Schema({
    "Name of the Candidate": { type: String, required: true },
    "Email": { type: String, unique: true, required: true },
    "Mobile No.": Number,
    "Date of Birth": String,
    "Work Experience": String,
    "Resume Title": String,
    "Current Location": String,
    "Postal Address": String,
    "Current Employer": String,
    "Current Designation": String,
  });
    excelSchema.plugin(uniqueValidator)
  // Creating mongoose model with table name as Aspirants
  const excel = mongoose1.model("Aspirants", excelSchema);

  console.log(excelData.Sheet1)

  // Pushing data to the mongodb database with model.create function
   each.eachSeries(excel.create(excelData.Sheet1, function (err) {
    if (err) throw err

    excel.collection.dropIndex("Email_1", function(err, results){
        if(err) throw err
    });
  }), function(err){
    console.log(err)
  })
 }

 //Importing the model function to controller
 module.exports = {model}