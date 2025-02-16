/* PROFILE.HTML */
/* Prints the description of the user in the profile page */
function writeProfile() {
    username = localStorage.getItem("username") 
    email = localStorage.getItem("email")
    credits = localStorage.getItem("credits")
    hero = localStorage.getItem("hero")
    series = localStorage.getItem("series")
    const profilo = document.getElementById("profile")
    profilo.innerHTML = 
    `
    <h3> PROFILE </h3>
    <hr>
    <div id="alert"></div>
    <p> Username: ${username}</p>
    <p> Mail: ${email}</p>
    <p> Password: ******</p>
    <p> Credits: ${credits} </p>
    <p> Favourite Hero: ${hero} </p>
    <p> Favourite Series: ${series} </p>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modifyModal">Modify Profile</button>
    <hr>
    <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete Profile</button>
    `
}

/* Modifies the info of the user */
async function modifyUser() {
    username = localStorage.getItem("username")
    email = document.getElementById("inputEmail").value
    password = document.getElementById("inputPassword").value

    fetch(`/user/${username}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify({ "email" : email, 
                               "password" : password })
        })
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    localStorage.setItem("email", res.email);
                })
            }
        
            else {
                result.json().then(res => {
                    dangerAlert("alertModal", res)
                    return
                })
            }
        })

        successAlert("alertModal","User info changed successfully")

        setTimeout(function(){
            window.location.href = "/profile";
        }, 3000);
}

/* Deletes the current user */
async function deleteUser() { 
    username = localStorage.getItem("username")

    fetch(`/user/${username}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }})
        .then(result => {
            if(result.ok) {
                result.json().then(res => {
                    localStorage.clear(); 
                })
            }
        
            else {
                result.json().then(res => {
                    dangerAlert("alertModal", res);
                    return;
                })
            }
        })

        successAlert("alertModal2","User deleted successfully");

        setTimeout(function(){
            window.location.href = "/";
        }, 3000);
}