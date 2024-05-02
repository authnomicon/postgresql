CREATE TABLE scope (
  scope TEXT[],
  resource TEXT[]
);

-- NOTE: user_id doesn't reference users, in case it is stored in diffeerent database
--   same with client
-- TODO: put an index on client_id,user_id
-- NOTE: grant is a reserved word, so naming it grant
CREATE TABLE grants (
  grant_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  scopes scope[],
  claims TEXT[]
);
