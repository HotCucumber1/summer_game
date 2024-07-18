const create = document.getElementById("create");
const join = document.getElementById("join");
const lobbyId = document.getElementById("lobbyId");
const userInfo = document.getElementById("userInfo");

window.addEventListener("DOMContentLoaded", function () {
    async function checkWins(userData)
    {
        let response = await fetch("/get/score", 
            {
                method: "GET",
            });
            if (response.ok)
            {
                let user = response.json();
                let wins = user.wins;
            }
    };

    checkWins(localStorage.getItem("nickname"));

    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out"); 

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    lobbyId.addEventListener("input", () => localStorage.setItem("lobbyId", lobbyId.value));

    create.addEventListener("click", function () {
        localStorage.setItem("role", "host");
        let userData = {
            'name': localStorage.getItem("nickname"),
            'lobbyId': localStorage.getItem("lobbyId"),
            'role': localStorage.getItem("role"),
            'gameMode': localStorage.getItem("gameMode")
        }
        // conn.send(JSON.stringify(userData));  // нужно будет раскоментировать, когда будет подключение к серверу
        console.log(userData);
        handleButtonClick("../pages/lobby.html");
    });

    join.addEventListener("click", function () {
        handleButtonClick("../pages/lobby.html");
        localStorage.setItem("role", "client");
    });

    userInfo.innerText = "Hi, " + localStorage.getItem("nickname") + "! You have " + /*wins +*/ " wins now!"
    
});

function handleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)"; 
};

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

create.addEventListener('mouseover', handleOnButton);
create.addEventListener('mouseout', pullOfWithButton);

join.addEventListener('mouseover', handleOnButton);
join.addEventListener('mouseout', pullOfWithButton);


