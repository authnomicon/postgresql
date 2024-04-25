function PostgreSQLUserDirectory(client) {
  this._client = client;
}

/*
var READ_SQL = 
'SELECT \
  user_.*, \
  user_email.value AS email, \
  user_email.type AS email_type, \
  user_email.is_verified AS email_verified, \
  user_phone_number.value AS phone_number \
FROM user_ \
  LEFT JOIN user_email ON user_.user_id = user_email.user_id \
  LEFT JOIN user_phone_number ON user_.user_id = user_phone_number.user_id \
WHERE user_.user_id = $1';
*/

var READ_SQL = 
'SELECT \
  users.* \
FROM users \
WHERE users.user_id = $1';

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  console.log('READ');
  console.log(id);
  
  this._client.query(READ_SQL, [
      id
    ], function(err, res) {
      console.log(err);
      console.log(res);
      
      if (err) { return cb(err); }
      var row = res.rows[0];
      if (!row) { return cb(null); }
      
      var obj = {
        id: id,
        username: row.username,
        name: {
          familyName: row.family_name,
          givenName: row.given_name,
          middleName: row.middle_name,
          honorificPrefix: row.honorific_prefix,
          honorificSuffix: row.honorific_suffix
        }
      };
      
      console.log(obj);
      
      return cb(null, obj);
    });
}

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  console.log('CREATE')
}

module.exports = PostgreSQLUserDirectory;
