// imports express library
const express = require("express");
// include body parser library
const parser = require("body-parser");
const encodedParser = parser.urlencoded({ extended: true });
// include multer library
const multer = require("multer");
const uploadProcessor = multer({ dest: "public/upload" });

// initialize express
const app = express();

// initialize public folder for assets
app.use(express.static("public"));
// initialize body parser with the app
app.use(encodedParser);

// initialize template engine to look at views folder for rendering
app.set("view engine", "ejs");

// TODO INCLASS: SET UP ROUTES!

//main page
app.get("/", (req, res) => {
  res.render("index");
});

//receive information from client
app.get("/posts", (req, res) => {
  let dataContainer = {
    arrayToBeSent: data,
  };
});

//game page
app.get("/phigros", (req, res) => {
  res.render("phigros.ejs");
});

//community page
app.get("/community", (req, res) => {
  res.render("community.ejs");
});

//resource link page
app.get("/resource", (req, res) => {
  res.render("resource.ejs");
});

//song page with forum bar
app.get("/alphe-0", (req, res) => {
  let dataContainer = {
    arrayToBeSent: data,
  };

  res.render("alphe-0.ejs", dataContainer);
});


let data = [];

app.post("/upload", uploadProcessor.single("theimage"), (req, res) => {
  let now = new Date();

  // message object that holds the data from the form
  let message = {
    text: req.body.text,
    date: now.toLocaleString(),
    tag: req.body.selectedTag,
  };

  // checks to see if a file has been uplaoded
  if (req.file) {
    message.imgSrc = "upload/" + req.file.filename;
  }

  // adding the most recent message to the top of the array
  data.unshift(message);

  //redirect to the same page
  res.redirect("/alphe-0");
});


app.listen(2887, () => {
  console.log("server starts");
});
