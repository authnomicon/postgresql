var Directory = require('../lib/userdirectory');

// TODO: rename file to just "directory"

exports = module.exports = function(db) {
  return new Directory(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/core.Directory';
exports['@require'] = [
  //'./database'
];
