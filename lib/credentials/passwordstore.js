var uuid = require('uuidv7').uuidv7;
var pbkdf2 = require('@phc/pbkdf2');

var FIND_BY_USERNAME_SQL =
'SELECT users.* \
   FROM users \
  WHERE username = $1';

// TODO: add more columns
var INSERT_USER_SQL =
  'INSERT INTO users (user_id, username, hashed_password) \
   VALUES ($1, $2, $3) \
RETURNING *';



function PostgreSQLPasswordStore(client) {
  this._client = client;
}

PostgreSQLPasswordStore.prototype.create = function(user, password, cb) {
  console.log('create user in postgres');
  console.log(user);
  console.log(password);
  
  var self = this;
  
  pbkdf2.hash(password, { digest: 'sha256', iterations: 310000 })
    .then(function(hashedPassword) {
      self._client.query(INSERT_USER_SQL, [
          uuid(),
          user.username,
          hashedPassword
        ], function(err, res) {
          console.log(err);
          console.log(res);
          
          if (err) { return cb(err); }
          var row = res.rows[0];
          var obj = {
            id: row.user_id,
            username: row.username
          };
          return cb(null, obj);
        });
    }, function(error) {
      return cb(error);
    });
};

PostgreSQLPasswordStore.prototype.verify = function(username, password, cb) {
  this._client.query(FIND_BY_USERNAME_SQL, [ username ], function(err, res) {
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    
    console.log(row);
    
    pbkdf2.verify(row.hashed_password, password)
      .then(function(match) {
        if (!match) { return cb(null, false, { message: 'Incorrect username or password.' }); }
      
        // TODO: add more attributes
        var obj = {
          id: row.user_id,
          username: row.username
        };
        return cb(null, obj);
      }, function(error) {
        return cb(error);
      });
  });
};

module.exports = PostgreSQLPasswordStore;
