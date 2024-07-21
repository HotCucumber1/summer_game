window.addEventListener("DOMContentLoaded", function ()
{
    const start = document.getElementById("start");
    const lobbyId = document.getElementById("lobbyId");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const create = document.getElementById("create");
    const lobby = document.getElementById("lobby");
    document.body.classList.add("fade-in");
    function handleButtonClick(targetURL)
    {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");
        setTimeout(()=> {window.location.href = targetURL}, 500);
    }

    userId.innerText = localStorage.getItem("nickname");
    lobbyId.value = this.localStorage.getItem("lobbyId");

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
        conn.send(
            JSON.stringify({ start: true })
        )
        handleButtonClick("/game")
    });

    if (userId)
    {
        userId.innerText = localStorage.getItem("nickname");
    }

    if (lobbyId)
    {
        lobbyId.value = localStorage.getItem("lobbyId");
    }

    if (create)
    {
        create.addEventListener("click", function ()
        {
            room.classList.add("fade-out2");
            room.classList.add("fade-out");
            lobby.classList.add("fade-in2");
            lobby.classList.add("fade-in");
        });
    }
});

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

start.addEventListener('mouseover', handleOnButton);
start.addEventListener('mouseout', pullOfWithButton);