CREATE TABLE access_tokens (
  token_hash BYTEA PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  scope TEXT[]
);
