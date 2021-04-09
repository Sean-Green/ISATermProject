# Score Keeper API
### Term Project Internet Software Archictecture
##### by Sean Green and Johhny Scott

## Operations

### POST Operations -----------------------------------------------------------------------------

## http://sean-green-cst.com/quaterKings/v1/signup 
Create new User entry and login
For Admin Only
takes a name and password in the body and returns 201 if success

## /login 
Authorize login
For Admin only
Takes a name and password and returns 200 on success, 400 on failure

## /generate 
Create new API Key

## /getKeys
Return all API keys for the user in question

## /score 
Create new entry in score table

### DELETE Operations ------------------------------------------------------------------------

## /deleteAll 
Delete an api key and all scores associated with it

## /deleteScore 
delete a single entry from the score table

### PUT Operations ---------------------------------------------------------------------------

## /updateDomain 
update the domain name at the given api key

## /updateEmail
update the users login email

### GET Operation -----------------------------------------------------------------------------

## /scores?api=
get a list of scores stored with the apikey you provide