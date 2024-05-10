CREATE TABLE clients (
  client_id TEXT PRIMARY KEY,
  hashed_secret TEXT,
  name TEXT,
  redirect_uris TEXT[]
);
