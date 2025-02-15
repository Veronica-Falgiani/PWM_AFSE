const express = require("express");
var cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require("dotenv").config();

/* Import my functions */
const { generateSession, validateSession, refreshSession, logoutSession, addUser, loginUser, logout } = require('./src/lib/session')
const { getCards, getUserCards, addCards, getCard, getCardUser, modifyTradeCard, removeCard } = require('./src/lib/cards')
const { getCredits, addCredits, decreaseCredits } = require('./src/lib/credits')
const { getUserInfo, updateUser, deleteUser } = require('./src/lib/user')
const { getTrades, getTrade, createTrade, deleteTrade, acceptTrade } = require('./src/lib/trades')
const { getFromMarvel } = require('./src/lib/marvel')

/* Mongodb setup */
const mongodbURI = process.env.MONGODB_URI;

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

app.get("/profile", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
    
    res.sendFile(path.join(__dirname, "src/html/profile.html"));
})

app.get("/credits", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
       
    res.sendFile(path.join(__dirname, "src/html/credits.html"));
})

app.get("/packs", (req,res) => {
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
    res.sendFile(path.join(__dirname, "src/html/packs.html"));
})

app.get("/trades", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
    res.sendFile(path.join(__dirname, "src/html/trades.html"));
})

app.get("/album", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
    res.sendFile(path.join(__dirname, "src/html/album.html"));
})

app.get("/card", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
    res.sendFile(path.join(__dirname, "src/html/card.html"));
})

app.get("/trade", (req,res) =>{
    /* Verifying cookies */ 
    if(!validateSession(req.cookies)) {
        res.status(400).send("Unauthorized user")
        return
    }
    /* Refresh cookies session */ 
    token = refreshSession(req.cookies)
    if (!token) {
        res.status(400).send("Unauthorized user")
        return
    }
    res.cookie("session_token", token.sessionToken, { expires: token.expiresAt })
        
    res.sendFile(path.join(__dirname, "src/html/trade.html"));
})


/* ---- Communicate with the marvel API ---- */
app.post("/marvelAPI", (req,res) => {
    getFromMarvel(req,res);
})

/* ---- CREATE NEW USER ---- */
app.post("/register", function (req, res) {
    addUser(req, res);
})

/* ---- LOGIN AS USER ---- */
app.post("/login", async (req, res) => {
    loginUser(req, res);
})

app.post("/logout", (req,res) => {
    logout(req,res) 
})

/* ---- GET USER INFO ---- */
app.get("/user/:username", async(req,res) => {
    getUserInfo(req,res);
})

/* ---- UPDATE USER ---- */
app.put("/user/:username", (req, res) => {
    updateUser(req,res);
})

/* ---- DELETE USER ---- */
app.delete("/user/:username", (req, res) => {
    deleteUser(req,res);
})

/* ---- GET CREDITS ---- */
app.get("/credits/:username", (req,res) => {
    getCredits(req,res);
})

/* ---- INCREASE CREDITS ---- */
app.post("/addCredits/:username", (req,res) =>{
    addCredits(req,res);
})

/* ---- DECREASE CREDITS ---- */
app.post("/decreaseCredits/:username", (req,res) =>{
    decreaseCredits(req,res);
})

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

/* ---- GET A SINGLE TRADE ---- */
app.get("/trade/:id", (req,res) => {
    getTrade(req,res)
})

/* ---- CREATE TRADES ---- */
app.post("/trade/:username", (req,res) => {
    createTrade(req,res)
})

/* ---- DELETE TRADE AND SETS INTRADE TO FALSE ---- */
app.delete("/trade/:id", (req,res) => {
    deleteTrade(req,res)
})

/* ---- ACCEPTS THE TRADE BETWEEN THE USERS ---- */
app.post("/acceptTrade/:id", (req,res) => {
    acceptTrade(req,res)
})