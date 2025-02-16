const sitename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
var username = localStorage.getItem("username")
const navbarSites = {
    "index": "/",
    "trades": "/trades",
    "credits": "/credits",
    "packs": "/packs",
    "profile": "/profile",
    "album": "/album"
}

/* If the page is the index, login or register it will show a reduced menu */
if (sitename == "" || sitename == "login" || sitename == "register") {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = 
    `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <nav class="navbar sticky-top navbar-expand-md border-bottom">
        <div class="container-fluid">
            <a class="navbar-brand" href=${navbarSites.index}>AFSE</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
    `;
} 
/* Else, it will show the full menu */
else {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = 
    `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <nav class="navbar sticky-top navbar-expand-md border-bottom">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">AFSE</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href=${navbarSites.trades}>Trades</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href=${navbarSites.credits}>Credits</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href=${navbarSites.packs}>Packs</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                            ${username}
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href=${navbarSites.profile}>Profile</a></li>
                            <li><a class="dropdown-item" href=${navbarSites.album}>Album</a></li>
                            <li><hr></li>
                            <li><a class="dropdown-item text-danger" onclick="logoutUser()">Log out</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
    </div>

    </nav>
    `;
}

/* Unsets all the localstorage items to "logout" user and clears the session cookie */
async function logoutUser() {
    localStorage.clear()

    await fetch("/logout", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    })
    .then(response => response.json()).then(res => {
        console.log(res)
        localStorage.clear();
        window.location.href = "/";
    })
}

/* Updates the alert div when the server sends a message */
function successAlert(message) {
    document.getElementById("alert").innerHTML = 
    `
    <div class="alert alert-success" role="alert">
        <h5 class="alert-heading">${message}</h5>
    </div>
    `
}

function dangerAlert(message) {
    document.getElementById("alert").innerHTML = 
    `
    <div class="alert alert-danger" role="alert">
        <h5 class="alert-heading">${message}</h5>
    </div>
    `
}