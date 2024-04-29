var composite = require('postgres-composite');

exports = module.exports = function(types, attributes) {
  
  return function(val) {
    console.log('PARSE EMAIL XXX: ');
    console.log(attributes)
    
    console.log('----');
    console.log(val);
    
    var fields = Array.from(composite.parse(val));
    console.log(fields);
    console.log('----')


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
    
    console.log('OBJ IS');
    console.log(obj);




    // TODO: look these property names up in the db schema
    return {
      address: fields[0],
      type: fields[1],
      is_primary: fields[2],
      is_verified: fields[3]
    };
  };
};
