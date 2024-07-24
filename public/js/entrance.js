window.addEventListener("DOMContentLoaded", function ()
{
    const enter = document.getElementById("enter");
    const nickname = document.getElementById("nickname");
    const password = document.getElementById('password');
    const errorLabel = document.getElementById("errorLabel");

    function hangleOnButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
    }

    function pullOfWithButton(e)
    {
        const button = e.target;
        button.style.boxShadow = "";
    }

    function getData()
    {
        return {
            name: nickname.value.trim(),
            password: password.value.trim(),
        }
    }

    async function sendData(event)
    {
        event.preventDefault();
        let response = await fetch('/login', {
            method: "POST",
            body: JSON.stringify(getData()),
            headers:
                {
                    "Content-Type": "application/json;charset=utf-8"
                }
        });
        if (!response.ok)
        {
            const result = await response.text();
            errorLabel.classList.remove("hidden");
            errorLabel.innerText = result;
        }
        else
        {
            errorLabel.classList.add("hidden");
            errorLabel.innerText = "";
            window.location.href = '/menu';
        }
    }

    enter.addEventListener('mouseover', hangleOnButton);
    enter.addEventListener('mouseout', pullOfWithButton);
    enter.addEventListener('click', sendData);
    document.body.classList.add("fade-in");

    nickname.addEventListener("input", () => localStorage.setItem("nickname", nickname.value));
});

