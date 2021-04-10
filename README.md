# Score Keeper API
### Term Project Internet Software Archictecture
##### by Sean Green and Johhny Scott

## Operations

### POST Operations -----------------------------------------------------------------------------
## http://sean-green-cst.com/quaterKings/v1/signup 
Create new User entry and login

## http://sean-green-cst.com/quarterKings/v1/login 
Authorize login

## http://sean-green-cst.com/quarterKings/v1/generate
Create new API Key

## http://sean-green-cst.com/quarterKings/v1/getKeys
Return all API keys for the user in question

## http://sean-green-cst.com/quarterKings/v1/stats
Get stats for all endpoints

## http://sean-green-cst.com/quarterKings/v1/score
Create new entry in score table

### DELETE Operations ------------------------------------------------------------------------
## http://sean-green-cst.com/quarterKings/v1/deleteAll
Delete all scores associated with a given apikey

## http://sean-green-cst.com/quarterKings/v1/deleteScore
delete a single entry from the score table

## http://sean-green-cst.com/quarterKings/v1/deleteApiKey
deletes an apikey entry

### PUT Operations ---------------------------------------------------------------------------
## http://sean-green-cst.com/quarterKings/v1/updateDomain 
update the domain name at the given api key

## http://sean-green-cst.com/quarterKings/v1/updateScore
update the score of a single entry by ID and apikey

### GET Operation -----------------------------------------------------------------------------
## http://sean-green-cst.com/quarterKings/v1/getScores?api=
get a list of scores stored with the apikey you provide