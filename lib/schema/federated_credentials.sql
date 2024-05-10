CREATE TABLE federated_credentials (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(user_id),
  PRIMARY KEY (provider, subject)
);
