var FederatedIDStore = require('../../lib/credentials/federatedidstore');

exports = module.exports = function(db) {
  //console.log('CONNECT TO POSTGRES!');
  
  return new FederatedIDStore(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/credentials.FederatedIDStore';
exports['@require'] = [
  '../database'
];
