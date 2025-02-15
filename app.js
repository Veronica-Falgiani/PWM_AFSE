const express = require("express");
var cors = require('cors');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = require('url');   
const crypto = require('crypto');
const { maxHeaderSize } = require("http");
const { receiveMessageOnPort } = require("worker_threads");
const cookieParser = require('cookie-parser');
require("dotenv").config();

/* Import my functions */
const { generateSession, validateSession, refreshSession, logoutSession } = require('./src/lib/session')
const { getCards, getUserCards, addCards, getCard, getCardUser, modifyTradeCard, removeCard } = require('./src/lib/cards')


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
app.use(cookieParser());

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => console.log("Server up on port 3100"));


/* Serving static files in express */
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/src/html/")));
app.use(express.static(path.join(__dirname, "/src/html/scripts")));
app.use(express.static(path.join(__dirname, "/src/css/")));
app.use(express.static(path.join(__dirname, "/src/lib/")));


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
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/register", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/register.html"));
})

app.get("/login", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/login.html"));
})


/* Verifying cookies 
if(!validateSession(req.cookies)) {
    res.status(400).send("Unauthorized user")
    return
}
/* Refresh cookies session 
token = refreshSession(req.cookies)
if (!token) {
    res.status(400).send("Unauthorized user")
    return
}
res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
*/

app.get("/profile", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/profile.html"));
})

app.get("/credits", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/credits.html"));
})

app.get("/packs", (req,res) => {
    res.sendFile(path.join(__dirname, "src/html/packs.html"));
})

app.get("/trades", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/trades.html"));
})

app.get("/album", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/album.html"));
})

app.get("/card", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/card.html"));
})

app.get("/trade", (req,res) =>{
    res.sendFile(path.join(__dirname, "src/html/trade.html"));
})


/* ---- Communicate with the marvel API ---- */
app.post("/marvelAPI", (req,res) => {
    getFromMarvel(req,res);
})

/* Main function to talk to the marvel API */
async function getFromMarvel(req,res) {
    urlAPI = req.body.urlAPI
    query = req.body.query

    var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
    var timestamp = Date.now();
    var publicApiKey = process.env.PUBLIC_MARVEL_KEY
    var privateApiKey = process.env.PRIVATE_MARVEL_KEY
    var parameters = `ts=${timestamp}&apikey=${publicApiKey}&hash=${MD5(timestamp+privateApiKey+publicApiKey)}&`
  
    console.log(`Request string: http://gateway.marvel.com/v1/public/${urlAPI}?${parameters}${query}`)

    response = await fetch(`http://gateway.marvel.com/v1/public/${urlAPI}?${parameters}${query}`)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    if(response == undefined) {
        res.status(500).send("Errore con le API marvel")
    }
    else {
        res.status(200).json(response.data.results) 
    }
}

/* ---- CREATE NEW USER ---- */
app.post("/register", function (req, res) {
    addUser(req, res);
})

/* Verifies that fields are filled and registers a new user on the db */
async function addUser(req, res) {
    let user = req.body;

    var clientdb = await new mongoClient(mongodbURI).connect()
    var users = await clientdb.db("AFSM").collection("Users").find().toArray()

    for(i = 0; i < users.length; i++) {
        if(user.username == users[i].username) {
            res.status(400).send("Username già presente")
            return
        }
    }

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
            
            /* Generate and sens a session token as a cookie */
            token = generateSession(username)
            res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
            
            res.status(200).json(userInfo)
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

    if (loggedUser == null) {
        res.status(400).send("Non è stato trovato un utente!")
    } else {
        /* Generate and sens a session token as a cookie */
        token = generateSession(username)
        res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
        res.status(200).json(loggedUser)
    }
}

app.post("/logout", (req,res) => {
    logout(req,res) 
})

function logout(req,res) {
    if(!logoutSession(req.cookies)) {
        res.status(400).json("Errore nel logout")
        return
    }
    res.status(200).json("Logout effettuato con successo")
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


/* ---- INCREASE CREDITS ---- */
app.post("/addCredits/:username", (req,res) =>{
    addCredits(req,res);
})

/* Updates db with incremented credits an then returns the value of credits */
async function addCredits(req,res) {
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

/* ---- DECREASE CREDITS ---- */
app.post("/decreaseCredits/:username", (req,res) =>{
    decreaseCredits(req,res);
})

/* Updates db with incremented credits an then returns the value of credits */
async function decreaseCredits(req,res) {
    let creditsToADecrease = req.body.creditsToDecrease;
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


/* ---- GET ALL CARDS ---- */
app.get("/cards", (req,res) => {
    getCards(req,res);
})


/* ---- GET CARDS OF THE USER ---- */
app.get("/cards/:username", (req,res) => {
    getUserCards(req,res);
})

/* ---- ADD CARDS TO PROFILE ---- */
app.post("/cards/:username", (req, res) => {
    addCards(req,res);
})

/* ---- GET A SINGLE CARD ---- */
app.get("/card/:id", (req,res) => {
    getCard(req,res);
})

/* ---- GET A SINGLE USER CARD ---- */
app.get("/card/:username", (req,res) => {
    getCardUser(req,res);
})

/* ---- UPDATE A CARD WHEN USED OR DELETED FROM A TRADE ---- */
app.put("/card/:id", (req,res) => {
    modifyTradeCard(req,res);
})

/* ---- UPDATE A CARD WHEN USED OR DELETED FROM A TRADE ---- */
app.delete("/card/:id", (req,res) => {
    removeCard(req,res);
})

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