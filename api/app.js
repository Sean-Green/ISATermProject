const express = require('express');
const app = express();
const port = 3000;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  database : 'arcadedb',
  user     : 'admin',
  password : 'admin'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.get('/scores', (req, res) => {
  console.log(`api key = ${req.query.api}\n url = ${req.hostname}`);
  connection.query(`SELECT * FROM scores WHERE apiKey = '${req.query.api}'`, function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.send({scores : results});
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});