CREATE TABLE public_key_credentials (
  key_id TEXT PRIMARY KEY,
  public_key TEXT NOT NULL,
  sign_count INTEGER,
  transports TEXT[],
  backup_eligible BOOLEAN,
  backed_up BOOLEAN,
  user_id TEXT NOT NULL REFERENCES users(user_id)
);
