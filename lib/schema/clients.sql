CREATE TABLE clients (
  client_id TEXT PRIMARY KEY,
  hashed_secret TEXT,
  name TEXT,
  redirect_urls TEXT[],
  token_endpoint_auth_method TEXT,
  grant_types TEXT[],
  response_types TEXT[],
  uri TEXT,
  logo_uri TEXT,
  scope TEXT[],
  contacts TEXT[],
  terms_of_service_url TEXT,
  privacy_policy_url TEXT,
  json_web_key_set_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- TODO: add a "keys" table where JWKS can be related to the client
-- TODO: software_id
-- TODO: software_version
-- TODO: client_secret_expires_at

