/* Imports */
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = require('url'); 
const crypto = require('crypto');  

/* Mongodb setup */
const mongodbURI = "mongodb+srv://veronicafalgiani:NEPuCX3YD0DpAB19@afsm.wit5h.mongodb.net/";


/* Function used to encrypt/decrypt passwords */
function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}


/* Verifies that fields are filled and registers a new user on the db */
async function addUser(req, res) {
    let user = req.body;

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

/* Compares the credentials given to the ones on the db and log ins the user */
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

/* Exports */
module.exports = addUser;
module.exports = loginUser;