var composite = require('./composite');
var Parray = require('postgres-array');
var array = require('pg-array');
var types = require('pg-types');

exports.toScope = function(e) {
  return '(' + [ e.scope ? '"' + array(e.scope) + '"' : undefined, e.resource ? array(e.resource) : undefined ].join(',') + ')'
};

exports.fromScope = composite([
  { name: 'scope', oid: types.builtins.TEXT },
  { name: 'resource', oid: types.builtins.TEXT }
]);

exports.fromScopeArray = function(val) {
  return Parray.parse(val, exports.fromScope).map(function(e) {
    var o = {};
    if (e.scope) { o.scope = Parray.parse(e.scope); }
    if (e.resource) { o.resource = Parray(e.resource); }
    return o;
  });
};
