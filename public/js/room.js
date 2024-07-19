const create = document.getElementById("create");
const join = document.getElementById("join");
const form = document.querySelector("room");

window.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL) {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out"); 

        setTimeout(function () {
            window.location.href = targetURL;
        }, 500);
    }

    create.addEventListener("click", function () {
        //handleButtonClick("../pages/index.html");
    });

    join.addEventListener("click", function () {
     //   handleButtonClick("../pages/index.html");
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

create.addEventListener('mouseover', handleOnButton);
create.addEventListener('mouseout', pullOfWithButton);

join.addEventListener('mouseover', handleOnButton);
join.addEventListener('mouseout', pullOfWithButton);


