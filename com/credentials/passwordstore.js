var PasswordStore = require('../../lib/credentials/passwordstore');
var fs = require('fs');
var path = require('path');

exports = module.exports = function(userDbUrl, dbUrl, postgresql) {
  var pool = postgresql.createConnectionPool(userDbUrl || dbUrl);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'users' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating users table in: ');
      
        var sql = fs.readFileSync(path.join(__dirname, '../../lib/schema/users.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new PasswordStore(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/credentials.PasswordStore';
exports['@require'] = [
  '$uri[apuser-postgresql]?',
  '$uri[postgresql]?',
  'module:bixby-postgresql'
];
