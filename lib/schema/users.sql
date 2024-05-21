CREATE TYPE plural AS (
  value TEXT,
  type TEXT,
  is_primary BOOLEAN,
  is_verified BOOLEAN
);

CREATE TYPE address AS (
  street_address TEXT,
  locality TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT,
  type TEXT,
  is_primary BOOLEAN,
  is_verified BOOLEAN
);

-- postgres won't allow a singulear "user" table, so violating that convention here
-- TODO: create a trigger to update updated_at
-- TODO: zoneinfo/utcoffset and locale
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  username TEXT UNIQUE,
  hashed_password TEXT,
  family_name TEXT,
  given_name TEXT,
  middle_name TEXT,
  honorific_prefix TEXT,
  honorific_suffix TEXT,
  nickname TEXT,
  photos plural[],
  urls plural[],
  emails plural[],
  phone_numbers plural[],
  gender TEXT,
  birthday DATE,
  addresses address[],
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
