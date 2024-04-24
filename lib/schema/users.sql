-- postgres won't allow a singulear "user" table, so violating that convention here
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  hashed_password TEXT,
  family_name TEXT,
  given_name TEXT,
  middle_name TEXT,
  honorific_prefix TEXT,
  honorific_suffix TEXT
);
