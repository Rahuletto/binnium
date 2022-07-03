import { createRequire } from "module";
const require = createRequire(import.meta.url);
let mongoose = require("mongoose");

let models = new mongoose.Schema({
  uid: "string",
  title: "string",
  desc: "string",
  code: "string",
  language: "string",
  filename: "string",
});

export const model = mongoose.model("binnium", models);
