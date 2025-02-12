/* Main function to talk to the server */
function getFromMarvel(url, query="") {
    var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
    var timestamp = Date.now();
    var publicApiKey = "d5c6dc14448d8d7bda781bb3315ccdd3"
    var privateApiKey = "1e433cea650dfd4fcc9cce795d7188f7c29b04df"
    var parameters = `ts=${timestamp}&apikey=${publicApiKey}&hash=${MD5(timestamp+privateApiKey+publicApiKey)}&`
  
    console.log(`Request string: http://gateway.marvel.com/v1/public/${url}?${parameters}${query}`)

    return fetch(`http://gateway.marvel.com/v1/public/${url}?${parameters}${query}`)
    .then(response => response.json())
    .catch(error => console.log('error', error));
}

/* MENU */
/* Unsets all the localstorage items to "logout" user */
function logoutUser() {
    localStorage.clear();
    window.location.href = "http://localhost:3100/";
}

/* REGISTER.HTML */
/* creates a select menu with a list of heroes */
function writeSelectHeroes(heroesJson) {
    heroesJson = (JSON.stringify(heroesJson));
    const heroes = JSON.parse(heroesJson);

    var inputHero = document.getElementById("inputHero")
    var lenHeroes = heroes.length
    for (i = 0; i < lenHeroes; i++) {
        var opt = document.createElement("option")
        opt.value = heroes[i].id
        opt.innerHTML = heroes[i].name
        inputHero.appendChild(opt)
    }
}

/* creates a select menu with a list of series */
function writeSelectSeries(seriesJson) {
    seriesJson = (JSON.stringify(seriesJson));
    const series = JSON.parse(seriesJson);

    var inputSeries = document.getElementById("inputSeries")
    var lenSeries = series.length
    for (i = 0; i < lenSeries; i++) {
        var opt = document.createElement("option")
        opt.value = series[i].id
        opt.innerHTML = series[i].title
        inputSeries.appendChild(opt)
    }
}

/* PROFILE.HTML */
/* Prints the description of the user in the profile page */
function writeProfile() {
    username = localStorage.getItem("username") 
    email = localStorage.getItem("email")
    credits = localStorage.getItem("credits")
    hero = localStorage.getItem("hero")
    series = localStorage.getItem("series")
    const profilo = document.getElementById("profilo")
    profilo.innerHTML = 
    `
    <h3> Profilo </h3>
    <hr>
    <p> Nome: ${username}</p>
    <p> Mail: ${email}</p>
    <p> Password: ******</p>
    <p> Crediti: ${credits} </p>
    <p> Eroe preferito: ${hero} </p>
    <p> Serie preferita: ${series} </p>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modifyModal">Modifica profilo</button>
    <hr>
    <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Elimina profilo</button>
    `
}

/* CREDITS.HTML */
/* Populates the euros field inside the modal and saves it in the localStorage*/
function setCredits(eur) {
    document.getElementById("importo").innerHTML = `Importo: ${eur}€`
    creditsToAdd = eur / 5
    localStorage.setItem("creditsToAdd", creditsToAdd)
}

/* Takes the values from local storage and adds credits based on them */
async function addCredits() {
    creditsToAdd = localStorage.getItem("creditsToAdd")
    username = localStorage.getItem("username")

    await fetch("http://localhost:3100/credits", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "creditsToAdd" : creditsToAdd, 
                               "username" : username})
    })
        .then(response => response.json()).then(res => {
            localStorage.removeItem("euros")
            crediti = localStorage.setItem("credits", res)
            document.getElementById("crediti").innerHTML = `Totale crediti: ${res}`
        })
        .catch(error => console.log('error', error));
}


/* PACKS.HTML */
/* Populates the euros field inside the modal and saves it in the localStorage*/
function setCards(num, cred) {
    localStorage.setItem("cards", num)
    localStorage.setItem("packCreds", cred)
}

/* return id, name and image of a randomly picked hero in the marvel api */
async function getRandomHero() {
    maxHero = 1564;
    num = Math.floor(Math.random() * maxHero);

    hero = getFromMarvel("/characters", `limit=1&offset=${num}`).then(result => {return result.data.results[0]})
    console.log(hero)

    return hero
}

function writeCards(heroes) {
    const modalPacks = document.getElementById("cardModal");
    modalPacks.innerHTML = 
    `
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
        <h3 class="modal-title fs-5" id="modalLabel">Carte trovate</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row" id="bodyModal">
            </div>
        </div>
    </div>
    `;

    for(i = 0; i < heroes.length; i++) {
        const modalBody = document.getElementById("bodyModal");
        bodyModal.innerHTML += 
        `
        <div class="col p-3 m-3 border rounded">
            <img src="${heroes[i].thumbnail}" width="100px" height="100px">
            <br>
            ${heroes[i].name} 
        </div>
        `
    }
}

/* ALBUM.HTML*/
/* Updates all the values to show all the cards */
function showCards() {
    pageMin = 1
    pageMax = 32
    page = 1
    mode = "all"

    document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
    document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`

    populateCards(allCards, userCards, page)
}

/* Updates all the values to show the user cards */
function showUserCards() {
    pageMin = 1
    pageMax = Math.ceil(userCards.length / 50)
    page = 1
    mode = "user"

    document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
        document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`

    populateUserCards(userCards, page)
}

/* Prints 50 cards for the current page */
function populateCards(allCards, userCards, page) {
    /* Gets 50 cards based on the current page */
    end = page * 50 // 100
    start = end - 50 // 50
    found = 0
    num = 0

    document.getElementById("selectAlbumButton").innerHTML = `<button class="btn btn-primary" onclick="showUserCards()">Mostra carte utente</button>`

    /* Clears the html to be repopulated */
    const cardsRow = document.getElementById("cards");
    cardsRow.innerHTML = ``

    /* Populate with new cards */
    for(i = start; i < end; i++) {
        for(j = 0; j < userCards.length; j++) {
            if(allCards[i].id == userCards[j].id) {
                found = 1
                num = userCards[j].number
            }
        }
        /* If the card is not found in the user db it's grayed out */
        if (found == 0) {
            cardsRow.innerHTML += 
            `
            <button class="col p-3 m-3 border rounded" onclick="getCard(${allCards[i].id}, 'unobtained')">
                <img class="mb-3" src="${allCards[i].thumbnail}" width="100px" height="100px" id="unobtained" style="filter: grayscale(100%)">  
                <p> ${allCards[i].name}</p>
            </button>
            `;
        }
        /* If the card is found in the user db it is clickable and shows the amount */
        else {
            cardsRow.innerHTML += 
            `
            <button class="col btn btn-danger p-3 m-3 border rounded" onclick="getCard(${allCards[i].id}, 'obtained')">
                <img class="mb-3" src="${allCards[i].thumbnail}" width="100px" height="100px">  
                <p> (${num}) ${allCards[i].name}</p>
            </button>
            `;
            found = 0
        }
    }
}

/* Prints 50 cards of the user */
function populateUserCards(userCards, page) {
    /* Gets 50 cards based on the current page */
    end = page * 50 // 100
    start = end - 50 // 50

    document.getElementById("selectAlbumButton").innerHTML = `<button class="btn btn-primary" onclick="showCards()">Mostra tutte le carte</button>`
    // TODO ADD USER CARDS CLICKABEL AND THE OTHERS NOT

    /* Clears the html to be repopulated */
    const cardsRow = document.getElementById("cards");
    cardsRow.innerHTML = ``

    /* Populate with new cards */
    for(i = start; i < end; i++) {
        cardsRow.innerHTML += 
        `
        <button class="col p-3 m-3 border rounded" onclick="getCard(${userCards[i].id}, 'obtained')">
            <img class="mb-3" src="${userCards[i].thumbnail}" width="100px" height="100px">  
            <p> (${userCards[i].number}) ${userCards[i].name}</p>
        </button>
        `;
    }
}

/* Function to go to next page and populate it */
function prevAlbum() {
    if (page > 1) {
        page = page - 1
        document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
        document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`
        if(mode == "all") {
            populateCards(allCards, userCards, page)}
        else {
            populateUserCards(userCards, page)
        }
    }
}

/* Function to go to previous page and populate it */
function nextAlbum() {
    if (page < pageMax) {
        page = page + 1
        document.getElementById("currentPageUp").innerHTML = `${page}/${pageMax}`
        document.getElementById("currentPageDown").innerHTML = `${page}/${pageMax}`
        if(mode == "all") {
            populateCards(allCards, userCards, page)}
        else {
            populateUserCards(userCards, page)
        }
    }
}

/* Gets the value id of the card and then redirects to /card */
function getCard(id, status) {
    localStorage.setItem("heroId", id)  
    localStorage.setItem("status", status)
    window.location.href = "/card";  
}

/* CARD.HTML */
/* prints all the info about a character in an html format */
function writeHero(heroJson, status) {
    heroJson = (JSON.stringify(heroJson));
    const hero = JSON.parse(heroJson);

    const card = document.getElementById('card');

    if(status == 'unobtained') {
        card.innerHTML =
        `
        <h3> ${hero[0].name} </h3>
        <hr>
        <img class="mb-3" src="${hero[0].thumbnail.path}.${hero[0].thumbnail.extension}" width="300px" height="300px">  
        <h4> Descrizione: </h4>
        <p>${hero[0].description}</p>
        `
        return
    }

    /* saving all the comics in a list */
    const lenComics = hero[0].comics.returned
    console.log(lenComics)
    var comics = ``;
    for(let i = 0; i < lenComics; i++) {
        comics += `<li>${hero[0].comics.items[i].name}</li>\n`
    }

    /* saving all the series in a list */
    const lenSeries = hero[0].series.returned
    var series = ``;
    for(let i = 0; i < lenSeries; i++) {
        series += `<li>${hero[0].series.items[i].name}</li>\n`
    }

    /* saving all the events in a list */
    const lenEvents = hero[0].events.returned
    var events = ``;
    for(let i = 0; i < lenEvents; i++) {
        events += `<li>${hero[0].events.items[i].name}</li>\n`
    }

    card.innerHTML =
    `
    <h3>${hero[0].name} </h3>
    <hr>
    <img class="mb-3" src="${hero[0].thumbnail.path}.${hero[0].thumbnail.extension}" width="300px" height="300px">  
    <h4> Descrizione: </h4>
    <p>${hero[0].description}</p>
    <h4> Fumetti: </h4>
    <ul>
    ${comics}
    </ul>
    <h4> Serie: </h4>
    <ul>
    ${series}
    </ul>
    <h4> Eventi: </h4>
    <ul>
    ${events}
    </ul>
    <button class="btn btn-danger" onclick="sellCard()"> Vendi carta per 0.1 credito </button>
    `
}

async function sellCard() {
    var id = localStorage.getItem("heroId")
    var username = localStorage.getItem("username")

    console.log(id, username)

    await fetch(`http://localhost:3100/card/${id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "username": username })
    })
    .then(response => response.json()).then(res => {
        localStorage.setItem("credits", res);
        window.location.href = "/album";
    })
    .catch(error => console.log('Cannot delete card of the user', error));
    
    
}

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
            <button class="row p-3 m-3 border rounded" style="text-align:left;" onclick='getTradeId("${trades[i]._id}")'>
                <p> Nome: ${trades[i].name}</p>
                <p> Utente: ${trades[i].username} </p>  
                <p> Carte proposte: ${namesSend}</p>
                <p> Carte richieste: ${namesReceive}</p>
            </button>
            `;
        }
    }
}

function populateUserTrades(username, trades, page) {
    /* Gets 50 trades based on the current page */
    end = page * 20 
    start = end - 20 

    document.getElementById("selectTradesButton").innerHTML = `<button class="btn btn-primary" onclick="showTrades()">Mostra tutti gli scambi</button>`

    document.getElementById("addTradeButton").innerHTML = `<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tradeModal">(+) Aggiungi scambio</button>`

    /* Clears the html to be repopulated */
    const tradesRow = document.getElementById("trades");
    tradesRow.innerHTML = ``

    /* Populate with new cards */
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
                <p> Carte proposte: ${namesReceive}</p>
                <p> Carte richieste: ${namesSend}</p>
                <button class="btn btn-danger mb-4" onclick='deleteTrade("${trades[i]._id}")'>Rimuovi scambio</button>
            </div>
            `;
        }
    }
}

function updateRecHero() {
    recHero = document.getElementById("recHero").value
    getFromMarvel("characters", `nameStartsWith=${recHero}`).then(result => updateTradeRec(result.data.results));
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
        <button class="col p-3 m-3 border rounded" onclick='selectRecHero(${id}, "${thumbnail}", "${name}")'>
            <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
            <p>${name}</p>
        </button>
        `
    }
}

async function selectRecHero(id, thumbnail, name) {
    document.getElementById("savedRecButtons").innerHTML += 
    `
    <div class="col p-3 m-3 border rounded">
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

async function updateSendHero() {
    sendHero = document.getElementById("sendHero").value.toLowerCase()
    username = localStorage.getItem("username")
    heroes = []

    userCards = await fetch(`http://localhost:3100/cards/${username}`, {
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
        if(userCards[i].inTrade == false && name.includes(sendHero)) {
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
        <button class="col p-3 m-3 border rounded" onclick='selectSendHero(${id}, "${thumbnail}", "${name}")'>
            <img class="mb-3" src="${thumbnail}" width="100px" height="100px">  
            <p>${name}</p>
        </button>
        `
    }
}

async function selectSendHero(id, thumbnail, name) {
    console.log("Eroe selezionato", id)
    document.getElementById("savedSendButtons").innerHTML += 
    `
    <div class="col p-3 m-3 border rounded">
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
    console.log(heroReceive)
    username = localStorage.getItem("username")
    name = document.getElementById("inputName").value

    /* Verifies that the requested card is not present in the user cards */
    userCards = await fetch(`/cards/${username}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }})
        .then(result => result.json()).then(res => { return res })

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

/* Gets the info of a trade */
async function getTrade(trade) {
    const tradePage = document.getElementById('trade');
    tradePage.innerHTML =
    `
    <h3> ${trade.name} </h3>
    <hr>
    <p> Utente: ${trade.username}</p>
    <p> Carte proposte:</p>
    <div class="row">
    `
    for(i = 0; i < trade.send.length; i++) {
        tradePage.innerHTML += 
        `
        <div class="col p-3 m-3 border rounded">
            <img class="mb-3" src="${trade.send[i].thumbnail}" width="100px" height="100px">  
            <p>${trade.send[i].name}</p>
        </div>
        `
    }
    tradePage.innerHTML +=
    `
    </div>
    <p> Carte richieste: </p>
    <div class="row">
    `
    for(i = 0; i < trade.receive.length; i++) {
        tradePage.innerHTML += 
        `
        <div class="col p-3 m-3 border rounded">
            <img class="mb-3" src="${trade.receive[i].thumbnail}" width="100px" height="100px">  
            <p>${trade.receive[i].name}</p>
        </div>
        `
    }
    tradePage.innerHTML += 
    `
    </div>
    <button class="btn btn-primary" onclick='acceptTrade("${trade._id}")'>Accetta lo scambio</button>
    `
}

/* Accepts a trade and updates the cards of the respective users */
async function acceptTrade(id) {
    localStorage.getItem("username");

    await fetch(`/acceptTrade/${id}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "username": username })
    })
    .then(response => response.json()).then(res => window.location.href = "/trades")  
    .catch(error => console.log('Cannot get all the trades', error));
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

/* Function to go to next page and populate it */
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