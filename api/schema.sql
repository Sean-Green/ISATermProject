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
   date        DATETIME       NOT NULL,  -- YYYY-MM-DD HH:MI:SS PM
   playerID    INT            NOT NULL,
   apiKey      CHAR(16)       NOT NULL,
   score       FLOAT          NOT NULL,
   PRIMARY KEY (date, playerID),
   CONSTRAINT fk_apiKey FOREIGN KEY (apiKey) REFERENCES apiKeys(apiKey),
   CONSTRAINT fk_playerID FOREIGN KEY (playerID) REFERENCES players(playerID)
);

INSERT INTO users(email, password)
VALUES ("johnny@scottmail.ca", "ilovescatman");

INSERT INTO apiKeys(userID, apiKey, domain)
VALUES (1, "0123456789abcdef", "https://www.sean-green-cst.com/");

INSERT INTO players(playerName)
VALUES ("speed jesus");

INSERT INTO scores(date, playerID, apiKey, score)
VALUES('19891024 09:22:32 AM', 1, "0123456789abcdef", 987654321);
 
