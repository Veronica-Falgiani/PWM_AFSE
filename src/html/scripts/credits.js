/* CREDITS.HTML */
/* Populates the euros field inside the modal and saves it in the localStorage*/
function setCredits(eur) {
    document.getElementById("importo").innerHTML = `Importo: ${eur}€`
    changeCredits = eur / 5
    localStorage.setItem("changeCredits", changeCredits)
}

/* Takes the values from local storage and adds credits based on them */
async function addCredits() {
    changeCredits = localStorage.getItem("changeCredits")
    username = localStorage.getItem("username")

    await fetch(`/credits/${username}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "changeCredits" : changeCredits })
    })
    .then(result => {
        if(result.ok) {
            result.json().then(res => {
                localStorage.removeItem("euros")
                crediti = localStorage.setItem("credits", res)
                document.getElementById("crediti").innerHTML = `Total credits: ${res}`
            })
        }
    
        else {
            result.json().then(res => {
                dangerAlert("alert", res)
                return
            })
        }
    })

    successAlert("alert", "Credits added successfully")
    /* We wait for the API calls to be fulfilled */
    setTimeout(function(){
        document.getElementById("alert").innerHTML = ""
    }, 3000);
}