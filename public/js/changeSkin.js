const skinArrow = document.getElementsByClassName("skin-arrow");
const prevSkin = document.getElementById("prevSkin");
const nextSkin = document.getElementById("nextSkin");
const save = document.getElementById("save");

// const snakeColors = ["#C0392B", "#E74C3C", "#9B59B6", "#8E44AD", "#2980B9",
//     "#3498DB", "#17A589", "#138D75", "#229954", "#28B463", "#D4AC0D",
//     "#D68910", "#CA6F1E", "#BA4A00"];
//
// let colorOrder = -1;

window.addEventListener("DOMContentLoaded", function ()
{
    document.body.classList.add("fade-in");

    function handleButtonClick(targetURL)
    {
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(function ()
        {
            window.location.href = targetURL;
        }, 500);
    }
})

function handleOnImage(e)
{
    const image = e.target;
    image.style.opacity = "0.9";
}

function pullOfWithImage(e)
{
    const image = e.target;
    image.style.opacity = "0.5";
}

function handleOnButton(e)
{
    const button = e.target;
    button.style.opacity = "1";
}

function pullOfWithButton(e)
{
    const button = e.target;
    button.style.opacity = "0.8";
}

// function changeColor()
// {
//     colorOrder++;
//     return snakeColors[colorOrder]
// }

prevSkin.addEventListener('mouseover', handleOnImage);
prevSkin.addEventListener('mouseout', pullOfWithImage);

nextSkin.addEventListener('mouseover', handleOnImage);
nextSkin.addEventListener('mouseout', pullOfWithImage);

save.addEventListener('mouseover', handleOnButton);
save.addEventListener('mouseout', pullOfWithButton);
