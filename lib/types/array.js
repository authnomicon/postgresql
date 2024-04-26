var array = require('postgres-array');


exports = module.exports = function(types, oid) {
  
  return function(val) {
    console.log('PARSE ARRAY OF: ');
    console.log(val);
    console.log(types);
    console.log(oid);
    
    // NOTE: theres an arrayParser.create object on `types`.  Can that be leverged here?
    
    var parse = types.getTypeParser(oid);
    
    return array.parse(val, parse);
    
    
    //types.
    
    
    return val;
  };
};
