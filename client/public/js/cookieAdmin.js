
let leaderboard = document.getElementById("leaderboardArea");
let scoresResponseDiv = document.getElementById("demo");

function deleteEntry(element) {
    let id = element.id.substring(3);
    console.log(id)
    //delete entry
}
function deleteAllEntries() {
    //delete all entries
}


function loadLeaderboard() {
    let completeList = [];
    let entryList = [];
    const url = "https://sean-green-cst.com/quarterKings/v1/getScores?api=0123456789abcdef";
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
        let entry = "<div id='" + list[i].id + "'>" +
       list[i].name + " " + list[i].score + "<button id='btn" + list[i].id + "' onclick='deleteEntry(this)'>delete</button></div>"
        $(".leaderboardArea").append(entry);
        console.log("this is running")
    }
}
    

}

loadLeaderboard();