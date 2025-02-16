/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /alltrades */
/* Returns all the trades in the db */
const getTrades = async (req,res) => {
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

    try {
        var result = await clientdb.db("AFSM").collection("Trades").findOne(filter);
        res.json(result)
    }
    catch (e) {
        console.log(e)
    }
}

/* POST - /trade/:username */
/* Given the trade info creates a trade in the db */
const createTrade = async (req,res) => {
    username = req.params.username
    name = req.body.name
    receive = req.body.heroReceive
    send = req.body.heroSend

    if(name == '') {
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

    try {
        var result = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
        res.json(result);
    }
    catch (e) {
        console.log(e)
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

    console.log("usernameSend updated")

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
            res.status(401).send("Failed to add cards")
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
            res.status(401).send("Failed to add cards")
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

    try {
        var result = await clientdb.db("AFSM").collection("Trades").deleteOne(filter);
        console.log("trade deleted")
        res.json(result);
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { getTrades, getTrade, createTrade, deleteTrade, acceptTrade }