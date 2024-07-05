var PublicKey = require('../types/credentials/publickey');

//var FIND_CREDENTIAL_BY_PROVIDER_SUBJECT_SQL =
//'SELECT * \
//   FROM federated_credentials \
//  WHERE provider = $1 AND subject = $2';

//var INSERT_CREDENTIAL_SQL =
//    'INSERT INTO federated_credentials (provider, subject, user_id) \
//     VALUES ($1, $2, $3) \
//  RETURNING *';



function PostgreSQLPublicKeyStore(client) {
  this._client = client;
}

PostgreSQLPublicKeyStore.prototype.find = function(id, cb) {
  console.log('FIND KEY  ' + id);
  
  
  this._client.query('SELECT * FROM public_key_credentials WHERE key_id = $1', [ id ], function(err, res) {
    console.log(err);
    console.log(res);
    
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
    var key = PublicKey.fromRow(row);
    var user = {
      id: row.user_id
    };
    return cb(null, key, user);
  });
};

PostgreSQLPublicKeyStore.prototype.add = function(key, user, cb) {
  console.log('ADD KEY TO USER');
  console.log(key);
  console.log(user);
  
  
  var row = PublicKey.toRow(key, user);
  var keys = Object.keys(row)
    , cols = []
    , params = []
    , vals = []
    , i, len;
  for (i = 0, len = keys.length; i < len; ++i) {
    cols.push(keys[i]);
    params.push('$' + (i + 1));
    vals.push(row[keys[i]])
  }
  
  console.log(cols);
  console.log(vals);
  
  this._client.query('INSERT INTO public_key_credentials (' + cols.join(', ') + ') VALUES (' + params.join(', ') + ') RETURNING *', vals, function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    
    console.log(row);
    
    var obj = PublicKey.fromRow(row);
    console.log('INSERTED!');
    console.log(obj);
    return cb(null, obj);
  });
  
  
  /*
  this._client.query(INSERT_CREDENTIAL_SQL, [
    provider,
    subject.id,
    user.id
  ], function(err, res) {
    if (err) { return cb(err); }
    return cb(null);
  });
  */
};


module.exports = PostgreSQLPublicKeyStore;
