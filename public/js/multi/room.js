window.addEventListener("DOMContentLoaded", async function ()
{
    const create = document.getElementById("create");
    const join = document.getElementById("join");
    const lobbyId = document.getElementById("roomId");
    const userInfo = document.getElementById("userInfo");
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

    lobbyId.addEventListener("input", ()=> localStorage.setItem("lobbyId", lobbyId.value));
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

    create.addEventListener('mouseover', handleOnButton);
    create.addEventListener('mouseout', pullOfWithButton);

    join.addEventListener('mouseover', handleOnButton);
    join.addEventListener('mouseout', pullOfWithButton);
});


