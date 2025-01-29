const express = require("express");
var cors = require('cors');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = require('url');   

/* Mongodb setup */
const mongodbURI = "mongodb+srv://veronicafalgiani:NEPuCX3YD0DpAB19@afsm.wit5h.mongodb.net/";


/* Start server */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const port = 3100;
const host = "0.0.0.0";

app.listen(port, host, () => console.log("Server up on port 3100"));


/* Serving static files in express so I can use them */
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "/css/")));
app.use(express.static(path.join(__dirname, "/html/")));
app.use(express.static(path.join(__dirname, "/js/")));
app.use(express.static(path.join(__dirname, "/img/")));


/* Auth - NEED TO PUT IT IN A SEPARATE FILE */
const apiKey = "123456"
function auth(req, res, next) {
    if (req.query.apikey != apiKey) {
        res.status(401)
        return res.json({ message: "Invalid API key" })
    }
  
    next()
}


/* Get various pages */
app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/index.html"));
})

app.get("/register", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/register.html"));
})

app.get("/login", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/login.html"));
})

app.get("/profile", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/profile.html"));
})

/* Create a new user */
const addUser = require("./js/db.js")

app.post("/register", function (req, res) {
    console.log("Ricevuto una richiesta POST");
    addUser(req, res);
})


/* Login as user */
const loginUser = require("./js/db.js")

app.post("/login", async (req, res) => {
    loginUser(req, res);
})


/* Function to show a user description on the profile page */
