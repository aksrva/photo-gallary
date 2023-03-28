const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/PHOTOSTUDIO")
// mongoose.connect("mongodb+srv://AJAYSTUDIO:2jNy9Fh0RnYm3jMn@cluster0.akta5pw.mongodb.net/?retryWrites=true&w=majority")

let images_Schema = {
    image : {
        type: String,
        required: true
    }
}

let images = mongoose.models.IMAGES || mongoose.model("IMAGES", images_Schema, "images");
module.exports = {images};