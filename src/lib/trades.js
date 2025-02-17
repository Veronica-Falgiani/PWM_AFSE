/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /alltrades */
/* Returns all the trades in the db */
const getTrades = async (req,res) => {
    var clientdb = await new mongoClient(mongodbURI).connect();

    var trades = await clientdb.db("AFSM").collection("Trades").find().toArray();

    if(trades == null) {
        res.status(500).json("Server error: failed to fetch trades")
    }
    else {
        res.status(200).json(trades)
    }
}

/* GET - /trade/:id */
/* Returns a single trade */
const getTrade = async (req, res) => {
    var id = req.params.id
    id = new ObjectId(id)

    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    var trade = await clientdb.db("AFSM").collection("Trades").findOne(filter);
    if(trade == null) {
        res.status(500).json("Server error: failed to fetch trade")
    }
    else {
        res.status(200).json(trade)
    }
}

/* DELETE - /trade/:id */
/* Deletes a trade from the db */
const deleteTrade = async (req,res) => { 
    var id = req.params.id
    id = new ObjectId(id)
  
    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    var response = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
    if(response.deletedCount == 0) {
        res.status(500).json("Server error: failed to delete the trade")
    }
    else {
        res.status(200).json("Trade deleted successfully")
    }
}

/* POST - /trade */
/* Given the trade info creates a trade in the db */
const createTrade = async (req,res) => {
    username = req.body.username
    name = req.body.name
    receive = req.body.heroReceive
    send = req.body.heroSend

    if(name == '') {
        res.status(400).json("Missing title")
        return
    }
    
    if(receive.length == 0) {
        res.status(400).json("Missing cards to receive")
        return
    }
    
    if(send.length == 0) {
        res.status(400).json("Missing cards to send")
        return
    }

    var trade = {
        "username": username,
        "name": name,
        "receive": receive,
        "send": send
    }

    var clientdb = await new mongoClient(mongodbURI).connect();

    var response = await clientdb.db("AFSM").collection("Trades").insertOne(trade) 
    if(response.acknowledged == false) {
        res.status(500).json("Server error: failed to create trade")
    }
    else {
        res.status(200).json("Trade created successfully")
    }
}

/* POST - /acceptTrade/:id */
/* Accepts the trade by:
* - Adding the cards to the sender and receiver
* - Deleting or updating the number of the cards of the receiver and sender */
const acceptTrade = async (req,res) => {
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
    var trade = await clientdb.db("AFSM").collection("Trades").findOne(filter);    
    if(trade == null) {
        res.status(500).json("Server error: failed to fetch the trade")
        return
    }

    usernameSend = trade.username
    cardsRec = trade.send
    cardsSend = trade.receive
    
    var decrement = { 
        $inc : {"cards.$.number": -1}
    }

    var filterRec = {
        $and: [
            { "username": usernameRec },
        ]
    }

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
            res.status(400).json("You already have that card")
            return
        }   
    
        if(card[0].number == 1) {
            var removeCard = {
                $pull: {
                    "cards": {
                    "id": card[0].id
                    }
                }
                
            } 

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterSend, removeCard);
            if(response.modifiedCount == 0) {
                res.status(500).json("Server error: failed to remove the card of the sender")
                return
            }
        }
        else {
            var filterCards = {
                $and: [
                    { "username": usernameSend,
                      "cards.id" : card[0].id } 
                ]
            }

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, { $set : {"cards.$.inTrade": false} });
            if(response.modifiedCount == 0) {
                res.status(500).json("Server error: failed to update the sender card")
                return
            }

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
            if(response.modifiedCount == 0) {
                res.status(500).json("Server error: failed to decrement the number of the sender card")
                return
            }
        }
    }

    console.log("usernameSend updated")

    /* Deletes or updates the card we need to send to the receiver */
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
            res.status(400).json("The card is being used in another trade")
            return
        }

        if(card[0].number == 1) {
                var removeCard = {
                    $pull: {
                        "cards": {
                        "id": card[0].id
                        }
                    }
                    
                } 

                var response = await clientdb.db("AFSM").collection("Users").updateOne(filterRec, removeCard);
                if(response.modifiedCount == 0) {
                    res.status(500).json("Server error: failed to remove the cards of the receiver")
                    return
                }
        }
        else {
            var filterCards = {
                $and: [
                    { "username": usernameRec,
                      "cards.id" : card[0].id } 
                ]
            }

            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
            if(response.modifiedCount == 0) {
                res.status(500).json("Server error: failed to update the number of the cards of the receiver")
                return
            }
        }
    }

    console.log("usernameRec updated")

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
            res.status(500).json("Server error: failed to add cards")
            return
        }
    }

    console.log("cardSend deleted")

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
            res.status(500).json("Server error: failed to add cards")
            return
        }
    }   

    console.log("cardRec deleted")

    /* Deletes the trade */
    var filter = {
        $and: [
            { "_id": id },
        ]
    }

    var response = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
    if(response.deletedCount == 0) {
        res.status(500).json("Server error: failed to remove the trade")
        return
    }
    else {
        console.log("trade deleted")
        res.status(200).json("The trade was successful!");
    }
}

module.exports = { getTrades, getTrade, createTrade, deleteTrade, acceptTrade }