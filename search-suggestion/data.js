const searchButton = document.getElementsByClassName("search-key");

var timerInterval;
var second;
var keypressCount;
var data = []; //questions
var i = 0;

function updateTimer() {
    second++;
}

searchBox.addEventListener("keydown", function() {
    if (!timerInterval) {
        second = 0;
        keypressCount = 0;
        timerInterval = setInterval(updateTimer, 1000);
    }
    keypressCount++;
});

searchButton[0].addEventListener("click", function() {
    clearInterval(timerInterval);
    timerInterval = null;
    data.push([]); //remove
    data[i].push(i);
    data[i].push(second);
    data[i].push(keypressCount);
    console.log(data);
    i++;
});