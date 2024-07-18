const create = document.getElementById("create");
const join = document.getElementById("join");
// const form = document.querySelector("room");
const lobbyId = document.getElementById("lobbyId");
const userInfo = document.getElementById("userInfo");

window.addEventListener("DOMContentLoaded", async function ()
{
    async function checkWins(userData)
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

    let wins = await checkWins(localStorage.getItem("nickname"));
    userInfo.innerText = "Hi, " + localStorage.getItem("nickname") + "! You have " + wins + " wins now!"


    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL)
    {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");
        setTimeout(()=> {window.location.href = targetURL}, 500);
    }

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
        }
        // conn.send(JSON.stringify(userData));  // нужно будет раскоментировать, когда будет подключение к серверу
        handleButtonClick("/lobby");
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
        }
        // conn.send(JSON.stringify(userData));
        handleButtonClick("/lobby");
    });
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

create.addEventListener('mouseover', handleOnButton);
create.addEventListener('mouseout', pullOfWithButton);

join.addEventListener('mouseover', handleOnButton);
join.addEventListener('mouseout', pullOfWithButton);