const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const body_parser = require("body-parser");
const multer = require("multer");
const PORT = process.env.PORT || 8999;
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.get("/", (req, res) => {
    res.render("index");
})
app.listen(PORT, () => {
    console.log("Server is started at " + PORT);
})