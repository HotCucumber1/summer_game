const single = document.getElementById("single");
const multi = document.getElementById("multi");
const changeSkin = document.getElementById("change-skin");
const form = document.querySelector("menu");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out"); 

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    single.addEventListener("click", function () {
        handleButtonClick("../pages/index.html");
    });

    multi.addEventListener("click", function () {
        handleButtonClick("../pages/room.html");
    });

    changeSkin.addEventListener("click", function () {
        handleButtonClick("../pages/changeSkin.html");
    });
    
});

function handleOnButton(e) {
    const button = e.target;
    button.style.boxShadow = "0 0 20px rgb(161, 161, 161)"; 
};

function pullOfWithButton(e) {
    const button = e.target;
    button.style.boxShadow = "";
}

function handleOnImage(e) {
    const image = e.target;
    image.style.filter = "brightness(1)";
};

function pullOfWithImage(e) {
    const image = e.target;
    image.style.filter = "brightness(0.8)";
}

single.addEventListener('mouseover', handleOnButton);
single.addEventListener('mouseout', pullOfWithButton);

multi.addEventListener('mouseover', handleOnButton);
multi.addEventListener('mouseout', pullOfWithButton);

changeSkin.addEventListener('mouseover', handleOnImage);
changeSkin.addEventListener('mouseout', pullOfWithImage);


