const express = require('express');
const app = express();
const port = 3000; 

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
        console.error('error connecting to sql db: ' + err.stack);
        return;
    }
    console.log('connected to sql db as id ' + connection.threadId);
});

// POST METHODS 
// --------------------------------------------------------------------------------
// Admin POST method for adding logins
app.post('/quarterKings/v1/signup',  (req, res)=>{  
    increment('signup');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /signup/ failed, invalid object ')
            return;
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
                console.log(`User ${user.name} Created`);
                res.sendStatus(201).send('User Created');  
            }
        });          
    });
});

// Login post method for admins
app.post('/quarterKings/v1/login',  (req, res)=>{  
    increment('login');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /login/ failed, invalid object ')
            return;
        }
        console.log(`searching for ${user.name} ${user.password}`)
        connection.query(
            `SELECT *
            FROM users
            WHERE email = '${user.name}' AND password = '${user.password}'`, 
            function (error, results, fields) {
            if (error) {
                // console.log(error);
                console.log(`SQL Select Failed: ${error.message}`);
                res.status('500').send(`${error.message}`);
                // throw error;
            } else if (results.length > 0) {
                console.log(`User ${user.name} Logged in`);
                res.status(200).send('Login Success');  
            } else {
                console.log(results)
                console.log('Username or Password invalid');
                res.status('404').send('username or password invalid');
            }
        });          
    });
});

// Generate an API Key and attach it to the account.
// Uses SQL to check for the user account before inserting a new key, 
// if the user account info is wrong it will fail and return 400.
app.post('/quarterKings/v1/generate',  (req, res)=>{  
    increment('generate');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password || !user.domain) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /generate/ failed, invalid object ')
            return;
        }
        console.log(`generating api key for for 
            ${user.name} ${user.password} ${user.domain}`)
        let newkey = generateAPIKey();
        connection.query(
            `INSERT INTO apiKeys(email, apiKey, domain)
            VALUES ((SELECT email 
                    FROM users 
                    WHERE email = "${user.name}" 
                    AND password = "${user.password}"), "${newkey}", "${user.domain}");`, 
            function (error, results, fields) {
            if (error) {
                console.log(`SQL Select in /generate/ Failed: ${error.message}`);
                res.status('401').send({ message : `username/password invalid`, "error" : `${error.message}`});
                return;
            } else {
                console.log(`APIKey ${newkey} generated for ${user.name}`);
                res.status(201).send({key : newkey});
                return;  
            }             
        });          
    });
});

// Returns all keys for the given user
app.post('/quarterKings/v1/getKeys',  (req, res)=>{  
    increment('getKeys');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /generate/ failed, invalid object ')
            return;
        }
        connection.query(
            `SELECT apiKey, domain 
            FROM apiKeys 
            WHERE email = (
                SELECT email 
                FROM users 
                WHERE email = "${user.name}" 
                AND password = "${user.password}")`, 
            function (error, results, fields) {
            if (error) {
                console.log(`SQL Select Failed: ${error.message}`);
                res.status('400').send(`${error.message}`);
                return;
            } else {
                console.log(`APIKeys retrieved for ${user.name}`);
                res.status(200).send(results);
                return;  
            } 
        });          
    });
});

app.post('/quarterKings/v1/score',  (req, res)=>{  
    increment('score');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let score = (JSON.parse(strdata));  
        if (!score.name || !score.score || !score.apiKey) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /score/ failed, invalid object ')
            return;
        }
        console.log(`Inserting score for player  
            ${score.name} of ${score.score} in apikey ${score.domain}`)
        connection.query(
            `INSERT INTO scores(scoreDate, playerName, apiKey, score)
            VALUES(CURRENT_TIMESTAMP, '${score.name}', "${score.apiKey}", ${score.score});`, 
            function (error, results, fields) {
            if (error) {
                console.log(`SQL insert in /score/ Failed: ${error.message}`);
                res.status(400).send(`apikey ${score.apiKey} invalid`);
                return;
            } else {
                console.log(`Score inserted for ${score.name} with ${score.apiKey}`);
                res.status(201).send("Success");
                return;  
            }             
        });          
    });
});

// Returns Stats on endpoints
app.post('/quarterKings/v1/stats', (req, res)=>{
    increment('stats');
    res.header('Access-Control-Allow-Origin', '*');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));  
        if (!user.name || !user.password) {
            res.status(400).send('invalid input, object invalid')
            console.log('POST /generate/ failed, invalid object ')
            return;
        } else if (user.name !== "Admin" || user.password !== "admin12345") {
            res.status(401).send('username or password invalid')
            console.log('POST /generate/ failed, invalid object ')
            return;
        }
        connection.query(
            `SELECT * FROM endPoints`, 
            function (error, results, fields) {
            if (error) {
                console.log(`SQL Select Failed: ${error.message}`);
                res.status('400').send(`${error.message}`);
                return;
            } else {
                console.log(`Stats retrieved for ${user.name}`);
                res.status(200).send(results);
            } 
        });          
    });
});

// GET METHODS
// ------------------------------------------------------------------------------------

// Get the score for the queried apiKey, 
// if the key doesn't match the domain that sent the query 
// or doesn't exist yet, send a 400 error.
app.get('/quarterKings/v1/getScores', (req, res) => {
    increment('getScores');
    res.header('Access-Control-Allow-Origin', '*');
    console.log(`Request from api key = ${req.query.api} hostname = ${req.hostname}`);
    if (!req.query.api) {
        res.status('400').send('No api specified in query.');
        console.log('No API Key, bad request.')
    } else {
        connection.query(
        `SELECT * 
        FROM scores 
        WHERE apiKey = '${req.query.api}'`, 
        function (error, results, fields) {
            if (error) {
                console.log("SQL DATABASE ERROR in /scores GET");
                res.status('500').send('Internal Server Error').send;
                // throw error;
            } else {
                // connected!
                console.log('Success returning ')
                res.status('200').send(
                    results
                );
            }
        });
    }
});

// Helper methods
// -----------------------------------------------------------------------

// increment endpoint stats in the database
function increment(endpoint) {
    connection.query(`UPDATE endPoints SET hits = hits + 1 WHERE url = '${endpoint}'`,
    (err, res, fields) => {
        if (err) {
            console.log(err)
        } else ("Increment " + endpoint)
    })
}

// uses random to create random strings concatinate them, 
// returns a 16 char api key
function generateAPIKey() {
    let f = () => Math.random().toString(36).substring(2)
    let apikey = () => (f() + f()).substring(0, 16)
    return apikey();
}

// -----------------------------------------------------------------------------------

// Listen 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});