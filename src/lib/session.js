const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const mongodbURI = process.env.MONGODB_URI;

/* Function used to encrypt/decrypt passwords */
function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

/* Simple class to create a session token */
class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

	/* Determine if session has expired */
    isExpired() {
        this.expiresAt < (new Date())
    }
}

/* We save locally all the session tokens */
const sessions = {}

const generateSession = (username) => {
    /* Crating a session token that lasts 30 minutes */
    const sessionToken = uuidv4()
    const now = new Date()
    const expiresAt = new Date(+ now + 360 * 1000)

    /* We create and store the info inside "sessions" */
    const session = new Session(username, expiresAt)
    sessions[sessionToken] = session

    /* We send the cookie to the user's browser */
    return {"sessionToken": sessionToken, "expiresAt": expiresAt}
}

/* Returns false if the cookie is not valid, true if it's ok */
const validateSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        return false
    }

    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        return false
    }

    return true
}

/* Verifies that the cookie is valid and then it will regenerate it */
const refreshSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    userSession = sessions[sessionToken]
    if (!userSession) {
        return false
    }
    if (userSession.isExpired()) {
        delete sessions[sessionToken]
        return false
    }
   
    /* If the cookie is valid it will regenerate it */
    const newSessionToken = uuidv4()
    const now = new Date()
    const expiresAt = new Date(+now + 1800 * 1000)

    /* We create and store the info inside "sessions" */
    const session = new Session(userSession.username, expiresAt)
    sessions[newSessionToken] = session

    /* We send the cookie to the user's browser */
    return {"sessionToken": newSessionToken, "expiresAt": expiresAt}
}

/* Verifies that the cookie is valid and then deletes it */
const logoutSession = (cookies) => {
    /* Various checks to see that the cookie is present and valid */
    if (!cookies) {
        return false
    }

    const sessionToken = cookies['session_token']
    if (!sessionToken) {
        return false
    }

    delete sessions[sessionToken]

    return true
}

/* Verifies that fields are filled and registers a new user on the db */
const addUser = async (req, res) => {
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

/* Compares the credentials given to the ones on the db and log ins the user */
const loginUser = async (req, res) => {
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

/* Logs out the user by deleting the session cookie */
const logout = (req,res) => {
    if(!logoutSession(req.cookies)) {
        res.status(400).json("Errore nel logout")
        return
    }
    res.status(200).json("Logout effettuato con successo")
}

module.exports = { generateSession, validateSession, refreshSession, logoutSession, addUser, loginUser, logout }