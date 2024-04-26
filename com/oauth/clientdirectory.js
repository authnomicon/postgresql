var ClientDirectory = require('../../lib/oauth/clientdirectory');

exports = module.exports = function(db) {
  //console.log('CONNECT TO POSTGRES!');
  
  return new ClientDirectory(db);
};

exports['@singleton'] = true;
exports['@implements'] = [
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'http://i.authnomicon.org/openidconnect/ClientDirectory'
];
exports['@require'] = [
  '../database'
];
