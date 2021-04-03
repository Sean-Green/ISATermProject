const express = require('express');
const app = express();
const port = 3000; 

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'seangree_arcadeChampions',
    user: 'seangree_arcadeAdmin',
    password: 'arcadeAdmin'
});

// Establish connection to local database
connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

var signupHits = 0;

app.post('/quarterKings/v1/signup',  (req, res)=>{  
    signupHits++;
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password) {
            res.status(400).send('invalid input, object invalid')
        }
        connection.query(
            `INSERT INTO users(email, password)
            VALUES ("${user.name}", "${user.password}");`, 
            function (error, results, fields) {
            if (error) {
                // console.log(error);
                console.log(`SQL Insert Failed: ${error.message}`);
                res.status('409').send(`${error.message}`);
                // throw error;
            } else {
                console.log("");
                res.sendStatus(201).send('User Created');  
            }
        });          
    });
});

// Just a test route.
app.get('/quarterKings/v1', (req, res)=>{
    console.log('connected to route');
    res.send("hello there");
});

var scoresHits = 0;
// Get the score for the queried apiKey, 
// if the key doesn't match the domain that sent the query 
// or doesn't exist yet, send a 400 error.
app.get('/quarterKings/v1/scores', (req, res) => {
    scoresHits++;
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
        } else if (req.hostname === results[0].domain && req.query.api === results[0].apiKey) {
            // connected!
            console.log('Success returning ')
            res.status('200').send(
                results
            );
        } else {
            res.status('400').send('APIKey/Domain invalid');
        }
    });
});

app.get('/quarterKings/v1/stats', (req, res)=>{
    res.status(200).send({
        scores : scoresHits,
        signup : signupHits
    });
});

// Listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});