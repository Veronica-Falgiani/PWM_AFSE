/* CREDITS.HTML */
/* Populates the euros field inside the modal and saves it in the localStorage*/
function setCredits(eur) {
    document.getElementById("importo").innerHTML = `Importo: ${eur}€`
    creditsToAdd = eur / 5
    localStorage.setItem("creditsToAdd", creditsToAdd)
}

/* Takes the values from local storage and adds credits based on them */
async function addCredits() {
    creditsToAdd = localStorage.getItem("creditsToAdd")
    username = localStorage.getItem("username")

    await fetch(`/addCredits/${username}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "creditsToAdd" : creditsToAdd })
    })
        .then(response => response.json()).then(res => {
            localStorage.removeItem("euros")
            crediti = localStorage.setItem("credits", res)
            document.getElementById("crediti").innerHTML = `Total credits: ${res}`
        })
        .catch(error => console.log('error', error));
}