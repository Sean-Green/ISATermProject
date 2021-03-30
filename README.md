# Score Keeper API
### Term Project Internet Software Archictecture
##### by Sean Green and Johhny Scott

## Operations

### POST Operations 

## http://sean-green-cst.com/quaterKings/v1/signup 
Create new User entry and login

## /login 
Authorize login

## /generate 
Create new API Key

## /score 
Create new entry in score table

### DELETE Operations 

## /deleteAll 
Delete an api key and all scores associated with it

## /deleteScore 
delete a single entry from the score table

### PUT Operations 

## /updateDomain 
update the domain name at the given api key

## /updateEmail
update the users login email

### GET Operation

## /scores?key=
get a list of scores stored with the apikey you provide