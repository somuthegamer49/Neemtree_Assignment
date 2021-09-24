// Importing necessary libraries and modules
const express = require("express");
const multer = require("multer");
const mongoose1 = require("mongoose");
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');


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
  // Converting excel data to Json
  const excelData = excelToJson({
    sourceFile: `./uploads/${req.file.originalname}`,
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


  // Pushing data to the mongodb database with model.create function
  excel.create(excelData.Sheet1, function (err) {
    if (err) throw err
    else{
      console.log(excelData.Sheet1)
    }
    excel.excelSchema.dropIndex("Email_1", function(err, results){
        if(err) throw err
    });
    excel.excelSchema.dropIndex("Name of the Candidate_1", function(err, results){
      if(err) throw err
  });
  });
});

// The app is running at port 3000
// Click on the console.log link through terminal to open the project
app.listen(3000, () => console.log("http://localhost:3000"));
