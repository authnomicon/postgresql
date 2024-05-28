var composite = require('./composite');
var array = require('postgres-array');
var types = require('pg-types');

exports.toAddress = function(e) {
  return '(' + [ e.streetAddress, e.locality, e.region, e.postalCode, e.country, e.type, e.primary, e.verified ].join(',') + ')'
};

exports.fromAddress = composite([
  { name: 'street_address', oid: types.builtins.TEXT },
  { name: 'locality', oid: types.builtins.TEXT },
  { name: 'region', oid: types.builtins.TEXT },
  { name: 'postal_code', oid: types.builtins.TEXT },
  { name: 'country', oid: types.builtins.TEXT },
  { name: 'type', oid: types.builtins.TEXT },
  { name: 'is_primary', oid: types.builtins.BOOL },
  { name: 'is_verified', oid: types.builtins.BOOL }
]);

exports.fromAddressArray = function(val) {
  return array.parse(val, exports.fromAddress).map(function(e) {
    var o = {};
    if (e.street_address) { o.streetAddress = e.street_address; }
    if (e.locality) { o.locality = e.locality; }
    if (e.region) { o.region = e.region; }
    if (e.postal_code) { o.postalCode = e.postal_code; }
    if (e.country) { o.country = e.country; }
    if (e.type) { o.type = e.type; }
    if (e.is_primary !== undefined) { o.primary = e.is_primary; }
    if (e.is_verified !== undefined) { o.verified = e.is_verified; }
    return o;
  });
};
