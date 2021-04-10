const express = require('express');
const app = express();
const port = 3000;
var clientOrigin;
// clientOrigin = 'http://127.0.0.1:5500';
// clientOrigin = 'https://www.johnnyscott.ca/'

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

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
// TODO Add host confirmation

// Admin POST method for adding logins
app.post('/quarterKings/v1/signup', (req, res) => {
    if (clientOrigin && req.headers.origin !== clientOrigin) {
        res.status(403).send('Forbidden');
        console.log(`Access to login from ${req.headers.origin} refused`);
        return;
    }
    increment('signup');
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
                    res.status(409).send(`${error.message}`);
                    // throw error;
                } else {
                    console.log(`User ${user.name} Created`);
                    res.sendStatus(201).send('User Created');
                }
            });
    });
});

// Login post method for admins
app.post('/quarterKings/v1/login', (req, res) => {
    if (clientOrigin && req.headers.origin !== clientOrigin) {
        res.status(403).send('Forbidden');
        console.log(`Access to login from ${req.headers.origin} refused`);
        return;
    }
    increment('login');
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
                    res.status(500).send(`${error.message}`);
                    // throw error;
                } else if (results.length > 0) {
                    console.log(`User ${user.name} Logged in`);
                    res.status(200).send('Login Success');
                } else {
                    console.log(results)
                    console.log('Username or Password invalid');
                    res.status(401).send('username or password invalid');
                }
            });
    });
});

// Generate an API Key and attach it to the account.
// Uses SQL to check for the user account before inserting a new key, 
// if the user account info is wrong it will fail and return 400.
app.post('/quarterKings/v1/generate', (req, res) => {
    if (clientOrigin && req.headers.origin !== clientOrigin) {
        res.status(403).send('Forbidden');
        console.log(`Access to login from ${req.headers.origin} refused`);
        return;
    }
    increment('generate');
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
                    res.status(401).send({
                        message: `username/password invalid`,
                        "error": `${error.message}`
                    });
                    return;
                } else {
                    console.log(`APIKey ${newkey} generated for ${user.name}`);
                    res.status(201).send({
                        key: newkey
                    });
                    return;
                }
            });
    });
});

// Returns all keys for the given user
app.post('/quarterKings/v1/getKeys', (req, res) => {
    if (clientOrigin && req.headers.origin !== clientOrigin) {
        res.status(403).send('Forbidden');
        console.log(`Access to login from ${req.headers.origin} refused`);
        return;
    }
    increment('getKeys');
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
                    console.log(`Invalid username or password: ${error.message}`);
                    res.status('401').send(`invalid username or password`);
                    return;
                } else {
                    console.log(`APIKeys retrieved for ${user.name}`);
                    res.status(200).send(results);
                    return;
                }
            });
    });
});

app.post('/quarterKings/v1/score', (req, res) => {
    increment('score');
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
                    res.status(401).send(`apikey ${score.apiKey} invalid`);
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
app.post('/quarterKings/v1/stats', (req, res) => {
    if (clientOrigin && req.headers.origin !== clientOrigin) {
        res.status(403).send('Forbidden');
        console.log(`Access to login from ${req.headers.origin} refused`);
        return;
    }
    increment('stats');
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
                    res.status(500).send(`${error.message}`);
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
// TODO Add host confirmation

// Get the score for the queried apiKey, 
// if the key doesn't match the domain that sent the query 
// or doesn't exist yet, send a 400 error.
app.get('/quarterKings/v1/getScores', (req, res) => {
    increment('getScores');
    console.log(`Request from api key = ${req.query.api} origin = ${req.headers.origin}`);
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
                console.log('Success /getScores for $req.query.api')
                res.status('200').send(results);
            }
        });
    }
});

// DELETE METHODS
// --------------------------------------------------------------------------
// TODO check if there is data to delete
// TODO Add host confirmation

// ## /deleteAll 
// Delete all scores associated with an API key 
app.delete('/quarterKings/v1/deleteAll', (req, res) => {
    increment('deleteAll');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));
        if (!user.apiKey) {
            res.status(400).send('invalid input, object invalid')
            console.log('/deleteAll failed, invalid object ')
            return;
        }
        console.log(`Request from api key = ${user.apiKey} origin = ${req.headers.origin}`);
        connection.query(
        `DELETE FROM scores WHERE apiKey = '${user.apiKey}'`,
        function (error, results, fields) {
            if (error) {
                console.log(`SQL DELETE Failed: ${error.message}`);
                res.status('400').send(`${error.message}`);
                return;
            } else {
                console.log(`Deleted all data for apikey ${user.apiKey}`);
                res.status('204').send('Success');
            }
        });
    });
});

// ## /deleteScore 
// delete a single entry from the score table
app.delete('/quarterKings/v1/deleteScore', (req, res) => {
    increment('deleteScore');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let score = (JSON.parse(strdata));
        if (!score.apiKey || !score.id) {
            console.log(`Missing: apikey ${score.apiKey}, id ${score.id}`);
            res.status('400').send('apikey and id required');
            return;
        }
        console.log(`Request from api key = ${score.apiKey}, score id = ${score.id} origin = ${req.headers.origin}`);
        connection.query(
            `DELETE FROM scores WHERE apiKey = '${score.apiKey}' AND scoreID = '${score.id}'`,
            function (error, results, fields) {
                if (error) {
                    console.log(`SQL DELETE Failed: ${error.message}`);
                    res.status('400').send(`${error.message}`);
                    return;
                } else {
                    console.log(`Deleted score for apikey ${score.apiKey} and scoreID ${score.id}`);
                    res.status('204').send('Success');
                }
            });
    });
});

// deleteApiKey
// Admin only
// Delete all scores associated with an apiKey, then delete the api key.
app.delete('/quarterKings/v1/deleteApiKey', (req, res) => {
    increment('deleteApiKey');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));
        if (!user.apiKey || !user.name || !user.password) {
            console.log(
                `Missing: apikey ${user.apiKey}, username ${user.name}, 
                password ${user.password}`
            );
            res.status(400).send('Request missing field');
            return;
        }
        console.log(`/deleteApiKey Request from apikey ${user.apiKey}, username ${user.name}, password ${user.password}`);
        connection.query(
        `SELECT * 
        FROM apiKeys NATURAL JOIN users 
        WHERE apiKey = '${user.apiKey}'
            AND email = '${user.name}'
            AND password = "${user.password}"`,
        function (err1, selResults, f1) {
            if (err1) {
                console.log(`deleteApiKey Failed: ${err1.message}`);
                res.status('500').send(`Internal server error ${err1.message}`);
                return;
            } else if (selResults.length === 1){ 
                // TODO delete apiKey scores
                connection.query(
                `DELETE FROM scores WHERE apiKey = '${user.apiKey}'`,
                function (error, results, fields) {
                    if (error) {
                        console.log(`SQL DELETE Failed: ${error.message}`);
                        res.status('400').send(`${error.message}`);
                        return;
                    } else {
                        console.log(`Deleting apikey ${user.apiKey}`);
                        connection.query(
                        `DELETE FROM apiKeys
                        WHERE apiKey = '${user.apiKey}'`,
                        function (err2, r, f2) {
                            if (err2) {
                                console.log(`${err2}`)
                            } else {
                                console.log(`Delete successful for apikey ${user.apiKey}`);
                                res.status(204).send('Successful Delete');
                                return;
                            }
                        console.log(`Deleted all data for apikey ${user.apiKey}`);
                        });
                    }
                });
            } else {
                res.status(400).send("Missing or incorrect fields")
            }
        });
    });
});

// PUT METHODS
// --------------------------------------------------------------------------

// ## /updateDomain 
// update the domain name at the given api key
app.put('/quarterKings/v1/updateDomain', (req, res) => {
    increment('updateDomain');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let user = (JSON.parse(strdata));
        if (!user.apiKey || !user.name || !user.password || !user.domain) {
            console.log(
                `Missing: apikey ${user.apiKey}, username ${user.name}, 
                password ${user.password}, domain ${user.domain}`
            );
            res.status(400).send('Request missing field');
            return;
        }
        console.log(`/updateDomain/ Request from apikey ${user.apiKey}, username ${user.name}, 
            password ${user.password}, domain ${user.domain}`);
        connection.query(
        `SELECT * 
        FROM apiKeys NATURAL JOIN users 
        WHERE apiKey = '${user.apiKey}'
            AND email = '${user.name}'
            AND password = "${user.password}"`,
        function (err1, selResults, f1) {
            if (err1) {
                console.log(`SQL DELETE Failed: ${err1.message}`);
                res.status('500').send(`Internal server error ${err1.message}`);
                return;
            } else if (selResults.length === 1){ 
                console.log(`Updating apikey ${user.apiKey} with domain ${user.domain}`);
                connection.query(
                `UPDATE apiKeys SET domain = "${user.domain}" 
                WHERE apiKey = '${user.apiKey}'`,
                function (err2, r, f2) {
                    if (err2) {
                        console.log(`${err2}`)
                    } else {
                        console.log(`Update successful successful for apikey ${user.apiKey} with domain ${user.domain}`);
                        res.status(204).send('Successful Domain Update');
                        return;
                    }
                });
            } else {
                res.status(400).send("Missing or incorrect fields")
            }
        });
    });
});

// ## /updateEmail
// Admin only
// update the users login email
app.put('/quarterKings/v1/updateScore', (req, res) => {
    increment('updateScore');
    req.on("data", (data) => {
        let strdata = `${data}`;
        let score = (JSON.parse(strdata));
        if (!score.apiKey || !score.id || !score.score) {
            console.log(
                `Missing: apikey ${score.apiKey}, scoreID ${score.id}, score ${score.score}`
            );
            res.status(400).send('Request missing field');
            return;
        }
        console.log(`/updateScore/ Request from apikey ${score.apiKey}, scoreID ${score.id}, score ${score.score}`);
        connection.query(
        `SELECT * FROM scores WHERE apiKey = '${score.apiKey}' AND scoreID = ${score.id}`,
        function (err1, selResults, f1) {
            if (err1) {
                console.log(`updateScores Failed: ${err1.message}`);
                res.status('500').send(`Internal server error ${err1.message}`);
                return;
            } else if (selResults.length === 1){ 
                console.log(`Updating apikey ${score.apiKey} with score ${score.score}`);
                connection.query(
                `UPDATE scores SET score = "${score.score}" WHERE scoreID = ${score.id} AND apiKey = '${score.apiKey}'`,
                function (err2, r, f2) {
                    if (err2) {
                        console.log(`${err2}`)
                    } else {
                        console.log(`Update successful for scoreID ${score.id} with score ${score.score}`);
                        res.status(204).send('Successful Score Update');
                        return;
                    }
                });
            } else {
                res.status(400).send("Missing or incorrect fields")
            }
        });
    });
});
// Helper methods
// -----------------------------------------------------------------------

// increment endpoint stats in the database
function increment(endpoint) {
    connection.query(
    `UPDATE endPoints SET hits = hits + 1 WHERE url = '${endpoint}'`,
    (err, res, fields) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(`incrementing ${endpoint}`);
        }
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