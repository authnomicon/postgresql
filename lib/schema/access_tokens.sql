CREATE TABLE access_tokens (
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  scope TEXT[],
  token TEXT UNIQUE NOT NULL
);
