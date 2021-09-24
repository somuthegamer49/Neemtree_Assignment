"use-strict";

// Selection of required elements
let uploadBtn = document.querySelector(".icon");
let hiddenInpt = document.querySelector("#input-file");
let prompt1 = document.querySelector(".prompt");
let statusmsg = document.querySelector(".msg");
let uplBtn = document.querySelector(".UploadBtn");

// Defined a class to hide and unhide the upload button
uplBtn.classList.add("hidden");

// Click event for opening input file with upload icon
uploadBtn.addEventListener("click", function () {
  hiddenInpt.click();
});

// Front end system for dispaying 
// - File name
// - status messages
// - Upload button
hiddenInpt.addEventListener("change", function (e) {
  let file = e.target.value;
  let ext = file.substring(file.lastIndexOf(".") + 1);
  let fileName = e.target.files[0].name;
  if (ext.toLowerCase() === "xlsx"|| ext.toLowerCase() === "xls" || ext.toLowerCase() === "csv") {
    prompt1.textContent = `${fileName}`;
    statusmsg.textContent = ""
    uplBtn.classList.remove("hidden");

  } else {
    statusmsg.style.color = "red";
    statusmsg.textContent = "Invalid File Format";
    prompt1.textContent = "Upload a .xlsx or .xls file here";
    uplBtn.classList.add("hidden");
  }
});

