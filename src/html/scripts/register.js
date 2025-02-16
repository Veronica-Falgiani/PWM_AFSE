/* REGISTER.HTML */
/* Searches for the heroes that match the given string */
async function searchHero() {
    name = document.getElementById("selectHero").value;
    localStorage.setItem("heroName", name)

    await fetch("/marvelAPI", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "urlAPI" : `/characters`,
                            "query" : `nameStartsWith=${name}`})
    })
        .then(response => response.json()).then(result => writeSelectHeroes(result))
        .catch(error => alert("Failed to search hero"));
}  

/* Same as above but with series */
async function searchSeries() {
    title = document.getElementById("selectSeries").value
    localStorage.setItem("seriesName", title)
        
    await fetch("/marvelAPI", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "urlAPI" : `/series`,
                            "query" : `titleStartsWith=${title}`})
    })
        .then(response => response.json()).then(result => writeSelectSeries(result))
        .catch(error => alert("Failed to search series"));
}

/* creates a select menu with a list of heroes */
function writeSelectHeroes(heroesJson) {
    heroesJson = (JSON.stringify(heroesJson));
    const heroes = JSON.parse(heroesJson);

    var inputHero = document.getElementById("inputHero")
    inputHero.innerHTML = ``

    var lenHeroes = heroes.length
    for (i = 0; i < lenHeroes; i++) {
        inputHero.innerHTML += 
        `
        <option value="${heroes[i].id}">${heroes[i].name}</option>
        `
    }
}

/* creates a select menu with a list of series */
function writeSelectSeries(seriesJson) {
    seriesJson = (JSON.stringify(seriesJson));
    const series = JSON.parse(seriesJson);

    var inputSeries = document.getElementById("inputSeries")
    inputSeries.innerHTML = ``

    var lenSeries = series.length
    for (i = 0; i < lenSeries; i++) {
        inputSeries.innerHTML += 
        `
        <option value="${series[i].id}">${series[i].title}</option>
        `
    }
}

/* Send the form to node and registers the user */
async function sendForm() {
    username = document.getElementById("username").value
    email = document.getElementById("inputEmail").value
    password = document.getElementById("inputPassword").value
    hero = document.getElementById("inputHero").value
    series = document.getElementById("inputSeries").value
    localStorage.removeItem("heroName")
    localStorage.removeItem("seriesName")

    fetch("/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "username" : username, 
                               "email" : email,
                               "password" : password,
                               "hero" : hero,
                               "series" : series })
        })
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    localStorage.setItem("username", res.username)
                    localStorage.setItem("email", res.email)
                    localStorage.setItem("credits", res.credits)

                    hero = fetch("/marvelAPI", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({ "urlAPI" : `characters/${res.hero}`,
                                            "query" : ""})
                    })
                        .then(response => response.json()).then(result => {localStorage.setItem("hero", result[0].name)})
                        .catch(error => alert("Failed to fetch hero"));

                    series = fetch("/marvelAPI", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({ "urlAPI" : `series/${res.series}`,
                                            "query" : ""})
                    })
                        .then(response => response.json()).then(result => {localStorage.setItem("series", result[0].title)})
                        .catch(error => alert("Failed to fetch series"));
            
                    successAlert("User signed up     successfully")

                    /* window.location.href doesn't wait for the function to finish */
                    setTimeout(function(){
                        window.location.href = "/profile";
                    }, 4000);
                })
            }
            else {
                result.json().then(res => {
                    dangerAlert(res)
                    return
                })
            }
        })
}