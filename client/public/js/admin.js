const { setUncaughtExceptionCaptureCallback } = require("node:process");

const url = "https://sean-green-cst.com/quarterKings/v1/stats"; 
var http = new XMLHttpRequest;
http.open("POST", url, true);
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
let statArea = document.getElementById("statArea")
http.onload = () => {
   console.log(`${http.status} ${http.responseText}`);
   let rows = JSON.parse(http.response);
   // Money maker is right here
   rows.forEach(row => {
      let newRow = "<div class='card text-center'id="+ row.url +"><p>" + row.url + ": " + row.hits + "</p></div>"
      $('#statsdiv').append(newRow);
   })
   /////////////////////////////
};

http.send(JSON.stringify(
   {
      name : "Admin", 
      password : "admin12345"
   }
));