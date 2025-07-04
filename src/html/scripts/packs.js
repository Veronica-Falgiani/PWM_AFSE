/* PACKS.HTML */
/* Populates the euros field inside the modal and saves it in the localStorage*/
function setCards(num, cred) {
    document.getElementById("cardModal").innerHTML = 
    `
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
        <h3 class="modal-title fs-5" id="modalLabel">ARE YOU SURE?</h3>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row p-3" id="bodyModal">
                <button class="btn btn-danger" onclick="buyCards()">
                    <h5>Buy</h5>   
                </button>                                        
            </div>
        </div>
    </div>
    `
    localStorage.setItem("cards", num)
    localStorage.setItem("packCreds", cred)
}

/* Returns id, name and image of a randomly picked hero in the marvel api */
async function getRandomHero() {
    maxHero = 1564;
    num = Math.floor(Math.random() * maxHero);

    hero = await fetch("/marvelAPI", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "urlAPI" : "/characters",
                            "query" : `limit=1&offset=${num}`})
    })
        .then(response => response.json()).then(res => {return res[0]})
        .catch(error => alert("Marvel API: failed to fetch hero"));

    return hero
}


/* Buys the cards, saves them in the user's db and then shows them */
async function buyCards() {
    cards = []
    heroNum = []
    numCards = localStorage.getItem("cards")
    credits = localStorage.getItem("packCreds")
    username = localStorage.getItem("username")

    for(i = 0; i < numCards; i++){
        
        hero = await getRandomHero()
        id = hero.id
        name = hero.name
        thumbnail = `${hero.thumbnail.path}.${hero.thumbnail.extension}`

        cards.push({"id": id, "name": name, "thumbnail": thumbnail, "number": 1, "inTrade": false})
    }

    await fetch(`/cards/${username}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "cards" : cards,
                            "credits" : credits})
    })
    .then(result => {
        if(result.ok) {
            result.json().then(res => {
                localStorage.setItem("credits", res.credits)
                document.getElementById("credits").innerHTML = `Total credits: ${res.credits}`
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alert", res)
                return
            })
        }
    })

    writeCards(cards)
}

/* Shows the cards that the user received from the packs */
function writeCards(heroes) {
    const modalPacks = document.getElementById("cardModal");
    modalPacks.innerHTML = 
    `
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
        <h3 class="modal-title fs-5" id="modalLabel">CARDS FOUND</h3>
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
        <div class="p-3 m-3 border rounded" id="card">
            <img src="${heroes[i].thumbnail}" width="100px" height="100px">
            <br>
            ${heroes[i].name} 
        </div>
        `
    }

    document.getElementById("credits").innerHTML = `Total credits: ${localStorage.getItem("credits")}`
}