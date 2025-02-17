const express = require("express");
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./src/api/swagger");
require("dotenv").config();

/* Import my functions */
const { validateSession, refreshSession, addUser, loginUser, logout } = require('./src/lib/session')
const { getUserInfo, updateUser, deleteUser } = require('./src/lib/user')
const { getFromMarvel } = require('./src/lib/marvel')
const { getCredits, changeCredits } = require('./src/lib/credits')
const { getCards, getUserCards, addCards, getCard, getCardUser, modifyTradeCard, removeCard } = require('./src/lib/cards')
const { getTrades, getTrade, createTrade, deleteTrade, acceptTrade } = require('./src/lib/trades')


/* Start server */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
/* Swagger setup */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

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


/* ---- COMMUNICATE WITH THE MARVEL API ---- */
/* Inside: MARVEL.JS */
app.post("/marvelAPI", (req,res) => {
    getFromMarvel(req,res);
})



/* ---- CREATE NEW USER ---- */
/* Inside: SESSION.JS */
app.post("/register", function (req, res) {
    addUser(req, res);
})

/* ---- LOGIN AS USER ---- */
/* Inside: SESSSION.JS */
app.post("/login", async (req, res) => {
    loginUser(req, res);
})

/* ---- LOGOUT THE USER ---- */
/* Inside: SESSION.JS */
app.post("/logout", (req,res) => {
    logout(req,res) 
})



/* ---- GET USER INFO ---- */
/* Inside: USER.JS */
app.get("/user/:username", async(req,res) => {
    getUserInfo(req,res);
})

/* ---- UPDATE USER ---- */
/* Inside: USER.JS */
app.put("/user/:username", (req, res) => {
    updateUser(req,res);
})

/* ---- DELETE USER ---- */
/* Inside: USER.JS */
app.delete("/user/:username", (req, res) => {
    deleteUser(req,res);
})



/* ---- GET CREDITS ---- */
/* Inside: CREDITS.JS */
app.get("/credits/:username", (req,res) => {
    getCredits(req,res);
})

/* ---- CHANGE CREDITS ---- */
/* Inside: CREDITS.JS */
app.post("/credits/:username", (req,res) =>{
    changeCredits(req,res);
})



/* ---- GET ALL CARDS ---- */
/* Inside: CARDS.JS */
app.get("/cards", (req,res) => {
    getCards(req,res);
})

/* ---- GET CARDS OF THE USER ---- */
/* Inside: CARDS.JS */
app.get("/cards/:username", (req,res) => {
    getUserCards(req,res);
})

/* ---- ADD CARDS TO PROFILE ---- */
/* Inside: CARDS.JS */
app.post("/cards/:username", (req, res) => {
    addCards(req,res);
})

/* ---- GET A SINGLE CARD ---- */
/* Inside: CARDS.JS */
app.get("/card/:id", (req,res) => {
    getCard(req,res);
})

/* ---- GET A SINGLE USER CARD ---- */
/* Inside: CARDS.JS */
app.post("/card/:username", (req,res) => {
    getCardUser(req,res);
})

/* ---- UPDATE A CARD WHEN USED OR DELETED FROM A TRADE ---- */
/* Inside: CARDS.JS */
app.put("/card/:username", (req,res) => {
    modifyTradeCard(req,res);
})

/* ---- UPDATE A CARD WHEN USED OR DELETED FROM A TRADE ---- */
/* Inside: CARDS.JS */
app.delete("/card/:username", (req,res) => {
    removeCard(req,res);
})



/* ---- GET ALL TRADES ---- */
/* Inside: TRADES.JS */
app.get("/alltrades", (req,res) => {
    getTrades(req,res);
})

/* ---- GET A SINGLE TRADE ---- */
/* Inside: TRADES.JS */
app.get("/trade/:id", (req,res) => {
    getTrade(req,res)
})

/* ---- CREATE TRADES ---- */
/* Inside: TRADES.JS */
app.post("/trade", (req,res) => {
    createTrade(req,res)
})

/* ---- DELETE TRADE AND SETS INTRADE TO FALSE ---- */
/* Inside: TRADES.JS */
app.delete("/trade/:id", (req,res) => {
    deleteTrade(req,res)
})

/* ---- ACCEPTS THE TRADE BETWEEN THE USERS ---- */
/* Inside: TRADES.JS */
app.post("/acceptTrade/:id", (req,res) => {
    acceptTrade(req,res)
})