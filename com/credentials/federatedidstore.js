var FederatedIDStore = require('../../lib/credentials/federatedidstore');

exports = module.exports = function($uri, postgresql) {
  var pool = postgresql.createConnectionPool($uri);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'federated_credential' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating users table in: ');
      
        var sql = fs.readFileSync(path.join(__dirname, '../../lib/schema/federated_credential.sql'), 'utf8');
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
  'module:bixby-postgresql'
];
