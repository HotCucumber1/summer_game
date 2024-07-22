window.addEventListener("DOMContentLoaded", async function ()
{
    const create = document.getElementById("create");
    const join = document.getElementById("join");
    const roomId = document.getElementById("roomId");
    const userInfo = document.getElementById("userInfo");
    const errorLabel = document.getElementById("errorLabel");
    const userId = document.getElementById("userId");
    const room = document.getElementById("room");
    const lobby = document.getElementById("lobby");

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
            console.log(body);
            return body['wins'];
        }
    }


    let wins = await checkVictories(localStorage.getItem("nickname"));
    userInfo.innerText = "Hi, " + localStorage.getItem("nickname") + "! You have " + wins + " wins now!";

    roomId.addEventListener("input",  function ()
    {
        localStorage.setItem("lobbyId", roomId.value);
        errorLabel.classList.add("hidden");
    });

    create.addEventListener("click", function ()
    {
        localStorage.setItem("role", "host");
        let userData = {
            newRoom: {
                userName: localStorage.getItem("nickname"),
                roomId: localStorage.getItem("lobbyId"),
                userRole: localStorage.getItem("role"),
            }
        };
        conn.send(
            JSON.stringify(userData)
        );
        room.classList.add("fade-out");
        lobby.classList.add("fade-in");
        lobbyId.value = localStorage.getItem("lobbyId");
    });

    join.addEventListener("click", function ()
    {
        localStorage.setItem("role", "client");
        let userData = {
            joinRoom: {
                userName: localStorage.getItem("nickname"),
                roomId: localStorage.getItem("lobbyId"),
                userRole: localStorage.getItem("role"),
            }
        };
        conn.send(
            JSON.stringify(userData)
        );
    });

    conn.addEventListener("message", function (event)
    {
        const dataFromServer = JSON.parse(event.data);
        if (dataFromServer.roomExist) 
        {
            errorLabel.classList.remove("hidden");
            errorLabel.innerText = "А lobby with this ID exists!";
            create.setAttribute("disabled", "");
        } else 
        {
            create.setAttribute("enabled", "");
        }

        if (dataFromServer.joinRoom)
        {
            room.classList.add("fade-out");
            lobby.classList.add("fade-in");
            userId.innerHTML = "";
            for (i = 0; i < dataFromServer.joinRoom.length; i++)
            {
                let newUser = document.createElement("div");
                newUser.className = "user";
                newUser.innerText = dataFromServer.joinRoom[i];
                userId.appendChild(newUser);
            }
        }
    })

    create.addEventListener('mouseover', handleOnButton);
    create.addEventListener('mouseout', pullOfWithButton);

    join.addEventListener('mouseover', handleOnButton);
    join.addEventListener('mouseout', pullOfWithButton);
});


