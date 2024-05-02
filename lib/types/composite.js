var composite = require('postgres-composite');
var types = require('pg-types');

exports = module.exports = function(attributes) {
  
  return function(val) {
    var fields = Array.from(composite.parse(val));
    console.log(fields);
    
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
    
    return fields;
    
    
    /*
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
    */
  };
};
