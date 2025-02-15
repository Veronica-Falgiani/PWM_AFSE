/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* Returns the credits of the specified user */
const getCredits = async (req,res) => {
    let username = req.body.username;

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
        res.json(userInfo.credits)
    } 
}

/* Increases user credits by the specified amount */
const addCredits = async (req,res) => {
    let creditsToAdd = req.body.creditsToAdd;
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var increment = { 
        $inc : {"credits": Number(creditsToAdd)} 
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

/* Reduces user credits by the specified amount */
const decreaseCredits = async (req,res) => {
    let creditsToDecrease = req.body.creditsToDecrease;
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var decrement = { 
        $inc : {"credits": Number(creditsToDecrease)} 
    } 

    /* findOneandUpdate did't work even with return original set to false */
    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, decrement);

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

module.exports = { getCredits, addCredits, decreaseCredits }