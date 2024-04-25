var pg = require('pg');
var fs = require('fs');
var path = require('path');
var array = require('postgres-array');
var composite = require('postgres-composite');

// https://www.npmjs.com/package/pg-array
// https://www.npmjs.com/package/postgres-array

// https://github.com/brianc/node-pg-types
// TODO: look these up dynamically
var types = require('pg').types
types.setTypeParser(16434, function(val) {
  console.log('!!! PARSE COMPOSITE TYPE !!!');
  console.log(val);
  
  
  var parsed =  array.parse(val, function(v) {
    console.log(v);
    
    var x = Array.from(composite.parse(v));
    console.log(x);
    
    return x;
    
    //return v;
  });
  console.log(parsed);
  
  
  return parsed;
  
  //return val;
  
  //return parseInt(val, 10)
})



// https://www.postgresql.org/docs/current/protocol.html
// https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=5432

exports = module.exports = function($location) {
  // TODO: get this from a connection pool of some sort
  
  //console.log('CONNECT TO POSTGRES!');
  //console.log($location);
  
  return new Promise(function(resolve, reject) {
    
    var client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    client.connect(function(err) {
      if (err) {
        console.log('Failed to connect to postgres')
        console.log(err);
        return;
      }
      
      //console.log('connected to postgres');
      
      // Inspired by connect-pg-simple to create db
      
      
      var self = this;
      
      this.query('SELECT to_regclass($1::text)', [ 'users' ])
        .then(function(res) {
          //console.log(res);
          
          if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
            console.log('NEED TO CREATE USERS TABLE');
            
            var sql = fs.readFileSync(path.join(__dirname, '../lib/schema/users.sql'), 'utf8');
            return self.query(sql);
          }
          
          
          
        })
        .then(function(res) {
          console.log(res)
          //console.log('create next table...');
          
          if (res) {
            //console.log(res);
          }
          
          
          
        })
        .catch(function(error) {
          console.log('$$$ Failed to initialize pg schema');
          console.log(err);
        });
    })
    
    
    return resolve(client);
  });
  
  
  
  
};

exports['@singleton'] = true;
//exports['@service'] = 'postgresql';
//exports['@port'] = 5432;
//exports['@require'] = [
//  '$location'
//];
