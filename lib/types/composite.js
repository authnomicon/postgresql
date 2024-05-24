var composite = require('postgres-composite');
var types = require('pg-types');

exports = module.exports = function(attributes) {
  
  return function(val) {
    var fields = Array.from(composite.parse(val));
    var obj = {};
    var i, len, v, attr;
    for (i = 0, len = fields.length; i < len; ++i) {
      v = fields[i];
      if (v) {
        attr = attributes[i];
        obj[attr.name] = types.getTypeParser(attr.oid)(v);
      }
    }
    return obj;
  };
};
