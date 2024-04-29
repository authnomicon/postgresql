var composite = require('postgres-composite');

exports = module.exports = function(attributes, types) {
  
  return function(val) {
    var fields = Array.from(composite.parse(val));
    var obj = {};
    
    var i, len, val, attr, parse;
    for (i = 0, len = fields.length; i < len; ++i) {
      val = fields[i];
      if (val) {
        attr = attributes[i];
        parse = types.getTypeParser(attr.atttypid);
        obj[attr.attname] = parse(val);
      }
    }
    return obj;
  };
};
