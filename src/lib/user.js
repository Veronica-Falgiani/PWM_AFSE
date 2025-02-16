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
        res.status(400).json("User not found")
    } else {
        res.status(200).json(userInfo)
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
        var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, {$set: {"email":email}});
        if(response.modifiedCount == 0) {
            res.status(500).json("Server error: failed to update email")
            return
        }
    }

    if(password != "") {
        password = hash(password);
        var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, {$set: {"password":password}});
        if(response.modifiedCount == 0) {
            res.status(500).json("Server error: failed to update password")
            return
        }
    }
    
    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(500).json("Server error: failed to fetch user")
    }
    else {
        res.status(200).json(userInfo)
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

    var response = await clientdb.db("AFSM").collection("Users").deleteOne(filter);
    
    if(response.deletedCount == 0) {
        res.status(500).json("Server error: failed to delete user")
        return
    }
    else {
        res.status(200).json("User deleted")
    }
}

module.exports = { getUserInfo, updateUser, deleteUser }