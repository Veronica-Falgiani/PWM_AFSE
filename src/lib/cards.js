/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;


/* Returns all the cards present in the db */
const getCards = async (req,res) => {
    var clientdb = await new mongoClient(mongodbURI).connect();

    try {
        var result = await clientdb.db("AFSM").collection("Cards").find().toArray();
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
}

/* Returns all the cards collected by the user */
const getUserCards = async (req,res) => {
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

/* Updates credits and then inserts card info in the db of the user */
const addCards = async (req,res) => {
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

/* Returns a single card of the db */
const getCard = async (req,res) => {
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

/* Returns a single card of the user */
const getCardUser = async (req,res) => {
    var username = req-params.username
    var id = req.body.id

    var clientdb = await new mongoClient(mongodbURI).connect();

    var card = await clientdb.db("AFSM").collection("Users").aggregate([{
        "$unwind": "$cards"
    },
    {
        "$match": {
          "username": username,
          "cards.id": id
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

    if (card == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(card)
    } 
}

/* Updates trade value of a card of the user */
const modifyTradeCard = async (req,res) => {
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

/* Removes a card from the collection of the user and updates its values */
const removeCard = async (req,res) => {
    var id = req.params.id
    var username = req.body.username

    var clientdb = await new mongoClient(mongodbURI).connect();

    var decrement = { 
        $inc : {"cards.$.number": -1}
    }

    /* Updates the cards of the receive user */
    var filter = {
        $and: [
            { "username": username },
        ]
    }

        var card = await clientdb.db("AFSM").collection("Users").aggregate([{
            "$unwind": "$cards"
        },
        {
            "$match": {
            "username": username,
            "cards.id": Number(id)
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

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, removeCard);
        }
        catch(e) {
            console.log(e)
        } 
    }
    else {
        var filterCards = {
            $and: [
                { "username": username,
                  "cards.id" : card[0].id } 
            ]
        }
        try {
            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
        }
        catch(e){
            console.log(e)
        }
    }

    var increment = { 
        $inc : {"credits": 0.1} 
    } 

    
    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, increment);
    var user = await clientdb.db("AFSM").collection("Users").findOne(filter);

    res.json(user.credits)
}

module.exports = { getCards, getUserCards, addCards, getCard, getCardUser, modifyTradeCard, removeCard }