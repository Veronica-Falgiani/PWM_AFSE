/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /user/:username */
/* Searches the info of the user in the database based on the email */
const getUserInfo = async (req,res) => {
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(400).send("Utente non trovato")
    } else {
        res.json(userInfo)
    }
}

/* PUT - /user/:username */
/* Updates the current user */
const updateUser = async (req, res) => {
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

/* DELETE - /user/:username */
/* Deletes the current user */
const deleteUser = async (req,res) => {
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

module.exports = { getUserInfo, updateUser, deleteUser }