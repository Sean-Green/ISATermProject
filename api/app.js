const express = require('express');
const app = express();
const port = 3000;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'arcadedb',
    user: 'admin',
    password: 'admin'
});

// Establish connection to local database
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});


// Get the score for the queried apiKey, 
// if the key doesn't match the domain that sent the query 
// or doesn't exist yet, send a 400 error.
app.get('/scores', (req, res) => {
    console.log(`Request from api key = ${req.query.api} hostname = ${req.hostname}`);
    connection.query(
        `SELECT * 
        FROM apiKeys 
        WHERE apiKey = '${req.query.api}'`, 
        function (error, results, fields) {
        if (error) {
            console.log("SQL DATABASE ERROR in /scores GET");
            res.status('500').send('Internal Server Error').send;
            // throw error;
        } else if (results.length < 1) {
            // connected!
            console.log('Success')
            res.status('400').send("APIKEY not found");
        }else if (req.hostname === results[0].domain && req.query.api === results[0].apiKey) {
            // connected!
            console.log('Success')
            res.status('200').send({
                scores: results
            });
        } else {
            res.status('400').send('APIKey/Domain invalid');
        }
    });
});

// Listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});