var ClientSecretStore = require('../../../lib/oauth/credentials/clientsecretstore');

exports = module.exports = function(db) {
  //console.log('CONNECT TO POSTGRES!');
  
  return new ClientSecretStore(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.authnomicon.org/oauth2/ClientSecretService';
exports['@require'] = [
  '../../database'
];
