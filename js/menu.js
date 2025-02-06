var sitename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
var credits = 300
var username = localStorage.getItem("username")

if (sitename == "" || sitename == "login" || sitename == "register") {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = 
    `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <nav class="navbar sticky-top navbar-expand-md bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">AFSE</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
    `;
} 
else {
    const menuElement = document.getElementById('menu');
    menuElement.innerHTML = 
    `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <nav class="navbar sticky-top navbar-expand-md bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">AFSE</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/trades">Scambi</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/credits">Crediti</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/packs">Pacchetti</a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                            ${username}
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/profile">Profilo</a></li>
                            <li><a class="dropdown-item" href="/album">Album</a></li>
                            <li><hr></li>
                            <li><a class="dropdown-item text-danger" onclick="logoutUser()">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
    </div>

    </nav>
    `;
}
