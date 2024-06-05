CREATE TABLE authorization_codes (
  code_hash BYTEA PRIMARY KEY,
  issuer TEXT NOT NULL,
  client_id TEXT NOT NULL,
  redirect_uri TEXT,
  user_id TEXT NOT NULL,
  scope TEXT[],
  session_id TEXT,
  issued_at TIMESTAMP NOT NULL DEFAULT now(),
  expires_at TIMESTAMP NOT NULL DEFAULT now() + interval '10 minutes'
);
