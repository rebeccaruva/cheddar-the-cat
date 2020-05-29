////////////////////
//
// when push button, page reloads
//
////////////////////

var wiggleBtn = document.getElementById("wiggle");

wiggleBtn.addEventListener("click", function() {
    window.location.reload();
});

////////////////////
//
// either cat plays or cat sleeps on page
//
////////////////////
var body = document.getElementsByTagName("body")[0];

body.onload = function() {
    var randomPlay = false; //either play or sleep
    var randomNum = Math.floor(Math.random() * 100);;
    if (randomNum >= 45) {
        // if >= 45 randomPlay is true, else it is false
        catPlay();
    } else {
        catSleep();
    }
};

var playingCat = document.getElementById("play");
var sleepingCat = document.getElementById("sleep");
var catBall = document.getElementById("ball");

function catPlay() {
    sleepingCat.classList.add("hide");
    playingCat.classList.remove("hide");
    catBall.classList.remove("hide");

    playWithCat();
}

function catSleep() {
    playingCat.classList.add("hide");
    sleepingCat.classList.remove("hide");
}

function playWithCat() {
    console.log("I can play with the cat - to be implemented at a later date");
}