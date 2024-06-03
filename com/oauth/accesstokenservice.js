var AccessTokenService = require('../../lib/oauth/accesstokenservice');
var fs = require('fs');
var path = require('path');

exports = module.exports = function($uri, postgresql) {
  //console.log('CONNECT TO POSTGRES!');
  var pool = postgresql.createConnectionPool($uri);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'access_tokens' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating access tokens table in: ');
    
        var sql = fs.readFileSync(path.join(__dirname, '../../lib/schema/access_tokens.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new AccessTokenService(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.bixbyjs.org/security/TokenService', // for bearer scheme
  'module:@authnomicon/oauth2.AccessTokenService'
];
exports['@service'] = 'aptokens-postgresql';
exports['@port'] = 5432;
exports['@env'] = [ 'DATABASE_URL' ];
exports['@require'] = [
  '$uri',
  'module:bixby-postgresql'
];
