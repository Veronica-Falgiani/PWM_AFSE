/* Mongodb setup */
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var uri = "mongodb+srv://veronicafalgiani:NEPuCX3YD0DpAB19@afsm.wit5h.mongodb.net/";


/* Start server */
const express = require("express");
var cors = require('cors')
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3100;
const host = "0.0.0.0";

app.listen(port, host, () => console.log("Server up on port 3100"));


/* Serving static files in express so I can use them */
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "/css/")));
app.use(express.static(path.join(__dirname, "/html/")));
app.use(express.static(path.join(__dirname, "/js/")));
app.use(express.static(path.join(__dirname, "/img/")));


/* Auth */
const auth = require('js/auth').auth;


/* Get index page */
app.get("/", (req,res) =>{
  res.sendFile(path.join(__dirname, "html/index.html"));
})

/* Create a new user */
app.post("/users", auth, function (req, res) {
  addUser(res, req.body);
})

async function addUser(res, user) {

}

/* Register user */

/* Example node 
//Load HTTP module
const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello world\n");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/