CREATE TABLE users(
   userID      INT            NOT NULL AUTO_INCREMENT,
   email       VARCHAR(32)    NOT NULL, 
   password    VARCHAR(32)    NOT NULL,
   PRIMARY KEY (userID)
)

-- Create DB
CREATE TABLE apiKeys(
   userID      INT            NOT NULL,
   apiKey      CHAR(16)       NOT NULL,
   domain      VARCHAR(512)   NOT NULL,
   PRIMARY KEY (apiKey),
   CONSTRAINT fk_userID FOREIGN KEY (userID) REFERENCES users(userID)
)

CREATE TABLE players(
   playerID    INT            NOT NULL AUTO_INCREMENT,
   playerName  VARCHAR(32)    NOT NULL,
   PRIMARY KEY (playerID)
); 

CREATE TABLE scores(
   date        DATETIME       NOT NULL,  -- YYYY-MM-DD HH:MI:SS
   playerID    INT            NOT NULL,
   apiKey      INT            NOT NULL,
   score       FLOAT          NOT NULL,
   PRIMARY KEY (date, playerID),
   CONSTRAINT fk_apiKey FOREIGN KEY (apiKey) REFERENCES games(gameID),
   CONSTRAINT fk_playerID FOREIGN KEY (playerID) REFERENCES players(playerID)
);

INSERT INTO users(email, password)
VALUES ("johnny@scottmail.ca", "ilovescatman");

INSERT INTO apiKeys(userID, apiKey, domain)
VALUES (1, "0123456789abcdef", "https://www.sean-green-cst.com/");

INSERT INTO player(playerName)
VALUES ("speed jesus");

INSERT INTO scores(date, playerID, apiKey, score)
VALUES('19891024 09:22:32 AM', 1, "0123456789abcdef", 987654321);
 
-- INSERT INTO players(playerID, playerName) 
-- VALUES(666, "DEVILMAN");


-- INSERT INTO scores(gameID, playerID, score, date)
-- VALUES(123, 666, 83746527, '19991024 10:22:32 AM');

-- -- GET player with the highest score in a given game
-- SELECT playerName, MAX(score) AS score
-- FROM players NATURAL JOIN scores

-- -- GET all names and scores for a given game in descending order of score
-- SELECT playerName, score, date
-- FROM players NATURAL JOIN scores
-- WHERE gameID = 123
-- ORDER BY score DESC;

-- -- GET all player names
-- SELECT playerName 
-- FROM players
-- ORDER BY playerName DESC;