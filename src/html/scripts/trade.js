/* TRADE.HTML */
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