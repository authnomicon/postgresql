var Directory = require('../lib/directory');
var fs = require('fs');
var path = require('path');

exports = module.exports = function($uri, postgresql) {
  var pool = postgresql.createConnectionPool($uri);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'users' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating users table in: ');
    
        var sql = fs.readFileSync(path.join(__dirname, '../lib/schema/users.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new Directory(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/core.Directory';
exports['@service'] = 'apuser-postgresql';
exports['@port'] = 5432;
exports['@env'] = [ 'DATABASE_URL' ];
exports['@require'] = [
  '$uri',
  'module:bixby-postgresql'
];
