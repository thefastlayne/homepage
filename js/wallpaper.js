/**
 * Dynamic Wallpaper with Clock
 */
const time = document.getElementById("time"),
    greeting = document.getElementById("greeting"),
    name = document.getElementById("name"),
    focus = document.getElementById("focus"),
    showAmPM = true;


function dynamicTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();

    const amPm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;
    time.innerHTML = `${hour}<span>:</span>${zeroCorrection(min)}<span>:</span>${zeroCorrection(sec)} ${showAmPM ? amPm : ""}`;
    setTimeout(dynamicTime, 1000);
}

function zeroCorrection(num) {
    return (parseInt(num, 10) < 10 ? "0" : "") + num;
}

function getBackground() {
    let today = new Date(),
        hour = today.getHours();

    if (hour < 12) {
        document.body.style.backgroundImage = `url("../img/morning.jpg")`;
        greeting.textContent = "Good Morning";
    } else if (hour < 18) {
        document.body.style.backgroundImage = `url("../img/afternoon.jpg")`;
        greeting.textContent = "Good Afternoon";
    } else {
        document.body.style.backgroundImage = `url("../img/night.jpg")`;
        greeting.textContent = "Good Evening";
        document.body.style.color = "white";
    }
}

function getName() {
    if (localStorage.getItem("name") === null) {
        name.textContent = "[Enter Name]";
    } else {
        name.textContent = localStorage.getItem("name");
    }
}

function setName(evt) {
    if (evt.type === "keypress") {
        if (evt.which == 13 || evt.keyCode == 13) {
            localStorage.setItem("name", evt.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem("name", evt.target.innerText);
    }
}

function getFocus() {
    if (localStorage.getItem("focus") === null) {
        focus.textContent = "[Enter Focus]"
    } else {
        focus.textContent = localStorage.getItem("focus");
    }
}

function setFocus(evt) {
    if (evt.type === "keypress") {
        if (evt.which == 13 || evt.keyCode == 13) {
            localStorage.setItem("focus", evt.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem("focus", evt.target.innerText);
    }
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

dynamicTime();
getBackground();
getName();
getFocus();
