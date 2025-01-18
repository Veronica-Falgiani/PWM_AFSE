const express = require("express");
var cors = require('cors');
const crypto = require('crypto')
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


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

function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

/* Get index page */
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
app.post("/register", function (req, res) {
    console.log("Ricevuto una richiesta POST");
    console.log(req.body);
    addUser(req, res);
})

async function addUser(req, res) {
    let user = req.body;
    console.log()

    if (user.username == undefined) {
        res.status(400).send("Missing Name")
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
    if (user.img == undefined) {
        res.status(400).send("Missing Image")
        return
    }

    user.password = hash(user.password);

    console.log(user);

    var clientdb = await new mongoClient(mongodbURI).connect();
    try {
        var items = await clientdb.db("AFSM").collection("Users").insertOne(user);
        //res.json(items)
        res.redirect("/profile");
    }
    catch(e) {
        if(e.code == 11000) {
            res.status(400).send("Utente già presente")
            return
        }
        res.status(500).send(`Errore generico: ${e}`);
    }
}

/* Login as user */
app.post("/login", async (req, res) => {
    loginUser(req, res);
})

async function loginUser(req, res) {
    let user = req.body;

    if (user.email == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if (user.password == undefined) {
        res.status(400).send("Missing Password")
        return
    }

    user.password = hash(user.password);

    console.log(user)

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "email": user.email },
            { "password": user.password }
        ]
    }

    var loggedUser = await clientdb.db("AFSM").collection("Users").findOne(filter);

    console.log(loggedUser);

    if (loggedUser == null) {
        res.status(401).send("Unauthorized")
    } else {
        //res.json(loggedUser)
        res.redirect("/profile")
    }
}