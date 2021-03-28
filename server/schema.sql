-- Create DB

CREATE TABLE games(
   gameID      INT            NOT NULL, 
   gameName    VARCHAR(256)   NOT NULL, 
   PRIMARY KEY (gameID)
);

CREATE TABLE players(
   playerID    INT            NOT NULL,
   playerName  VARCHAR(20)    NOT NULL,
   PRIMARY KEY (playerID)
); 

CREATE TABLE scores(
   date        DATETIME       NOT NULL,
   playerID    INT            NOT NULL,
   gameID      INT            NOT NULL,
   score       INT            NOT NULL, -- YYYY-MM-DD HH:MI:SS
   PRIMARY KEY (date, playerID),
   CONSTRAINT fk_gameID FOREIGN KEY (gameID) REFERENCES games(gameID),
   CONSTRAINT fk_playerID FOREIGN KEY (playerID) REFERENCES players(playerID)
);

INSERT INTO games(gameID, gameName)
VALUES(123, "FLAPPY BIRD");

INSERT INTO players(playerID, playerName) 
VALUES(1337, "BROSNAN");

INSERT INTO players(playerID, playerName) 
VALUES(666, "DEVILMAN");

INSERT INTO scores(gameID, playerID, score, date)
VALUES(123, 1337, 987654321, '19891024 09:22:32 AM');

INSERT INTO scores(gameID, playerID, score, date)
VALUES(123, 666, 83746527, '19991024 10:22:32 AM');

-- GET player with the highest score in a given game
SELECT playerName, MAX(score) AS score
FROM players NATURAL JOIN scores

-- GET all names and scores for a given game in descending order of score
SELECT playerName, score, date
FROM players NATURAL JOIN scores
WHERE gameID = 123
ORDER BY score DESC;

-- GET all player names
SELECT playerName 
FROM players
ORDER BY playerName DESC;