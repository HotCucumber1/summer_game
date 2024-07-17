const start = document.getElementById("start");
const lobbyId = document.getElementById("lobbyId");
const userId = document.getElementById("userId");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out"); 

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    userId.innerText = localStorage.getItem("nickname");

    lobbyId.value = this.localStorage.getItem("lobbyId");

    if (localStorage.getItem("role") === "host") {
        start.setAttribute("enabled", "");
    } else {
        start.setAttribute("disabled", "");
    };

    start.addEventListener("click", function () {
        handleButtonClick("../pages/index.html");
    })
    
});

function handleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)"; 
};

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

start.addEventListener('mouseover', handleOnButton);
start.addEventListener('mouseout', pullOfWithButton);
