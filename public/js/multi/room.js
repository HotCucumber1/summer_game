window.addEventListener("DOMContentLoaded", async function ()
{
    localStorage.removeItem('lobbyId');

    const create = document.getElementById("create");
    const join = document.getElementById("join");
    const roomId = document.getElementById("roomId");
    const userInfo = document.getElementById("userInfo");
    const errorLabel = document.getElementById("errorLabel");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const lobby = document.getElementById("lobby");
    const lobbyId = document.getElementById('lobbyId');
    const start = document.getElementById("start");
    let moreThenOnePlayers = false;
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

    async function checkVictories(userData)
    {
        let response = await fetch(`/get/score/${userData}`, {
                method: "GET",
            });
        if (response.ok)
        {
            let body = await response.json();
            return body['wins'];
        }
    }

    let wins = await checkVictories(localStorage.getItem("nickname"));
    userInfo.innerText = "Hi, " + localStorage.getItem("nickname") + "! You have " + wins + " wins now!";

    
    function validateLobbyId()
    {
        if (roomId.value.trim() === "")
        {
            create.setAttribute("disabled", "");
            join.setAttribute("disabled", "");
            return false;
        }
        create.removeAttribute("disabled");
        join.removeAttribute("disabled");
        return true;
    }

    roomId.addEventListener("input",  function ()
    {
        if (validateLobbyId())
        { 
            localStorage.setItem("lobbyId", roomId.value.trim());
            errorLabel.classList.add("hidden");
            let roomData = {
                type: 'checkRoom',
                roomId: roomId.value,
            };
            conn.send(
                JSON.stringify(roomData)
            );
        }
    });

    function checkRole() 
    {
        if (localStorage.getItem("role") === "host")
        {
            start.removeAttribute("disabled");
        }
        else
        {
            start.setAttribute("disabled", "");
        }
    }
    
    create.addEventListener("click", function ()
    {
        if (validateLobbyId())
        { 
            localStorage.setItem("role", "host");
            let userData = {
                type: 'createRoom',
                newRoom: {
                    userName: localStorage.getItem("nickname"),
                    roomId: localStorage.getItem("lobbyId"),
                    userRole: localStorage.getItem("role"),
                }
            };
            conn.send(
                JSON.stringify(userData)
            );
            lobbyId.value = localStorage.getItem("lobbyId");
            checkRole();
        }
    });

    join.addEventListener("click", function ()
    {
        if (validateLobbyId())
        { 
            localStorage.setItem("role", "client");
            let userData = {
                type: 'joinRoom',
                joinRoom: {
                    userName: localStorage.getItem("nickname"),
                    roomId: localStorage.getItem("lobbyId"),
                    userRole: localStorage.getItem("role"),
                }
            };
            conn.send(
                JSON.stringify(userData)
            );
            lobbyId.value = localStorage.getItem("lobbyId");
            checkRole();
        }
    });

    conn.addEventListener("message", function (event)
    {
        const dataFromServer = JSON.parse(event.data);
        if (dataFromServer.type === 'ping')
        {
            return;
        }

        if (dataFromServer.start)
        {
            lobby.classList.remove("fade-in");
            lobby.classList.add("fade-out");
            gameCont.style.display = "block";
            gameCont.classList.add("fade-in");
            const startEvent = new CustomEvent('startEvent');
            document.dispatchEvent(startEvent);
        }

        if (dataFromServer.roomExist)
        {
            errorLabel.classList.remove("hidden");
            errorLabel.innerText = "А lobby with this ID exists!";
            create.setAttribute("disabled", "");
            join.removeAttribute("disabled");
        }
        else if (dataFromServer.isStarted)
        {
            errorLabel.classList.remove("hidden");
            errorLabel.innerText = "Game has already started!";
            create.setAttribute("disabled", "");
            join.setAttribute("disabled", "");
        }
        else if (dataFromServer.roomOk)
        {
            create.removeAttribute("disabled");
            join.removeAttribute("disabled");
        }

        if (dataFromServer.users)
        {
            if (Object.keys(dataFromServer.users).length > 0)
            {
                moreThenOnePlayers = true;
            }
            room.classList.add("fade-out");
            lobby.classList.add("fade-in");
            userId.innerHTML = "";
            for (let user in dataFromServer.users)
            {
                let newUser = document.createElement("div");
                newUser.className = "user";
                newUser.innerText = user;
                userId.appendChild(newUser);
            }
        }
    });

    start.addEventListener("click", function ()
    {
        if (moreThenOnePlayers && localStorage.getItem("role") === "host")
        {
            conn.send(
                JSON.stringify({ type: 'start' })
            );
        }
    });


    start.addEventListener('mouseover', handleOnButton);
    start.addEventListener('mouseout', pullOfWithButton);

    create.addEventListener('mouseover', handleOnButton);
    create.addEventListener('mouseout', pullOfWithButton);

    join.addEventListener('mouseover', handleOnButton);
    join.addEventListener('mouseout', pullOfWithButton);
});


