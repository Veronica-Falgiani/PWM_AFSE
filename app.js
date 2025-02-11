const express = require("express");
var cors = require('cors');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = require('url');   
const crypto = require('crypto');
const { maxHeaderSize } = require("http");
const { receiveMessageOnPort } = require("worker_threads");
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

app.get("/trades", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/trades.html"));
})

app.get("/album", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/album.html"));
})

app.get("/card", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/card.html"));
})

app.get("/trade", (req,res) =>{
    res.sendFile(path.join(__dirname, "html/trade.html"));
})

/* ---- CREATE NEW USER ---- */
app.post("/register", function (req, res) {
    addUser(req, res);
})

/* Verifies that fields are filled and registers a new user on the db */
async function addUser(req, res) {
    let user = req.body;

    if (user.username == undefined) {
        res.status(400).send("Username mancante")
        return
    }
    if (user.email == undefined) {
        res.status(400).send("Email mancante")
        return
    }
    if (user.password == undefined) {
        res.status(400).send("Password mancante")
        return
    }
    if (user.hero == undefined) {
        res.status(400).send("Eroe Mancante")
        return
    }
    if (user.series == undefined) {
        res.status(400).send("Serie mancante")
        return
    }

    user.password = hash(user.password)

    user.credits = 0
    user.cards = []

    //console.log(user);

    var clientdb = await new mongoClient(mongodbURI).connect()

    var filter = {
        $and: [
            { "username": user.username }
        ]
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter)

    if (userInfo != null) {
        res.status(400).send("Username già presente!")
        return
    }
    else {
        try {
            var items = await clientdb.db("AFSM").collection("Users").insertOne(user)
            var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter)
            res.json(userInfo)
        }
        catch(e) {
            res.status(500).send(`Errore generico: ${e}`)
            return
        }
    }
}

/* ---- LOGIN AS USER ---- */
app.post("/login", async (req, res) => {
    loginUser(req, res);
})

/* Compares the credentials given to the ones on the db and log ins the user */
async function loginUser(req, res) {
    let username = req.body.username;
    let password = req.body.password

    if (username == undefined) {
        res.status(400).send("Username mancante")
        return
    }
    if (password == undefined) {
        res.status(400).send("Password mancante")
        return
    }

    password = hash(password);

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username },
            { "password": password }
        ]
    }

    var loggedUser = await clientdb.db("AFSM").collection("Users").findOne(filter);

    //console.log(loggedUser);

    if (loggedUser == null) {
        res.status(400).send("Non è stato trovato un utente!")
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
app.get("/credits/:username", (req,res) => {
    getCredits(req,res);
})

async function getCredits(req,res) {
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


/* ---- UPDATE CREDITS ---- */
/* add :username MODIFY TO INCREMENT AND DECREASE?? */
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


/* ---- GET ALL CARDS ---- */
app.get("/cards", (req,res) => {
    getCards(req,res);
})

/* Returns all the cards present in the db */
async function getCards(req, res) {
    var clientdb = await new mongoClient(mongodbURI).connect();

    try {
        var result = await clientdb.db("AFSM").collection("Cards").find().toArray();
        res.json(result)
    }
    catch (e) {
        console.log(e)
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

    var increment = { 
        $inc : {"cards.$.number": 1}
    }

    var removeCredits = { 
        $inc : {"credits": credits} 
    } 

    for(i = 0; i < cards.length; i++){
        var filterCards = {
            $and: [
                { "username": username,
                    "cards" : { $elemMatch : { "id" : cards[i].id } } 
                 },
            ]
        }

        result = await clientdb.db("AFSM").collection("Users").findOne(filterCards);
    
        /* If the card is not present in the db it will add it to the user */
        if(result == null){
            var addCards = { 
                $push : {"cards": cards[i]} 
            } 

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, addCards);
            if (response.modifiedCount == 0) {
                res.status(401).send("Failed to add cards")
            }
        }
        /* If the card is present, it will update the number of cards obtained */
        else {
            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, increment);
            if (response.modifiedCount == 0) {
                res.status(401).send("Failed to update cards")
            }
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

/* ---- GET CARDS OF THE USER ---- */
app.get("/cards/:username", (req,res) => {
    getUserCards(req,res);
})

async function getUserCards(req,res) {
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

/* ---- GET A SINGLE CARD ---- */
app.get("/card/:id", (req,res) => {
    getCard(req,res);
})

async function getCard(req,res) {
    var id = req.params.id

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "id": id },
        ]
    }

    var card = await clientdb.db("AFSM").collection("Cards").findOne(filter);

    if (card == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(card)
    } 
}

/* ---- UPDATE A CARD WHEN USED OR DELETED FROM A TRADE ---- */
app.put("/card/:id", (req,res) => {
    modifyTradeCard(req,res);
})

async function modifyTradeCard(req,res) {
    var id = req.params.id
    var username = req.body.username
    
    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username }
        ]
    }

    user = await clientdb.db("AFSM").collection("Users").findOne(filter);

    for(i = 0; i < user.cards.length; i++) {
        if(user.cards[i].id == id) {
            if(user.cards[i].inTrade == true) {
                var result = await clientdb.db("AFSM").collection("Users").updateOne(filter, { $set : {[`cards.${i}.inTrade`]: false} });
            }
            else {
                var result = await clientdb.db("AFSM").collection("Users").updateOne(filter, { $set : {[`cards.${i}.inTrade`]: true} });
            }
        }
    }

    res.json()
}

/* ---- GET ALL TRADES ---- */
app.get("/alltrades", (req,res) => {
    getTrades(req,res);
})

async function getTrades(req,res) {
    var clientdb = await new mongoClient(mongodbURI).connect();

    try {
        var result = await clientdb.db("AFSM").collection("Trades").find().toArray();
        //console.log(result)
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
}

/* ---- GET A SINGLE TRADE ---- */
app.get("/trade/:id", (req,res) => {
    getTrade(req,res)
})

async function getTrade(req, res) {
    var id = req.params.id
    id = new ObjectId(id)

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    try {
        var result = await clientdb.db("AFSM").collection("Trades").findOne(filter);
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
}

/* ---- CREATE TRADES ---- */
app.post("/trade/:username", (req,res) => {
    createTrade(req,res)
})

async function createTrade(req,res) {
    username = req.params.username
    name = req.body.name
    receive = req.body.heroReceive
    send = req.body.heroSend

    if(name == undefined) {
        res.status(400).send("Nome mancante")
        return
    }
    
    if(receive.length == 0) {
        res.status(400).send("Carte da ricevere mancanti")
        return
    }
    
    if(send.length == 0) {
        res.status(400).send("Carte da inviare mancanti")
        return
    }

    var trade = {
        "username": username,
        "name": name,
        "receive": receive,
        "send": send
    }

    console.log(trade)

    var clientdb = await new mongoClient(mongodbURI).connect();

    try {
        var result = await clientdb.db("AFSM").collection("Trades").insertOne(trade)  
        res.json(result);
    }
    catch(e) {
        res.status(500).send(`Errore generico: ${e}`)
        return
    }
}


/* ---- DELETE TRADE AND SETS INTRADE TO FALSE ---- */
app.delete("/trade/:id", (req,res) => {
    deleteTrade(req,res)
})

async function deleteTrade(req,res) { 
    var id = req.params.id
    id = new ObjectId(id)
  
    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    try {
        var result = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
        res.json(result);
    }
    catch (e) {
        console.log(e)
    }
}

app.post("/acceptTrade/:id", (req,res) => {
    acceptTrade(req,res)
})

async function acceptTrade(req,res) {
    var id = req.params.id
    id = new ObjectId(id)
    usernameRec = req.body.username

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    /* Gets the trade info */
    try {
        var trade = await clientdb.db("AFSM").collection("Trades").findOne(filter);    
    }
    catch (e) {
        console.log(e)
    }

    usernameSend = trade.username
    cardsRec = trade.send
    cardsSend = trade.receive
    
    var decrement = { 
        $inc : {"cards.$.number": -1}
    }

    /* Updates the cards of the receive user */
    var filterRec = {
        $and: [
            { "username": usernameRec },
        ]
    }

    /* Updates the cards of the receive user */
    var filterSend = {
        $and: [
            { "username": usernameSend },
        ]
    }

    /* Updates the cards of the sender user */
    for(i = 0; i < cardsRec.length; i++){
        var card = await clientdb.db("AFSM").collection("Users").aggregate([{
            "$unwind": "$cards"
        },
        {
            "$match": {
              "username": usernameSend,
              "cards.id": cardsRec[i].id
            }
        },
        {
            "$project": {
              "_id": 0,
              "id": "$cards.id",
              "name": "$cards.name",
              "thumbnail": "$cards.thumbnail",
              "number": "$cards.number",
              "inTrade": "$cards.inTrade"
            }
        }]).toArray()

        var cardUser = await clientdb.db("AFSM").collection("Users").aggregate([{
            "$unwind": "$cards"
        },
        {
            "$match": {
              "username": usernameRec,
              "cards.id": cardsRec[i].id
            }
        },
        {
            "$project": {
              "_id": 0,
              "id": "$cards.id",
              "name": "$cards.name",
              "thumbnail": "$cards.thumbnail",
              "number": "$cards.number",
              "inTrade": "$cards.inTrade"
            }
        }]).toArray()

        if(cardUser.length != 0) {
            console.log("carta già presente")
            res.status(400).send("La carta è già in tuo possesso")
            return
        }   
    
        if(card[0].number == 1) {
            try {
                var removeCard = {
                    $pull: {
                        "cards": {
                        "id": card[0].id
                        }
                    }
                    
                } 

                var response = await clientdb.db("AFSM").collection("Users").updateOne(filterSend, removeCard);
                console.log(usernameSend, card.name, response)
            }
            catch(e) {
                console.log(e)
            } 
        }
        else {
            var filterCards = {
                $and: [
                    { "username": usernameSend,
                      "cards.id" : card[0].id } 
                ]
            }

            try {
                var result = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, { $set : {"cards.$.inTrade": false} });

                var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
                console.log(usernameSend, card.name, result, response)
            }
            catch(e){
                console.log(e)
            }
        }
    }

    /* Delete the card we need to send to the receiver */
    for(i = 0; i < cardsSend.length; i++){
        var card = await clientdb.db("AFSM").collection("Users").aggregate([{
            "$unwind": "$cards"
        },
        {
            "$match": {
              "username": usernameRec,
              "cards.id": cardsSend[i].id
            }
        },
        {
            "$project": {
              "_id": 0,
              "id": "$cards.id",
              "name": "$cards.name",
              "thumbnail": "$cards.thumbnail",
              "number": "$cards.number",
              "inTrade": "$cards.inTrade"
            }
        }]).toArray()

        if(card[0].inTrade == true) {
            res.status(400).send("Carta bloccata in un altro scambio")
            return
        }

        if(card[0].number == 1) {
            try {
                var removeCard = {
                    $pull: {
                        "cards": {
                        "id": card[0].id
                        }
                    }
                    
                } 

                var response = await clientdb.db("AFSM").collection("Users").updateOne(filterRec, removeCard);
                console.log(usernameRec, card.name, response)
            }
            catch(e) {
                console.log(e)
            } 
        }
        else {
            var filterCards = {
                $and: [
                    { "username": usernameRec,
                      "cards.id" : card[0].id } 
                ]
            }
            try {
                var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
                console.log(usernameRec, card.name, response)
            }
            catch(e){
                console.log(e)
            }
        }
    }

    /* Adds the card of the receiver to the db */ 
    for(j = 0; j < cardsSend.length; j++) {
        card = {
            "id": cardsSend[j].id,
            "name": cardsSend[j].name,
            "thumbnail": cardsSend[j].thumbnail,
            "number": 1,
            "inTrade": false
        }

        var addCards = { 
            $push : {"cards": card} 
        }  
        
        var response = await clientdb.db("AFSM").collection("Users").updateOne(filterSend, addCards);
        if (response.modifiedCount == 0) {
            res.status(401).send("Failed to add cards")
            return
        }
    }

    /* Adds the card of the sender to the db */
    for(j = 0; j < cardsRec.length; j++) {
        card = {
            "id": cardsRec[j].id,
            "name": cardsRec[j].name,
            "thumbnail": cardsRec[j].thumbnail,
            "number": 1,
            "inTrade": false
        }

        var addCards = { 
            $push : {"cards": card} 
        } 

        var response = await clientdb.db("AFSM").collection("Users").updateOne(filterRec, addCards);
        if (response.modifiedCount == 0) {
            res.status(401).send("Failed to add cards")
            return
        }
    }   

    /* Deletes the trade */
    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    try {
        var result = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
        res.redirect("/trades");
    }
    catch (e) {
        console.log(e)
    }
}