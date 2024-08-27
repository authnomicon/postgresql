var ClientSecretStore = require('../../../lib/oauth/credentials/clientsecretstore');
var fs = require('fs');
var path = require('path');

exports = module.exports = function(aaaDbUrl, dbUrl, postgresql) {
  //console.log('CONNECT TO POSTGRES!');
  var pool = postgresql.createConnectionPool(aaaDbUrl || dbUrl);
  
  return pool.query('SELECT to_regclass($1::text)', [ 'clients' ])
    .then(function(res) {
      if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
        // TODO: log this with logger
        console.log('creating users table in: ');
  
        var sql = fs.readFileSync(path.join(__dirname, '../../../lib/schema/clients.sql'), 'utf8');
        return pool.query(sql);
      }
    })
    .then(function() {
      return new ClientSecretStore(pool);
    });
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.authnomicon.org/oauth2/ClientSecretService';
exports['@require'] = [
  '$uri[authnomiconaaa-postgresql]?',
  '$uri[postgresql]?',
  'module:bixby-postgresql'
];
