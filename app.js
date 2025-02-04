const express = require("express");
var cors = require('cors');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = require('url');   
const crypto = require('crypto');
const { maxHeaderSize } = require("http");
require("dotenv").config();

/* Mongodb setup */
const mongodbURI = process.env.MONGODB_URI;

/* Function used to encrypt/decrypt passwords */
function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

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
const apiKey = process.env.AUTH_KEY
function auth(req, res, next) {
    if (req.query.apikey != apiKey) {
        res.status(401)
        return res.json({ message: "Invalid API key" })
    }
  
    next()
}


/* ---- GET OF VARIOUS PAGES ---- */
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

app.get("/credits", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/credits.html"));
})

app.get("/packs", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/packs.html"));
})

app.get("/trade", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/trade.html"));
})

app.get("/album", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/album.html"));
})

app.get("/card", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/card.html"));
})

/* ---- CREATE NEW USER ---- */
app.post("/register", function (req, res) {
    console.log("Ricevuto una richiesta POST");
    addUser(req, res);
})

/* Verifies that fields are filled and registers a new user on the db */
async function addUser(req, res) {
    let user = req.body;

    if (user.username == undefined) {
        res.status(400).send("Missing Username")
        return
    }
    if (user.email == undefined) {
        res.status(400).send("Missing Surname")
        return
    }
    if (user.password == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if (user.hero == undefined) {
        res.status(400).send("Missing Password")
        return
    }
    if (user.series == undefined) {
        res.status(400).send("Missing Series")
        return
    }

    user.password = hash(user.password);

    user.credits = 0
    user.cards = []

    console.log(user);

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": user.username }
        ]
    }

    try {
        var items = await clientdb.db("AFSM").collection("Users").insertOne(user);
        var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);
        res.json(userInfo);
    }
    catch(e) {
        if(e.code == 11000) {
            res.status(400).send("Utente già presente")
            return
        }
        res.status(500).send(`Errore generico: ${e}`);
    }
}

/* ---- LOGIN AS USER ---- */
app.post("/login", async (req, res) => {
    loginUser(req, res);
})

/* Compares the credentials given to the ones on the db and log ins the user */
async function loginUser(req, res) {
    let user = req.body;

    if (user.username == undefined) {
        res.status(400).send("Missing Username")
        return
    }
    if (user.password == undefined) {
        res.status(400).send("Missing Password")
        return
    }

    user.password = hash(user.password);

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": user.username },
            { "password": user.password }
        ]
    }

    var loggedUser = await clientdb.db("AFSM").collection("Users").findOne(filter);

    //console.log(loggedUser);

    if (loggedUser == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(loggedUser)
    }
}


/* ---- GET USER INFO ---- */
app.get("/user/:username", async(req,res) => {
    getUserInfo(req,res);
})

/* Searches the info of the user in the database based on the email */
async function getUserInfo(req,res) {
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    console.log(userInfo);

    if (userInfo == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(userInfo)
    }
}

/* ---- UPDATE USER ---- */
app.put("/user/:username", (req, res) => {
    updateUser(req,res);
})

/* Updates the current user */
async function updateUser(req, res) {
    username = req.params.username;
    email = req.body.email;
    password = req.body.password;

    console.log(req.params, req.body) 

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var clientdb = await new mongoClient(mongodbURI).connect();

    if(email != "") {
        var item = await clientdb.db("AFSM").collection("Users").updateOne(filter, {$set: {"email":email}});
    }
    if(password != "") {
        password = hash(password);
        var item = await clientdb.db("AFSM").collection("Users").updateOne(filter, {$set: {"password":password}});
    }
    
    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    console.log(userInfo)

    try {
        res.json(userInfo);
    }
    catch(e) {
        if(e.code == 11000) {
            res.status(400).send("Utente già presente")
            return
        }
        res.status(500).send(`Errore generico: ${e}`);
    }
}

/* ---- DELETE USER ---- */
app.delete("/user/:username", (req, res) => {
    deleteUser(req,res);
})

/* Deletes the current user */
async function deleteUser(req,res) {
    username = req.params.username;

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var clientdb = await new mongoClient(mongodbURI).connect();

    try {
        var item = await clientdb.db("AFSM").collection("Users").deleteOne(filter);
        res.json(item);
    }
    catch(e) {
        res.status(500).send(`Error when deleting a user: ${e}`);
    }
}

/* ---- GET CREDITS ---- */
app.post("/credits", (req,res) =>{
    removeCredits(req,res);
})

/* Updates db with incremented credits an then returns the value of credits */
async function removeCredits(req,res) {
    let eur = req.body.euros;
    let username = req.body.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var increment = { 
        $inc : {"credits": Number(eur)} 
    } 

    /* findOneandUpdate did't work even with return original set to false */
    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, increment);
    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (response.modifiedCount == 0) {
        res.status(401).send("Failed to update credits")
    } else {
        if (userInfo == null) {
            res.status(401).send("Unauthorized")
        } else {
            res.json(userInfo.credits)
        } 
    }
}

/* ---- ADD CARDS TO PROFILE ---- */
app.post("/cards/:username", (req, res) => {
    addCards(req,res);
})

/* Updates credits and then inserts card info in the db of the user */
async function addCards(req,res) {
    username = req.params.username
    cards = req.body.cards
    credits = -Math.abs(Number(req.body.credits))

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var removeCredits = { 
        $inc : {"credits": credits} 
    } 

    for(i = 0; i < cards.length; i++){
        var addCards = { 
            $push : {"cards": cards[i]} 
        } 
     
        var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, addCards);
        if (response.modifiedCount == 0) {
            res.status(401).send("Failed to update cards")
        }
    }

    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, removeCredits);
    
    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (response.modifiedCount == 0) {
        res.status(401).send("Failed to update cards")
    } else {
        if (userInfo == null) {
            res.status(401).send("Unauthorized")
        } else {
            res.json(userInfo.credits)
        } 
    }
}

/* GET CARDS OF THE USER */
app.get("/cards/:username", (req,res) => {
    getCards(req,res);
})

async function getCards(req,res) {
    username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(userInfo.cards)
    } 
}