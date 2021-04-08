CREATE TABLE users(
   email       VARCHAR(32)    NOT NULL, 
   password    VARCHAR(32)    NOT NULL,
   PRIMARY KEY (email)
);

CREATE TABLE apiKeys(
   email       VARCHAR(32)    NOT NULL, 
   apiKey      CHAR(16)       NOT NULL,
   domain      VARCHAR(512)   NOT NULL,
   PRIMARY KEY (apiKey),
   CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE scores(
   scoreID     INT            NOT NULL AUTO_INCREMENT,
   scoreDate   DATETIME       NOT NULL,  -- YYYY-MM-DD HH:MI:SS PM
   playerName  VARCHAR(32)    NOT NULL,
   apiKey      CHAR(16)       NOT NULL,
   score       FLOAT          NOT NULL,
   PRIMARY KEY (scoreID),
   CONSTRAINT fk_apiKey FOREIGN KEY (apiKey) REFERENCES apiKeys(apiKey)
);

INSERT INTO users(email, password)
VALUES ("johnny@scottmail.ca", "ilovescatman");

INSERT INTO apiKeys(email, apiKey, domain)
VALUES ("johnny@scottmail.ca", "0123456789abcdef", "localhost");

INSERT INTO scores(scoreDate, playerName, apiKey, score)
VALUES('1989-10-24 09:22:32 AM', 'speedJesus', "0123456789abcdef", 987654321);

CREATE TABLE endPoints(
   url         VARCHAR(16)    NOT NULL,
   hits        INT            NOT NULL,
   PRIMARY KEY (url)
)

INSERT INTO endPoints(url, hits) VALUES('stats', 0)
INSERT INTO endPoints(url, hits) VALUES('getScores', 0)
INSERT INTO endPoints(url, hits) VALUES('signup', 0)
INSERT INTO endPoints(url, hits) VALUES('login', 0)
INSERT INTO endPoints(url, hits) VALUES('generate', 0)
INSERT INTO endPoints(url, hits) VALUES('getKeys', 0)

-- UPDATE endPoints SET hits = hits + 1 WHERE url = 'scores'

INSERT INTO apiKeys(email, apiKey, domain)
VALUES ((SELECT email 
         FROM users 
         WHERE email = 'johnny@scottmail.ca' 
            AND password = "ilovescatman"), "0987654123abcdef", "localhost");