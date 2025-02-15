/* LOGIN.HTML */
/* Collects the info from the form and logs in the user with the credentials */
async function sendForm() {
    username = document.getElementById("username").value
    password = document.getElementById("inputPassword").value
    localStorage.removeItem("heroName")
    localStorage.removeItem("seriesName")

    fetch("/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "username" : username, 
                               "password" : password })
        })
        .then(result => result.json()).then(res => {
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
                .catch(error => console.log('error', error));

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
                .catch(error => console.log('error', error));
    
            /* window.location.href doesn't wait for the function getFromMarvel to finish */
            setTimeout(function(){
                window.location.href = "/profile";
            }, 3000);
        })
        .catch(error => window.alert("Errore nel login dell'utente", error));
}

/*
/* LOGIN.HTML 
/* Collects the info from the form and logs in the user with the credentials 
fetch("/login", {
    method: "POST",
    headers: {
        "Content-type": "application/json",
        'Accept': 'application/json',
    },
    body: JSON.stringify({ "username" : username, 
                           "password" : password })
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
                .then(response => {
                    if(response.ok) {
                        response.json().then(result => {
                            localStorage.setItem("hero", result[0].name)
                        })
                    }
                    else {
                        response.json().then(errorMessage => {
                            document.getElementById("alert").innerHTML = 
                            `
                            <div class="alert alert-success" role="alert">
                                <h5 class="alert-heading">${errorMessage}</h5>
                            </div>
                            `
                            return
                        });
                    }
                })
                .catch(error => console.log('Error: ', error));

                series = fetch("/marvelAPI", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ "urlAPI" : `series/${res.series}`,
                                        "query" : ""})
                })
                .then(response => {
                    if(response.ok) {
                        response.json().then(result => {
                            localStorage.setItem("hero", result[0].title)
                        })
                    }
                    else {
                        response.text().then(errorMessage => {
                            document.getElementById("alert").innerHTML = 
                            `
                            <div class="alert alert-success" role="alert">
                                <h5 class="alert-heading">${errorMessage}</h5>
                            </div>
                            `
                            return
                        });
                    }
                })
            })
        }
        else {
            response.json().then(errorMessage => {
                document.getElementById("alert").innerHTML = 
                `
                <div class="alert alert-success" role="alert">
                    <h5 class="alert-heading">${errorMessage}</h5>
                </div>
                `
                return
            })
            
        }
    })
    .catch(error => console.log('Error: ', error));

/* window.location.href doesn't wait for the function getFromMarvel to finish 
document.getElementById("alert").innerHTML = `
<div class="alert alert-success" role="alert">
    <h5 class="alert-heading">Successfully logged in</h5>
</div>`

setTimeout(function() {
    window.location.href = "/profile";
}, 4000);
*/