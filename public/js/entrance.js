const enter = document.getElementById("enter");
const nickname = document.getElementById("nickname");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function hangleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function () {
            window.location.href = targetURL;
        }, 2000);
    }

    nickname.addEventListener("input", () => {
        this.localStorage.setItem("nickname", nickname.value)
    });

    enter.addEventListener("submit", function () {
        hangleButtonClick("../pages/menu.html");
        });

});

function hangleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
};

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

enter.addEventListener('mouseover', hangleOnButton);
enter.addEventListener('mouseout', pullOfWithButton);