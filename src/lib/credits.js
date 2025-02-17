/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /credits/:username */
/* Returns the credits of the specified user */
const getCredits = async (req,res) => {
    let username = req.params.username;

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
        ]
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(500).json("Server error: failed to find user")
    } else {
        res.status(200).json(userInfo.credits)
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

   
    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, increment);

    if (response.modifiedCount == 0) {
        res.status(500).json("Server error: failed to update user")
        return
    } 

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(500).json("Server error: failed to find user")
    } 
    else {
        res.status(200).json(userInfo.credits)
    } 
}

module.exports = { getCredits, changeCredits }