CREATE TABLE access_tokens (
  token_hash BYTEA PRIMARY KEY,
  token_id TEXT UNIQUE DEFAULT gen_random_uuid(),
  user_id TEXT,
  client_id TEXT,
  audience TEXT[],
  scope TEXT[],
  use_count INTEGER,
  max_use INTEGER,
  issued_at TIMESTAMP DEFAULT now(),
  valid_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP DEFAULT now() + interval '1 day'
);

-- https://datatracker.ietf.org/doc/html/rfc9068
-- TODO: auth_time
-- TODO: acr
-- TODO: amr

-- https://datatracker.ietf.org/doc/html/rfc7662
