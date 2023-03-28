const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const body_parser = require("body-parser");
const session = require("express-session");
const multer = require('multer');
const fs = require('fs');
const schemas = require("./schema");
const { check, validationResult } = require('express-validator');
const PORT = process.env.PORT || 8999;
const abs_path = path.join(__dirname, "../public")
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));
app.use(express.static(abs_path));
app.use(body_parser.urlencoded({
    extended: true
}));
app.use(body_parser.json());
let img = "";
hbs.registerPartials(abs_path + "/partials");
app.use(session({
    secret: "PHOTOSTUDIOKEYHERE",
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    resave: false
}));
let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/images/");
        },
        filename: function (req, file, cb) {
            img = Date.now() + "_" + file.originalname;
            cb(null, img);
        }
    })
}).single("file_image");

app.set("view engine", "hbs");
app.get("/", async (req, res) => {
    let images = await schemas.images.find({}, "-_id -__v");
    res.render("index", {images});
})
app.get("/admin", (req, res) => {
    if (req.session.admin) {
        res.render("admin", { admin_homepage: true });
    } else {
        res.redirect("/admin/login")
    }
})
app.get("/admin/login", (req, res) => {
    res.render("admin", { admin_login: true })
})
app.post("/admin/login", (req, res) => {
    const { admin_email, admin_password } = req.body;
    if (admin_email == "ajaystudio@gmail.com" && admin_password == "ajaystudioPassword") {
        req.session.admin = true;
        res.redirect("/admin");
    } else {
        res.redirect("/admin/login")
    }
})

app.get("/admin/add-photos", (req, res) => {
    if(req.session.admin){
        res.render("admin", { add_image: true });
    }else{
        res.redirect("/admin/login");
    }
})
// app.post("/admin/add-photos", upload, async (req, res) => {
//     if(req.session.admin){
//         let image = {
//             image: img
//           };
//           try {
//             const result = await schemas.images.insertMany([image]);
//             console.log("uploaded");
//             res.redirect("/admin");
//           } catch (err) {
//             console.log("Not uploaded");
//             res.redirect("/admin/add-photos");
//           }
//     }else{
//         res.redirect("/admin/login")
//     }
// });

app.post("/admin/add-photos", upload, [check('description').isLength({min:2})], async (req, res) => {
    if(req.session.admin){
        try{
            let img = (req.file_image)? req.file.filename: null
            const errors = validationResult(req);
            if(!errors.isEmpty){
                return res.status(400).json({errors: errors.array()});
            }
            res.send("Saved");
        }catch(err){
            console.error("ERRORUPLOADEDIMAGE"+err.message);
            res.status(500).send("Internal server error");
        }
        // let image = {
        //     image: img
        //   };
        //   try {
        //     const result = await schemas.images.insertMany([image]);
        //     console.log("uploaded");
        //     res.redirect("/admin");
        //   } catch (err) {
        //     console.log("Not uploaded");
        //     res.redirect("/admin/add-photos");
        //   }
    }else{
        res.redirect("/admin/login")
    }
});
  
app.listen(PORT, () => {
    console.log("Server is started at " + PORT);
})