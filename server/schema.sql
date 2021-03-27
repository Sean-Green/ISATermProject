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
   gameID      INT            NOT NULL,
   playerID    INT            NOT NULL,
   score       INT            NOT NULL,
   date        DATETIME       NOT NULL,
   PRIMARY KEY (gameID, playerID),
   CONSTRAINT fk_gameID FOREIGN KEY (gameID) REFERENCES games(gameID),
   CONSTRAINT fk_playerID FOREIGN KEY (playerID) REFERENCES players(playerID)
);

INSERT INTO games(gameID, gameName)
VALUES(123, "FLAPPY BIRD");

INSERT INTO players(playerID, playerName) 
VALUES(1337, "BROSNAN");

INSERT INTO scores(gameID, playerID, score, date)
VALUES(123, 1337, 987654321, date);

-- GET player with the highest score in a given game



-- GET all names and scores for a given game in descending order of score
   


