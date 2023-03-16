const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/PHOTOSTUDIO")

let images_Schema = {
    image : {
        type: String,
        required: true
    }
}

let images = mongoose.models.IMAGES || mongoose.model("IMAGES", images_Schema, "images");
module.exports = {images};