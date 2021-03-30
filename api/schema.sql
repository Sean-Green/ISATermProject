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