var array = require('postgres-array');


exports = module.exports = function(val) {
  return array.parse(val);
  
  
  
  /*
  return function(val) {
    // NOTE: theres an arrayParser.create object on `types`.  Can that be leverged here?
    
    var parse = types.getTypeParser(oid);
    return array.parse(val, parse);
  };
  */
};
