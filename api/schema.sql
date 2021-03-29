CREATE TABLE users(
   userID      INT            NOT NULL AUTO_INCREMENT,
   email       VARCHAR(32)    NOT NULL, 
   password    VARCHAR(32)    NOT NULL,
   PRIMARY KEY (userID)
);

-- Create DB
CREATE TABLE apiKeys(
   userID      INT            NOT NULL,
   apiKey      CHAR(16)       NOT NULL,
   domain      VARCHAR(512)   NOT NULL,
   PRIMARY KEY (apiKey),
   CONSTRAINT fk_userID FOREIGN KEY (userID) REFERENCES users(userID)
);

CREATE TABLE scores(
   scoreDate        DATETIME       NOT NULL,  -- YYYY-MM-DD HH:MI:SS PM
   playerName  VARCHAR(32)    NOT NULL,
   apiKey      CHAR(16)       NOT NULL,
   score       FLOAT          NOT NULL,
   PRIMARY KEY (scoreDate, playerName, apiKey),
   CONSTRAINT fk_apiKey FOREIGN KEY (apiKey) REFERENCES apiKeys(apiKey)
);

INSERT INTO users(email, password)
VALUES ("johnny@scottmail.ca", "ilovescatman");

INSERT INTO apiKeys(userID, apiKey, domain)
VALUES (1, "0123456789abcdef", "http://localhost:3000/");

INSERT INTO scores(scoreDate, playerName, apiKey, score)
VALUES('1989-10-24 09:22:32 AM', 'speedJesus', "0123456789abcdef", 987654321);
 
-- http://localhost:3000/scores?api=sean