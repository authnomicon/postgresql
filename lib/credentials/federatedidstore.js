var FIND_BY_PROVIDER_SUBJECT_SQL =
'SELECT * \
   FROM federated_credential \
  WHERE provider = $1 AND subject = $2';

var INSERT_CREDENTIAL_SQL =
    'INSERT INTO federated_credential (provider, subject, user_id) \
     VALUES ($1, $2, $3) \
  RETURNING *';



function PostgreSQLFederatedIDStore(client) {
  this._client = client;
}

PostgreSQLFederatedIDStore.prototype.find = function(subject, provider, cb) {
  this._client.query(FIND_BY_PROVIDER_SUBJECT_SQL, [ provider, subject.id ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null, undefined); }
    
    var user = {
      id: row.user_id
    }
    return cb(null, user);
  });
};

PostgreSQLFederatedIDStore.prototype.add = function(subject, provider, user, cb) {
  this._client.query(INSERT_CREDENTIAL_SQL, [
    provider,
    subject.id,
    user.id
  ], function(err, res) {
    if (err) { return cb(err); }
    return cb(null);
  });
};


module.exports = PostgreSQLFederatedIDStore;
