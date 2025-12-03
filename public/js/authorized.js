

function isLoggedIn() {
    const token = localStorage.getItem("jwtToken");
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const now = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > now; // Check expiration
    } catch (e) {
        console.error("Invalid token format", e);
        return false;
    }
}

function updateAuthLink() {
    let loggedInLink = document.getElementById("#logged-in");
    let accountManagement = document.getElementById("#account-management-link")
    if (isLoggedIn()) {
        accountManagement.innerHTML = "Manage Account";
        accountManagement.setAttribute("href", "/account/management")
        loggedInLink.innerHTML = "Log Out";
        loggedInLink.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem("jwtToken");
            updateAuthLink(); 
            alert("You have been logged out.");
        };
    } else {
        loggedInLink.innerHTML = "My Account";
        loggedInLink.setAttribute("href", "/account/login");
        };
    }


// Log off function
const logOutLink = document.querySelector("#log-out-function");

logOutLink.addEventListener("click", logout())

function logOut() {
    localStorage.removeItem("jwtToken");
    window.location.reload();
}
