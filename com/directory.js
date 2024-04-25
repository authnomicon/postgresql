var Directory = require('../lib/directory');

exports = module.exports = function(db) {
  return new Directory(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/core.Directory';
exports['@require'] = [
  './database'
];
