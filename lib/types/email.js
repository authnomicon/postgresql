var composite = require('postgres-composite');

exports = module.exports = function() {
  
  return function(val) {
    console.log('PARSE EMAIL XXX: ');
    console.log(val);
    
    var r = Array.from(composite.parse(val));



    // TODO: look these property names up in the db schema
    return {
      address: r[0],
      type: r[1],
      is_primary: r[2],
      is_verified: r[3]
    };
  };
};
