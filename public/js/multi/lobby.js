window.addEventListener("DOMContentLoaded", function ()
{
    const start = document.getElementById("start");
    const lobbyId = document.getElementById("lobbyId");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const create = document.getElementById("create");
    const lobby = document.getElementById("lobby");
    const gameCont = document.getElementById('gameCont');
    document.body.classList.add("fade-in");


    function handleOnButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
    }

    function pullOfWithButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "";
    }

    if (localStorage.getItem("role") === "host")
    {
        start.setAttribute("enabled", "");
    }
    else
    {
        start.setAttribute("disabled", "");
    }

    start.addEventListener("click", function ()
    {
        lobby.classList.remove("fade-in");
        lobby.classList.add("fade-out");
        gameCont.style.display = "block";
        gameCont.classList.add("fade-in");
        const startEvent = new CustomEvent('startEvent');
        document.dispatchEvent(startEvent);
    });

    userId.innerText = localStorage.getItem("nickname");
    lobbyId.value = localStorage.getItem("lobbyId");

    create.addEventListener("click", function ()
    {
        room.classList.add("fade-out2");
        room.classList.add("fade-out");
        lobby.classList.add("fade-in2");
        lobby.classList.add("fade-in");
    });

    start.addEventListener('mouseover', handleOnButton);
    start.addEventListener('mouseout', pullOfWithButton);
});


