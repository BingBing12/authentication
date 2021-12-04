const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = {
    username: String, 
    password: String
}

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
    const user = new User({
        username: username,
        password: password
    })
    user.save(function(err){
        if(!err){
            res.render("secrets");
        }
    });
})
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, function(err, foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password == password){
                    res.render("secrets");
                }
            }
        }
    })
})


app.listen(3000, function(){
    console.log("server started on port 3000");
})