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

    async function sendData()
    {
        try 
        {
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
            throw new Error(result) 
        } 
        else
        {
            errorLabel.classList.add("hidden");
            errorLabel.innerText= "";
        }

        } 
        catch (error) 
        {
            // alert(error.message);    //как вариант 
            errorLabel.classList.remove("hidden");
            errorLabel.innerText = error.message;
        }
    }

    enter.addEventListener('mouseover', hangleOnButton);
    enter.addEventListener('mouseout', pullOfWithButton);
    enter.addEventListener('click', sendData);

    document.body.classList.add("fade-in");

    function hangleButtonClick(targetURL)
    {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");
        setTimeout(() => {window.location.href = targetURL;}, 2000);
    }

    nickname.addEventListener("input", () => localStorage.setItem("nickname", nickname.value));
});

