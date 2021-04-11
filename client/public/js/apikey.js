function createKeyContainer(domain, key){
    //add code if domain and key are null create api from server
    let element = "<div id='" + key + "'>" +
    "<div class='input-group mb-3'>" + 
      "<div class='input-group-prepend'>" +
        "<span class='input-group-text' id='basic-addon3'>https://</span>" +
      "</div>" +
      "<input id='domain"+key+"' type='text' class='form-control' id='basic-url' aria-describedby='basic-addon3' value=" + domain + ">" + 
    "</div>" +
    "<div><p id='key" +key+ "'>" + key + "</p><button id='copyBtn" +key+ "' type='button' class='btn btn-primary' onclick='CopyAPI(this)'>Copy</button></div>" +
    "<button id='deleteBtn" + key +"'  type='button' class='btn btn-primary' onclick='DeleteAPI(this)'>DELETE</button>" +
    "<button id='saveBtn" + key +"' type='button' class='btn btn-primary' onclick='SaveDomain(this)'>SAVE</button>" +
 "</div>"
    $("#apiDisplay").append(element);
    console.log("this is running")
}


function GenerateAPI(){
    let userInfo = localStorage.getItem("userInfo");
    let domain =  "https://" + document.getElementById("domain").value;
    document.getElementById("domain").value = "";
    userInfo = JSON.parse(userInfo);
    if(userInfo.name != "" && userInfo.password != "" && domain){
    const url = "http://sean-green-cst.com/quarterKings/v1/generate";
    var http = new XMLHttpRequest;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(JSON.stringify({name : userInfo.name, password : userInfo.password, domain: domain}));
    http.onload = () => {
      console.log(http.responseText);
      createKeyContainer(domain, JSON.parse(http.responseText).key);
    };
    } else {
      console.log("information missing")
    }
}


function loadExistingAPIKeys() {
  $("#apiDisplay").empty();
  let userInfo = localStorage.getItem("userInfo");
  userInfo = JSON.parse(userInfo);
  const url = "http://sean-green-cst.com/quarterKings/v1/getKeys";
  var http = new XMLHttpRequest;
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send(JSON.stringify({name : userInfo.name, password : userInfo.password}));
  http.onload = () => {
    console.log(http.responseText);
    let list = JSON.parse(http.responseText);
    for(let i = 0; i < list.length; i++){
      if(list[i].domain == "https://www.johnnyscott.ca") {
        let user = JSON.parse(localStorage.getItem("userInfo"));
        localStorage.setItem("userInfo", JSON.stringify({name : user.name, password : user.password, cookieApi: list[i].apiKey}))
      } else {
      createKeyContainer(list[i].domain.substring(8), list[i].apiKey);
      }
    }
  };
}

function DeleteAPI(button){
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    let key = button.id.substring(9);
    console.log(key)
    const url = "http://sean-green-cst.com/quarterKings/v1/deleteApiKey";
    var http = new XMLHttpRequest;
    http.open("DELETE", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(JSON.stringify({name : userInfo.name, password : userInfo.password, apiKey: key}));
    http.onload = () => {
      console.log(http.responseText);
      loadExistingAPIKeys();
    }
}

function SaveDomain(button){
    let key = button.id.substring(7);
    let userInfo = localStorage.getItem("userInfo");
    userInfo = JSON.parse(userInfo);
    let domain = "https://" + document.getElementById("domain" + key).value;
    const url = "http://sean-green-cst.com/quarterKings/v1/updateDomain";
    var http = new XMLHttpRequest;
    http.open("PUT", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(JSON.stringify({name : userInfo.name, password : userInfo.password, apiKey: key, domain: domain}));
    http.onload = () => {
      console.log(`${http.status} ${http.responseText}`)
      loadExistingAPIKeys();
    };
}

function CopyAPI(button){
  let key = button.id.substring(7);
  /* Get the text field */
  var copyText = document.getElementById("key" + key);
  console.log(copyText.innerHTML)
  var elem = document.createElement("textarea");
  document.body.appendChild(elem);
  elem.value = copyText.innerHTML;
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
  alert("Copied the text: " + copyText.innerHTML);
}

loadExistingAPIKeys();
document.getElementById("generateBtn").onclick = GenerateAPI