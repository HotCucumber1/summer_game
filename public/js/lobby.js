document.addEventListener("DOMContentLoaded", function () {
    const lobbyId = document.getElementById("lobbyId");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const create = document.getElementById("create");
    const lobby = document.getElementById("lobby");

    document.body.classList.add("fade-in");

    if (userId) {
        userId.innerText = localStorage.getItem("nickname");
    }

    if (lobbyId) {
        lobbyId.value = localStorage.getItem("lobbyId");
    }

    if (create) {
        create.addEventListener("click", () => {
            room.classList.add("fade-out2");
            room.classList.add("fade-out");
            lobby.classList.add("fade-in2");
            lobby.classList.add("fade-in");
        });
    }
});

function handleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
}

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}