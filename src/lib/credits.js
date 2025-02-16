/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /credits/:username */
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

/* POST - /credits/:username */
/* Increases user credits by the specified amount */
const changeCredits = async (req,res) => {
    let changeCredits = req.body.changeCredits;
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var increment = { 
        $inc : {"credits": Number(changeCredits)} 
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

module.exports = { getCredits, changeCredits }