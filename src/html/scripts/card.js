/* CARD.HTML */
/* prints all the info about a character in an html format */
function writeHero(heroJson, status) {
    heroJson = (JSON.stringify(heroJson));
    const hero = JSON.parse(heroJson);

    const card = document.getElementById('cardInfo');

    name = hero.name.toUpperCase()

    if(status == 'unobtained') {
        card.innerHTML =
        `
        <h3> ${name} </h3>
        <hr>
        <div id="alert"></div>
        <img class="mb-3" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" width="300px" height="300px">  
        <h4> Description: </h4>
        <p>${hero.description}</p>
        `
        return
    }

    /* saving all the comics in a list */
    const lenComics = hero.comics.returned

    var comics = ``;
    for(let i = 0; i < lenComics; i++) {
        comics += `<li>${hero.comics.items[i].name}</li>\n`
    }

    /* saving all the series in a list */
    const lenSeries = hero.series.returned
    var series = ``;
    for(let i = 0; i < lenSeries; i++) {
        series += `<li>${hero.series.items[i].name}</li>\n`
    }

    /* saving all the events in a list */
    const lenEvents = hero.events.returned
    var events = ``;
    for(let i = 0; i < lenEvents; i++) {
        events += `<li>${hero.events.items[i].name}</li>\n`
    }

    card.innerHTML =
    `
    <h3>${name} </h3>
    <hr>
    <div id="alert"></div>
    <img class="mb-3" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" width="300px" height="300px">  
    <h4> Description: </h4>
    <p>${hero.description}</p>
    <h4> Comics: </h4>
    <ul>
    ${comics}
    </ul>
    <h4> Series: </h4>
    <ul>
    ${series}
    </ul>
    <h4> Events: </h4>
    <ul>
    ${events}
    </ul>
    <button class="btn btn-danger" onclick="sellCard()"> Sell card for 0.1 credits </button>
    `
}

async function sellCard() {
    var id = localStorage.getItem("heroId")
    var username = localStorage.getItem("username")

    await fetch(`/card/${username}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "id": id })
    })
    .then(result => {
        console.log(result)
        if(result.ok) {
            result.json().then(res => {
                localStorage.setItem("credits", res.credits);
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alert", res)
                return
            })
        }
    })

    successAlert("alert", "Card sold successfully")

    setTimeout(function(){
        window.location.href = "/album";
    }, 3000);
}