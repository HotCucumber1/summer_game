document.addEventListener("DOMContentLoaded", function () {
    const lobbyId = document.getElementById("lobbyId");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const create = document.getElementById("create");
    const lobby = document.getElementById("lobby");
    const back = document.getElementById("back");

    document.body.classList.add("fade-in");

    if (userId) {
        userId.innerText = localStorage.getItem("nickname");
    }

    if (lobbyId) {
        lobbyId.value = localStorage.getItem("lobbyId");
    }

    if (create) {
        create.addEventListener("click", () => {
            room.classList.remove("fade-in");
            room.classList.add("fade-out");
            room.style.display = "none";
            lobby.style.display = "flex";
            lobby.classList.remove("fade-out");
            lobby.classList.add("fade-in");
        });
    }

    if (back) {
        back.addEventListener("click", () => {
            lobby.classList.remove("fade-in");
            lobby.classList.add("fade-out");
            lobby.style.display = "none";
            room.style.display = "flex";
            room.classList.remove("fade-out");
            room.classList.add("fade-in");
        });
    }
});