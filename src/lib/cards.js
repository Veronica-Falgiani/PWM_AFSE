/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* GET - /cards */
/* Returns all the cards present in the db */
const getCards = async (req,res) => {
    var clientdb = await new mongoClient(mongodbURI).connect();

    var cards = await clientdb.db("AFSM").collection("Cards").find().toArray();
    
    if(cards == null) {
        res.status(500).json("Server error: failed to fetch cards")
    }
    else {
        res.status(200).json(cards)
    }   
}

/* GET - /cards/:username */
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
        res.status(500).json("Server error: failed to fetch user cards")
    } else {
        res.status(200).json(userInfo.cards)
    } 
}

/* POST - /cards/:username */
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
                res.status(500).json("Server error: failed to add the card")
            }
        }
        /* If the card is present, it will update the number of cards obtained */
        else {
            var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, increment);
            if (response.modifiedCount == 0) {
                res.status(500).json("Server error: failed to update number of card")
            }
        }
    }

    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, removeCredits);
    
    if (response.modifiedCount == 0) {
        res.status(500).json("Server error: failed to remove credits")
        return
    }

    var userInfo = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if (userInfo == null) {
        res.status(500).json("Server error: failed to fetch user info")
    } else {
        res.status(200).json(userInfo)
    } 
}

/* GET - /card/:id */
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
        res.status(500).json("Server error: failed to fetch card")
    } else {
        res.status(200).json(card)
    } 
}

/* GET - /card/:username */
/* Returns a single card of the user */
const getCardUser = async (req,res) => {
    var username = req.params.username
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
        res.status(500).json("Server error: failed to fetch card of the user")
    } else {
        res.status(200).json(card)
    } 
}

/* PUT - /card/:username */
/* Updates trade value of a card of the user */
const modifyTradeCard = async (req,res) => {
    var username = req.params.username
    var id = req.body.id
    
    var clientdb = await new mongoClient(mongodbURI).connect();

    var filter = {
        $and: [
            { "username": username }
        ]
    }

    console.log(username, id)

    user = await clientdb.db("AFSM").collection("Users").findOne(filter);

    if(user == null) {
        res.status(500).json("Server error: failed to fetch user info")
        return
    }

    console.log(user, id)

    for(i = 0; i < user.cards.length; i++) {
        console.log(user.cards[i], id)
        if(user.cards[i].id == id) {
            console.log(user.cards[i].id)
            if(user.cards[i].inTrade == true) {
                console.log("true -> false")
                var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, { $set : {[`cards.${i}.inTrade`]: false} });
                if (response.modifiedCount == 0) {
                    res.status(500).json("Server error: failed to update trade status of card")
                    return
                }
            }
            else if(user.cards[i].inTrade == false) {
                console.log("false -> true")
                var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, { $set : {[`cards.${i}.inTrade`]: true} });
                if (response.modifiedCount == 0) {
                    res.status(500).json("Server error: failed to update trade status of card")
                    return
                }
            }
        }
    }

    res.status(200).json("Updated card successfully")
}

/* DELETE - /card/:username */
/* Removes a card from the collection of the user and updates its values */
const removeCard = async (req,res) => {
    var username = req.params.username
    var id = req.body.id

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
    
    /* Only cards not in trade can be deleted */
    if(card[0].inTrade == true) {
        res.status(400).json("Can't sell, the card is blocked in a trade")
        return
    }

    /* Deletes the card from the collection of the user */
    if(card[0].number == 1) {
        var removeCard = {
            $pull: {
                "cards": {
                "id": card[0].id
                }
            }
            
        } 

        var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, removeCard);
        if(response.modifiedCount == 0) {
            res.status(500).json("Server error: failed to remove a card")
            return
        }
    }
    /* Or decreases the value of the number of cards if there are many */
    else {
        var filterCards = {
            $and: [
                { "username": username,
                  "cards.id" : card[0].id } 
            ]
        }
        
        var response = await clientdb.db("AFSM").collection("Users").updateOne(filterCards, decrement);
        if(response.modifiedCount == 0) {
            res.status(500).json("Server error: failed to update number of card")
            return
        }
    }

    var increment = { 
        $inc : {"credits": 0.1} 
    } 

    
    var response = await clientdb.db("AFSM").collection("Users").updateOne(filter, increment);
    if(response.modifiedCount == 0) {
        res.status(500).json("Server error: failed to increment credits")
        return
    }

    var user = await clientdb.db("AFSM").collection("Users").findOne(filter);
    if(user == null) {
        res.status(500).json("Server error: failed to fetch user")
    }
    else {
        res.status(200).json(user)
    }
}

module.exports = { getCards, getUserCards, addCards, getCard, getCardUser, modifyTradeCard, removeCard }