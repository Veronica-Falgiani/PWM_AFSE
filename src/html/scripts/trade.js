/* TRADE.HTML */
/* Gets the info of a trade */
async function getTrade(trade) {
    const tradePage = document.getElementById('trade');
    
    name = trade.name.toUpperCase()

    renderHTML = 
    `
    <h3> ${name} </h3>
    <hr>
    <p> Username: ${trade.username}</p>
    <p> Proposed cards:</p>
    <div class="row">
    `
    
    for(i = 0; i < trade.send.length; i++) {
        renderHTML += 
        `
        <div class="p-3 m-3 border rounded" id="card">
            <img class="mb-3" src="${trade.send[i].thumbnail}" width="100px" height="100px">  
            <p>${trade.send[i].name}</p>
        </div>
        `
    }
    renderHTML +=
    `
    </div>
    <p> Requested cards: </p>
    <div class="row">
    `
    for(i = 0; i < trade.receive.length; i++) {
        renderHTML += 
        `
        <div class="p-3 m-3 border rounded" id="card">
            <img class="mb-3" src="${trade.receive[i].thumbnail}" width="100px" height="100px">  
            <p>${trade.receive[i].name}</p>
        </div>
        `
    }
    renderHTML += 
    `
    </div>
    <button class="btn btn-primary" onclick='acceptTrade("${trade._id}")'>Accept trade</button>
    `

    tradePage.innerHTML = renderHTML
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