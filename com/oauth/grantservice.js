var GrantService = require('../../lib/oauth/grantservice');

exports = module.exports = function(db) {
  //console.log('CONNECT TO POSTGRES!');
  
  return new GrantService(db);
};

exports['@singleton'] = true;
exports['@implements'] = [
  'module:@authnomicon/oauth2.GrantService'
];
exports['@require'] = [
  '../database'
];
