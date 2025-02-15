/* TRADES.HTML */
/* Updates all the values to show all the trades */
function showTrades() {
    pageMin = 1
    pageMax = Math.ceil(trades.length / 20)
    page = 1
    mode = "all"

    document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
    document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`

    populateTrades(username, trades, page)
}

/* Updates all the values to show all the user trades */
function showUserTrades() {
    pageMin = 1
    pageMax = Math.ceil(trades.length / 20)
    page = 1
    mode = "user"

    document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
    document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`

    populateUserTrades(username, trades, page)
}

/* Writes all the trades in the page */
function populateTrades(username, trades, page) {
    /* Gets 50 trades based on the current page */
    end = page * 20 
    start = end - 20 

    document.getElementById("selectTradesButton").innerHTML = `<button class="btn btn-primary" onclick="showUserTrades()">Mostra gli scambi dell'utente</button>`

    document.getElementById("addTradeButton").innerHTML = ``

    /* Clears the html to be repopulated */
    const tradesRow = document.getElementById("trades");
    tradesRow.innerHTML = ``

    /* Populate with new cards */
    for(i = start; i < end; i++) {
        if(trades[i].username != username) {
            namesReceive = ""
            namesSend = ""
            for(j = 0; j < trades[i].receive.length; j++) {
                namesReceive += `${trades[i].receive[j].name}. `
            }
            for(j = 0; j < trades[i].send.length; j++) {
                namesSend += `${trades[i].send[j].name}. `
            }

            tradesRow.innerHTML += 
            `
            <button class="btn row p-3 m-3 border rounded" style="text-align:left;" onclick='getTradeId("${trades[i]._id}")'>
                <p> Nome: ${trades[i].name}</p>
                <p> Utente: ${trades[i].username} </p>  
                <p> Carte proposte: ${namesSend}</p>
                <p> Carte richieste: ${namesReceive}</p>
            </button>
            `;
        }
    }
}

/* Writes all the user trades in the page */
function populateUserTrades(username, trades, page) {
    /* Gets 50 user trades based on the current page */
    end = page * 20 
    start = end - 20 

    document.getElementById("selectTradesButton").innerHTML = `<button class="btn btn-primary" onclick="showTrades()">Mostra tutti gli scambi</button>`

    document.getElementById("addTradeButton").innerHTML = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tradeModal">(+) Aggiungi scambio</button>`

    /* Clears the html to be repopulated */
    const tradesRow = document.getElementById("trades");
    tradesRow.innerHTML = ``

    /* Populate with new user cards */
    for(i = start; i < end; i++) {
        if(trades[i].username == username) {
            namesReceive = ""
            namesSend = ""
            for(j = 0; j < trades[i].receive.length; j++) {
                namesReceive += `${trades[i].receive[j].name}. `
            }
            for(j = 0; j < trades[i].send.length; j++) {
                namesSend += `${trades[i].send[j].name}. `
            }

            tradesRow.innerHTML += 
            `
            <div class="row p-3 m-3 border rounded">
                <p> Nome: ${trades[i].name}</p>
                <p> Utente: ${trades[i].username} </p>  
                <p> Carte richieste: ${namesReceive}</p>
                <p> Carte proposte: ${namesSend}</p>
                <button class="btn btn-danger mb-4" onclick='deleteTrade("${trades[i]._id}")'>Rimuovi scambio</button>
            </div>
            `;
        }
    }
}

/* Shows the selectable cards to receive based on teh string given */
async function updateRecHero() {
    recHero = document.getElementById("recHero").value
    
    hero = await fetch("/marvelAPI", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "urlAPI" : "/characters",
                            "query" : `nameStartsWith=${recHero}`})
    })
        .then(response => response.json()).then(res => {updateTradeRec(res)})
        .catch(error => console.log('error', error));
}  

/* Receives the info of the searched hero to receive and displays it */
async function updateTradeRec(rec) {
    /* Populate the checkbox with cards to receive */
    var heroRecButtons = document.getElementById("heroRecButtons")
    heroRecButtons.innerHTML = ``

    for(i = 0; i < rec.length; i++) {
        id = rec[i].id 
        name = rec[i].name
        thumbnail = `${rec[i].thumbnail.path}.${rec[i].thumbnail.extension}`
    
        heroRecButtons.innerHTML += 
        `
        <button class="p-3 m-3 border rounded" onclick='selectRecHero(${id}, "${thumbnail}", "${name}")' id="card">
            <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
            <p>${name}</p>
        </button>
        `
    }
}

/* Shows the selectable cards to receive based on teh string given */
async function selectRecHero(id, thumbnail, name) {
    document.getElementById("savedRecButtons").innerHTML += 
    `
    <div class="p-3 m-3 border rounded" id="card">
        <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
        <p>${name}</p>
    </button>
    `   

    hero = {"id": id, "name": name, "thumbnail": thumbnail}
    heroReceive.push(hero)

    /* Clearing the send interface */
    document.getElementById("heroRecButtons").innerHTML = ``
    document.getElementById("recHero").value = ``
}

/* Receives the info of the searched hero to send and displays it */
async function updateSendHero() {
    sendHero = document.getElementById("sendHero").value.toLowerCase()
    username = localStorage.getItem("username")
    heroes = []

    userCards = await fetch(`/cards/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
    })
        .then(response => response.json()).then(res => {return res})
        .catch(error => console.log('Cannot get cards of the user', error));
    
    for(i = 0; i < userCards.length; i++) {
        name = userCards[i].name.toLowerCase()
        if(userCards[i].inTrade == false && userCards[i].number > 1 && name.includes(sendHero)) {
            heroes.push(userCards[i])
        }
    }

    updateTradeSend(heroes)
}

/* Receives the info of the searched hero to send and displays it */
async function updateTradeSend(send) {
    /* Populate with cards to send */
    var heroSendButtons = document.getElementById("heroSendButtons")
    heroSendButtons.innerHTML = ``

    for(i = 0; i < send.length; i++) {
        id = send[i].id 
        name = send[i].name
        thumbnail = `${send[i].thumbnail}`
    
        heroSendButtons.innerHTML += 
        `
        <button class="col p-3 m-3 border rounded" onclick='selectSendHero(${id}, "${thumbnail}", "${name}")' id="card">
            <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
            <p>${name}</p>
        </button>
        `
    }
}

/* Shows the selectable cards to send based on teh string given */
async function selectSendHero(id, thumbnail, name) {
    document.getElementById("savedSendButtons").innerHTML += 
    `
    <div class="col p-3 m-3 border rounded" id="card">
        <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
        <p>${name}</p>
    </div>
    ` 
    
    hero = {"id": id, "name": name, "thumbnail": thumbnail}
    heroSend.push(hero)

    /* Clearing the search interface */
    document.getElementById("heroSendButtons").innerHTML = ``
    document.getElementById("sendHero").value = ``
}


/* Adds a trade in the db */
async function addTrade() {
    username = localStorage.getItem("username")
    name = document.getElementById("inputName").value

    console.log(name)

    userCards = await fetch(`/cards/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }})
        .then(result => result.json()).then(res => { return res })

    
    /* Verifies that the requested card is not present in the user cards */
    for(i = 0; i < userCards.length; i++) {
        for(j = 0; j < heroReceive.length; j ++) {
            if(userCards[i].id == heroReceive[j].id) {
                alert("Carta richiesta già presente nell'album")
                document.getElementById("savedRecButtons").innerHTML = ``
                heroReceive = []
                return
            }
        }
    }

    /* Verifies that the sent cards are not duplicates */
    if(heroSend.length > 1) {
        for(i = 0; i <= heroSend.length-1; i++) {
            for(j = i+1; j < heroSend.length; j++) {
                if(heroSend[i].id == heroSend[j].id) {
                alert("Le carte da mandare sono uguali")
                document.getElementById("savedSendButtons").innerHTML = ``
                heroSend = []
                return
                }
            }
        }
    }

    /* Inserts the trade in the db */
    await fetch(`/trade/${username}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({  "name": name,
                                "heroSend": heroSend,
                                "heroReceive": heroReceive })
    })
    .then(result => result.json()).then(res => console.log(res))
    .catch(error => console.log('Scambio non aggiunto correttamente', error));  
    
    /* Updates the value of inTrade of the user cards */
    for(i = 0; i < heroSend.length; i++) {
        await fetch(`/card/${heroSend[i].id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({  "username": username })
        })
        .then(result => result.json()).then(res => console.log(res))
        .catch(error => console.log('Aggiornamento carte inTrade non andato', error));  
    }

    clearModal()

    location.reload()
}

function getTradeId(id) {
    localStorage.setItem("tradeId", id)  
    window.location.href = "/trade";  
}

/* It changes inTrade values and then deletes the trade */
async function deleteTrade(id) {
    username = localStorage.getItem("username")

    /* gets all the info of the trade */
    trade = await fetch(`/trade/${id}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    })
    .then(result => result.json()).then(res => {return res})
    .catch(error => console.log('Aggiornamento carte inTrade non andato', error));  

    /* Updates to false the value inTrade of all the cards to send */
    for(i = 0; i < trade.send.length; i++) {
        await fetch(`/card/${trade.send[i].id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({  "username": username })
        })
        .then(result => result.json()).then(res => console.log(res))
        .catch(error => console.log('Aggiornamento carte inTrade non andato', error));  
    }

    /* Deletes the trade */
    await fetch(`/trade/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
    })
        .then(result => result.json()).then(res => console.log(res))
        .catch(error => console.log('Scambio non eliminato correttamente', error));  

    location.reload()
}

/* When a user exits the modal everything is cancelled */
function clearModal() {
    document.getElementById("inputName").value = ``
    document.getElementById("recHero").value = ``
    document.getElementById("sendHero").value = ``
    document.getElementById("savedRecButtons").innerHTML = ``
    document.getElementById("heroRecButtons").innerHTML = ``
    document.getElementById("savedSendButtons").innerHTML = ``
    document.getElementById("heroSendButtons").innerHTML = ``
    heroSend = []
    heroReceive = []
}

/* Function to go to previous page and populate it */
function nextTrade() {
    if (page < pageMax) {
        page = page + 1
        document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
        document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`
        if(mode == "all") {
            populateTrades(username, trades, page)}
        else {
            populateUserTrades(username, trades, page)
        }
    }
}

/* Function to go to previou page and populate it */
function prevTrade() {
    if (page > 1) {
        page = page - 1
        document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
        document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`
        if(mode == "all") {
            populateTrades(username, trades, page)}
        else {
            populateUserTrades(username, trades, page)
        }
    }
}