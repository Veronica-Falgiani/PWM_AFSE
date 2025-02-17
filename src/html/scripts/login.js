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
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    console.log(res)
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
                        .catch(error => alert("Marvel API: failed to fetch hero"));
        
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
                        .catch(error => "Marvel API: failed to fetch series");
            
                    successAlert("alert", "User logged in successfully")
                    /* We wait for the API calls to be fulfilled */
                    setTimeout(function(){
                        window.location.href = "/profile";
                    }, 3000);
                }
        )}
        else {
            result.json().then(res => {
                dangerAlert("alert", res)
                return
            })
        }
    })              
}