var FederatedIDStore = require('../../lib/credentials/federatedidstore');
var fs = require('fs');
var path = require('path');

exports = module.exports = function($uri, postgresql, _users) {
  // NOTE: the `_users` variable is a directory instance.  The variable is not
  // used by this component, but it is required because instantiating it has the
  // side effect of creating the `users` table, which the
  // `federated_credentials` table has a relation to.  If it were not required,
  // creating the `federated_credentials` table would fail.
  
  var pool = postgresql.createConnectionPool($uri);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'federated_credentials' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating federated credentials table in: ');
      
        var sql = fs.readFileSync(path.join(__dirname, '../../lib/schema/federated_credentials.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new FederatedIDStore(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/credentials.FederatedIDStore';
exports['@service'] = 'apcred-postgresql';
exports['@port'] = 5432;
exports['@env'] = [ 'DATABASE_URL' ];
exports['@require'] = [
  '$uri',
  'module:bixby-postgresql',
  '../directory'
];
