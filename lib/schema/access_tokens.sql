CREATE TABLE access_tokens (
  token_hash BYTEA PRIMARY KEY,
  token_id TEXT UNIQUE DEFAULT gen_random_uuid(),
  user_id TEXT,
  client_id TEXT,
  audience TEXT[],
  scope TEXT[],
  issued_at TIMESTAMP DEFAULT now(),
  valid_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP DEFAULT now() + interval '1 day'
);
