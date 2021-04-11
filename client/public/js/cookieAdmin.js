let apiKey = JSON.parse(localStorage.getItem("userInfo")).cookieApi;
let leaderboard = document.getElementById("leaderboardArea");
let scoresResponseDiv = document.getElementById("demo");
let deleteAllbtn = document.getElementById("deleteAllbtn"); 

function deleteEntry(element) {
    let idNum = element.id.substring(3);
    console.log(idNum)
    const url = "https://www.sean-green-cst.com/quarterKings/v1/deleteScore";
    var http = new XMLHttpRequest;
    http.open("DELETE", url, true);
    http.send( JSON.stringify({apiKey: apiKey, id: idNum}) );
    http.onload = () => {
        console.log(http.status)
        loadLeaderboard();
    }
}
function deleteAllEntries() {
    const url = "https://www.sean-green-cst.com/quarterKings/v1/deleteAll";
    var http = new XMLHttpRequest;
    http.open("DELETE", url, true);
    http.send( JSON.stringify({apiKey: apiKey}) );
    http.onload = () => {
        console.log(http.status)
        loadLeaderboard();
    }
}


function updateEntry(button) {
    let idNum = button.id.substring(9);
    let newscore = parseInt(document.getElementById("scoreInput").value);
    const url = "https://www.sean-green-cst.com/quarterKings/v1/updateScore";
    var http = new XMLHttpRequest;
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(JSON.stringify({score : newscore, id: idNum, apiKey: apiKey}));
    http.onload = () => {
      console.log(`${http.status} ${http.responseText}`)
      loadLeaderboard();
    };
}

function loadLeaderboard() {
    let completeList = [];
    let entryList = [];
    const url = "https://www.sean-green-cst.com/quarterKings/v1/getScores?api=" + apiKey;
    var http = new XMLHttpRequest;
    http.open("GET", url, true);
    http.send( null );
    http.onload = () => {
        completeList = JSON.parse(http.responseText)
        scoresResponseDiv.innerHTML = http.responseText.replace(/,/g, '<br>');
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
        let entry = "<div class='card' id='" + list[i].id + "'><div class='entries'><span class='ident'>Name: </span>"  +
       list[i].name + " <br><span class='ident'>Score: </span>" +"<input id='scoreInput' type='number' class='score' aria-label='Password' aria-describedby='basic-addon1' value="+ list[i].score +"> </div>" + "<div class='btn-group' role='group' aria-label='Basic example'> <button class='btn btn-primary btn-sm' id='updatebtn" + list[i].id + "' onclick='updateEntry(this)'>Update Score</button><button class='btn btn-warning btn-sm'  id='btn" + list[i].id + "' onclick='deleteEntry(this)'>Delete Entry</button></div> </div>"
        $(".leaderboardArea").append(entry);
        console.log("this is running")
    }
}
    

}

deleteAllbtn.onclick = deleteAllEntries
loadLeaderboard();