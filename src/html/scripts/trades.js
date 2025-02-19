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

    document.getElementById("selectTradesButton").innerHTML = `<button class="btn btn-primary" onclick="showUserTrades()">Show user's trades</button>`

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
                <p> Title: ${trades[i].name}</p>
                <p> Username: ${trades[i].username} </p>  
                <p> Proposed cards: ${namesSend}</p>
                <p> Requested cards: ${namesReceive}</p>
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

    document.getElementById("selectTradesButton").innerHTML = `<button class="btn btn-primary" onclick="showTrades()">Show all trades</button>`

    document.getElementById("addTradeButton").innerHTML = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tradeModal">(+) Add trade</button>`

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
                <p> Title: ${trades[i].name}</p>
                <p> Username: ${trades[i].username} </p>  
                <p> Requested cards: ${namesReceive}</p>
                <p> Proposed cards: ${namesSend}</p>
                <button class="btn btn-danger mb-4" onclick='deleteTrade("${trades[i]._id}")'>Delete trade</button>
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
        .catch(error => alert("Marvel API: failed to fetch hero"));
}  

/* Receives the info of the searched hero to receive and displays it */
async function updateTradeRec(rec) {
    /* Populate the checkbox with cards to receive */
    var heroRecButtons = document.getElementById("heroRecButtons")
    heroRecButtons.innerHTML = ``

    for(i = 0; i < rec.length; i++) {
        id = rec[i].id 
        name = rec[i].name.replace(/'/g, " ")
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

    await fetch(`/cards/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
    })
    .then(result => {
        if(result.ok) {
            result.json().then(res => {
                console.log(res)
                userCards = res
                for(i = 0; i < userCards.length; i++) {
                    name = userCards[i].name.toLowerCase()
                    if(userCards[i].inTrade == false && userCards[i].number > 1 && name.includes(sendHero)) {
                        heroes.push(userCards[i])
                    }
                }
            
                updateTradeSend(heroes)
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alertModal", res)
                return
            })
        }
    })
}

/* Receives the info of the searched hero to send and displays it */
async function updateTradeSend(send) {
    /* Populate with cards to send */
    var heroSendButtons = document.getElementById("heroSendButtons")
    heroSendButtons.innerHTML = ``

    for(i = 0; i < send.length; i++) {
        id = send[i].id 
        heroName = send[i].name.replace(/'/g, " ")
        thumbnail = `${send[i].thumbnail}`

        heroSendButtons.innerHTML += 
        `
        <button class="col p-3 m-3 border rounded" onclick='selectSendHero(${id}, "${thumbnail}", "${heroName}")' id="card">
            <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
            <p>${heroName}</p>
        </button>
        `
    }
}

/* Shows the selectable cards to send based on the string given */
async function selectSendHero(id, thumbnail, heroName) {
    document.getElementById("savedSendButtons").innerHTML += 
    `
    <div class="col p-3 m-3 border rounded" id="card">
        <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
        <p>${heroName}</p>
    </div>
    ` 
    
    hero = {"id": id, "name": heroName, "thumbnail": thumbnail}
    heroSend.push(hero)

    /* Clearing the search interface */
    document.getElementById("heroSendButtons").innerHTML = ``
    document.getElementById("sendHero").value = ``
}


/* Adds a trade in the db */
async function addTrade() {
    username = localStorage.getItem("username")
    name = document.getElementById("inputName").value
    userCards = []

    await fetch(`/cards/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }})
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    userCards = res
                })
            }
        
            else {
                result.json().then(res => {
                    dangerAlert("alertModal", res)
                    return
                })
            }
        })
    
    /* Verifies that the requested card is not present in the user cards */
    for(i = 0; i < userCards.length; i++) {
        for(j = 0; j < heroReceive.length; j ++) {
            if(userCards[i].id == heroReceive[j].id) {
                dangerAlert("alertModal", "You already possess that card")
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
                    dangerAlert("alertModal", "Send and Receive cards are the same")
                    document.getElementById("savedSendButtons").innerHTML = ``
                    heroSend = []
                    return
                }
            }
        }
    }

    /* Inserts the trade in the db */
    await fetch(`/trade`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({  "name": name,
                                "username": username,
                                "heroSend": heroSend,
                                "heroReceive": heroReceive })
    })
    .then(result => {
        if(result.ok) {
            result.json().then(res => {
                successAlert("alertModal", res)
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alertModal", res)
                return
            })
        }
    })

    /* Updates the value of inTrade of the user cards */
    for(i = 0; i < heroSend.length; i++) {
        await fetch(`/card/${username}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({ "id": heroSend[i].id })
        })
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    setTimeout(function(){
                        clearModal();
                        location.reload();
                    }, 3000);
                })
            }
        
            else {
                result.json().then(res => {
                    dangerAlert("alertModal", res)
                    return
                })
            }
        })
    }
}

function getTradeId(id) {
    localStorage.setItem("tradeId", id);  
    window.location.href = "/trade";  
}

/* It changes inTrade values and then deletes the trade */
async function deleteTrade(id) {
    username = localStorage.getItem("username")
    trade = {}

    /* gets all the info of the trade */
    await fetch(`/trade/${id}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    })
    .then(result => {
        if(result.ok) {
            result.json().then(res => {
                trade = res
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alert", res)
                return
            })
        }
    })

    setTimeout(async function(){
        console.log(trade)

        /* Updates to false the value inTrade of all the cards to send */
        for(i = 0; i < trade.send.length; i++) {
            console.log(trade.send[i].name)
            await fetch(`/card/${username}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ "id": trade.send[i].id })
            })
            .then(result => {
                if(result.ok) {
                    result.json().then(res => {
                        successAlert("alert", res)
                    })
                }
            
                else {
                    result.json().then(res => {
                        dangerAlert("alert", res)
                        return
                    })
                }
            })
        }
    }, 2000);

    setTimeout(async function(){
        /* Deletes the trade */
        await fetch(`/trade/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            },
        })
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    successAlert("alert", res)
                    
                    setTimeout(function(){
                        location.reload();
                    }, 3000);
                })
            }
        
            else {
                result.json().then(res => {
                    dangerAlert("alert", res)
                    return
                })
            }
        })    
    }, 4000);
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