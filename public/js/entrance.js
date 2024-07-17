window.addEventListener("DOMContentLoaded", function () {
    const enter = document.getElementById("enter");
    const nickname = document.getElementById("nickname");

    function hangleOnButton(e) {
        const button = e.target;
        button.style.boxShadow = "0 0 20px rgb(161, 161, 161)";
    }

    function pullOfWithButton(e) {
        const button = e.target;
        button.style.boxShadow = "";
    }

    enter.addEventListener('mouseover', hangleOnButton);
    enter.addEventListener('mouseout', pullOfWithButton);


    document.body.classList.add("fade-in");

    function hangleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {window.location.href = targetURL;}, 2000);
    }

    nickname.addEventListener("input", () => localStorage.setItem("nickname", nickname.value));

    enter.addEventListener("submit", function () {
        const nickname = document.getElementById("nickname");
    });
});

