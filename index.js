// ------------------------------------------
// This is a fun project made under 2 days ;)
// ------------------------------------------

const express = require("express");
const app = express();
const ejs = require("ejs");

let path = require("path");

// Mongoose
let mongoose = require("mongoose");
let model = require("./model.js");

mongoose
  .connect(process.env.mongo)
  .catch(() => {
    console.log("Error connecting to mongodb");
    process.exit(1);
  })
  .then(() => console.log("Connected to mongodb"));

// Using bodyParser
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// Set engine to EJS
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(express.static("./site"));

// ----------------------------
// All the Functions necessary
// ----------------------------

// A Simple function to render files
function renderTemplate(res, req, template, data = {}) {
  const baseData = {
    path: req.path,
  };
  res.render(
    path.resolve(`${process.cwd()}${path.sep}site/${template}`),
    Object.assign(baseData, data)
  );
}

// A Simple function to make an UID
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// ----------------------------

// Home Page. You can set it into create.ejs
app.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs");
});

app.get("/create", async (req, res) => {
  renderTemplate(res, req, "create.ejs");
});

// POST request from the form to create bins/paste
app.post("/create", async (req, res) => {
  if (req.body.code == "" || !req.body.code) return res.redirect("/create");

  let id = makeid(8); // Create a special UID (8 characters)

  let obj = new model({
    title: req.body.title || "Untitled",
    desc: req.body.desc || "No Description",
    code: req.body.code
      .replaceAll("'", `\'`)
      .replaceAll('"', `\"`)
      .replaceAll("`", `\``), // Escape some characters
    uid: id,
    language: req.body.language,
    filename: req.body.filename,
  });

  await obj.save();

  res.redirect(`/file/${id}`);
});

app.get("/file/:uid", async (req, res) => {
  let data = await model.findOne({ uid: req.params.uid });

  if (!data) return renderTemplate(res, req, "error.ejs");
  // Throw error if the file is not found.
  else renderTemplate(res, req, "file.ejs", { data: data });
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening to PORT: ${port}`);
});
