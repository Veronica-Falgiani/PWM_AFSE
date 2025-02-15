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
        <img class="mb-3" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" width="300px" height="300px">  
        <h4> Descrizione: </h4>
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
    <img class="mb-3" src="${hero.thumbnail.path}.${hero.thumbnail.extension}" width="300px" height="300px">  
    <h4> Descrizione: </h4>
    <p>${hero.description}</p>
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

    await fetch(`/card/${id}`, {
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