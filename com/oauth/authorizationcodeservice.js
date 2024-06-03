var AuthorizationCodeService = require('../../lib/oauth/authorizationcodeservice');
var fs = require('fs');
var path = require('path');

exports = module.exports = function($uri, postgresql) {
  //console.log('CONNECT TO POSTGRES!');
  var pool = postgresql.createConnectionPool($uri);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'authorization_codes' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating authorization codes table in: ');
    
        var sql = fs.readFileSync(path.join(__dirname, '../../lib/schema/authorization_codes.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new AuthorizationCodeService(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/oauth2.AuthorizationCodeService';
exports['@service'] = 'apazcodes-postgresql';
exports['@port'] = 5432;
exports['@env'] = [ 'DATABASE_URL' ];
exports['@require'] = [
  '$uri',
  'module:bixby-postgresql'
];
