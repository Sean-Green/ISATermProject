var url = "https://sean-green-cst.com/quarterKings/v1/stats"
var xhttp = new XMLHttpRequest();
var stats;
xhttp.open("GET", url, true);
xhttp.onload = ()=>{
   console.log(stats = JSON.parse(xhttp.response))
   document.getElementById("statsDiv").innerHTML =
      `<table>
         <thead>
            <td>PATH</td><td>HITS</td>
         </thead>
            <tr>
               <td>/scores</td><td>${stats.scores}</td>
            </tr>
            <tr>
               <td>/signup</td><td>${stats.signup}</td>
            </tr>
      </table>`;
};
xhttp.send();
