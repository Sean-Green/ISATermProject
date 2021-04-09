const url = "https://sean-green-cst.com/quarterKings/v1/stats"; 
// const url = "http://localhost:3000/quarterKings/v1/stats"; 
var http = new XMLHttpRequest;
http.open("POST", url, true);
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

http.onload = () => {
   console.log(`${http.status} ${http.responseText}`);
   let rows = JSON.parse(http.response);
   // Money maker is right here
   rows.forEach(row => {
      console.log(`url = ${row.url} hits = ${row.hits}`)
   })
   /////////////////////////////
};

http.send(JSON.stringify(
   {
      name : "Admin", 
      password : "admin12345"
   }
));
