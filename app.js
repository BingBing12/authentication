require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const md5 = require("md5");
//const encrypt = require("mongoose-encryption")

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    username: String, 
    password: String
})



// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})
app.get("/login", function(req, res){
    res.render("login");
})
app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register",function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        const user = new User({
            username: username,
            password: hash
        })
        user.save(function(err){
            if(!err){
                res.render("secrets");
            }
        });
    });
    
})
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    
    User.findOne({username: username}, function(err, foundUser){
        if(!err){
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result){
                        res.render("secrets");
                    }
                });
            }
        }
    })
})


app.listen(3000, function(){
    console.log("server started on port 3000");
})