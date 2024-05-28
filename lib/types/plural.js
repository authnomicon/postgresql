var composite = require('./composite');
var array = require('postgres-array');
var types = require('pg-types');

exports.toPlural = function(e) {
  return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
};

exports.fromPlural = composite([
  { name: 'value', oid: types.builtins.TEXT },
  { name: 'type', oid: types.builtins.TEXT },
  { name: 'is_primary', oid: types.builtins.BOOL },
  { name: 'is_verified', oid: types.builtins.BOOL }
]);

exports.fromPluralArray = function(val) {
  return array.parse(val, exports.fromPlural).map(function(e) {
    var o = {};
    if (e.value) { o.value = e.value; }
    if (e.type) { o.type = e.type; }
    if (e.is_primary !== undefined) { o.primary = e.is_primary; }
    if (e.is_verified !== undefined) { o.verified = e.is_verified; }
    return o;
  });
};
