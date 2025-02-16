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

    document.getElementById("selectAlbumButton").innerHTML = `<button class="btn btn-primary" onclick="showUserCards()">Show user's cards</button>`

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
            <button class="p-3 m-3 border rounded" onclick="getCard(${allCards[i].id}, 'unobtained')" id="card">
                <img class="mb-3" src="${allCards[i].thumbnail}" width="100px" height="100px" id="unobtained">  
                <p> ${allCards[i].name}</p>
            </button>
            `;
        }
        /* If the card is found in the user db it is clickable and shows the amount */
        else {
            cardsRow.innerHTML += 
            `
            <button class="btn btn-danger p-3 m-3 border rounded" onclick="getCard(${allCards[i].id}, 'obtained')" id="card">
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

    document.getElementById("selectAlbumButton").innerHTML = `<button class="btn btn-primary" onclick="showCards()">Show all the cards</button>`
    // TODO ADD USER CARDS CLICKABEL AND THE OTHERS NOT

    /* Clears the html to be repopulated */
    const cardsRow = document.getElementById("cards");
    cardsRow.innerHTML = ``

    /* Populate with new cards */
    for(i = start; i < end; i++) {
        cardsRow.innerHTML += 
        `
        <button class="p-3 m-3 border rounded" onclick="getCard(${userCards[i].id}, 'obtained')" id="card">
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