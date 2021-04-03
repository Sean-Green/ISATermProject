function createKeyContainer(domain, key){
    //add code if domain and key are null create api from server
    let element = "<div id='" + key + "'>" +
    "<div class='input-group mb-3'>" + 
      "<div class='input-group-prepend'>" +
        "<span class='input-group-text' id='basic-addon3'>https://</span>" +
      "</div>" +
      "<input type='text' class='form-control' id='basic-url' aria-describedby='basic-addon3'>" + 
    "</div>" +
    "<div>someAPIkey<button id='deleteBtn' type='button' class='btn btn-primary'>copy</button></div>" +
    "<button id='deleteBtn' type='button' class='btn btn-primary'>DELETE</button>" +
    "<button id='saveBtn' type='button' class='btn btn-primary'>SAVE</button>" +
 "</div>"
    $("#apiDisplay").append(element);
    console.log("this is running")
}

document.getElementById("generateBtn").onclick = createKeyContainer


function GenerateAPI(){
    const url = "http://sean-green-cst.com/quarterKings/v1/generate";
    var http = new XMLHttpRequest;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onload = () => {console.log(`${http.status} ${http.responseText}`)};
    //http.send(JSON.stringify({name : user, password : pass}));
    //get response
    //createKeyContainer(domainFromResponse, apiKeyFromResponse);
}


function loadExistingAPIKeys() {
    // some how get all api keys of the user.
}

function DeleteAPI(){
    const url = "http://sean-green-cst.com/quarterKings/v1/deleteAll";
    var http = new XMLHttpRequest;
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onload = () => {console.log(`${http.status} ${http.responseText}`)};
    //http.send(JSON.stringify({name : user, password : pass}));
}

function SaveAPI(){
    const url = "http://sean-green-cst.com/quarterKings/v1/updateDomain";
    var http = new XMLHttpRequest;
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onload = () => {console.log(`${http.status} ${http.responseText}`)};
    //http.send(JSON.stringify({name : user, password : pass}));
}

function CopyAPI(){
  /* Get the text field */
  var copyText = document.getElementById("myInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}