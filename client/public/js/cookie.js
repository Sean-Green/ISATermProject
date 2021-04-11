let apiKey = JSON.parse(localStorage.getItem("userInfo")).cookieApi;

let scoreCont = document.getElementById("score");
let submitBtn = document.getElementById("submitBtn");
let coin = document.getElementById("clickable");
let leaderboard = document.getElementById("leaderboardArea");
let usernameInput = document.getElementById("userName");
function coinClick() {
    let newNum = parseInt(scoreCont.innerHTML) + 1;
    scoreCont.innerHTML = newNum.toString();
    console.log(scoreCont.innerHTML)
}

function submitScore() {
    let username = usernameInput.value.trim();
    console.log()
    if(username == ""){
        username = "anonymous"
    }
    const url = "http://sean-green-cst.com/quarterKings/v1/score"; 
    var http = new XMLHttpRequest;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onload = () => {console.log(`${http.status} ${http.responseText}`)};
    http.send(JSON.stringify(
       {
          name : username, 
          apiKey : apiKey,
          score : parseInt(scoreCont.innerHTML)
       }
    ));
    scoreCont.innerHTML = "0";
    http.onload = () => {loadLeaderboard();};
}

function loadLeaderboard() {
    let completeList = [];
    let entryList = [];
    const url = "https://sean-green-cst.com/quarterKings/v1/getScores?api=" + apiKey;
    var http = new XMLHttpRequest;
    http.open("GET", url, true);
    http.send( null );
    http.onload = () => {
        completeList = JSON.parse(http.responseText)
        console.log(completeList)
        for(let i = 0; i < completeList.length; i++){
            let x = {name: completeList[i].playerName, score: completeList[i].score, id: completeList[i].scoreID}
            entryList.push(x)
        }   
        console.log(entryList)
        entryList.sort(function(a, b) {
            return parseInt(b.score) - parseInt(a.score);
        });
        populateLeaderboard(entryList);
    }

function populateLeaderboard(list) {
    $(".leaderboardArea").empty();
    let total = 10;
    if(list.length < 10){
        total = list.length;
    }
    for(let i = 0; i < total; i++){
        let entry = "<div id='" + list[i].id + "'>" +
       list[i].name + " " + list[i].score + "</div>"
        $(".leaderboardArea").append(entry);
        console.log("this is running")
    }
}
    

}

submitBtn.onclick = submitScore;
coin.onclick = coinClick;
loadLeaderboard();