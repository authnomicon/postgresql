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



// https://www.postgresql.org/docs/current/protocol.html
// https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml?search=5432

exports = module.exports = function($location) {
  // TODO: get this from a connection pool of some sort
  
  //console.log('CONNECT TO POSTGRES!');
  //console.log($location);
  
  return new Promise(function(resolve, reject) {
    
    
    function createCompositeType(client, relid, oid, aoid) {
      // TODO: can slim down the columns selected here
      return client.query('SELECT * from pg_attribute WHERE attrelid = $1', [ relid ])
        .then(function(res) {
          console.log(res);
          
          types.setTypeParser(oid, require('../lib/types/email')());
          
          
          if (aoid) {
            //console.log('PARSE THE ARRAY OF EMAILS!: ' + row.typarray);
            types.setTypeParser(aoid, require('../lib/types/array')(types, oid));
          }
          
          
        });
    }
    
    
    
    
    
    var client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    client.connect(function(err) {
      if (err) {
        console.log('Failed to connect to postgres')
        console.log(err);
        return;
      }
      
      // pg-types stuff and metadata queries
      // select * from pg_namespace order by oid
      // select * from pg_class order by oid
      // https://www.postgresql.org/docs/current/catalog-pg-type.html
      // select * from pg_type order by oid
            // TODO: look at typrelid for attributes?
            //. yes: it has a "reltype" for TYPEs, which point to the composite type
            //.  reltype.   normal tables are 0
            //.  better: relkind is 'c' for composite types
            // TODO: look at pg_attribute for attributes
      // https://www.postgresql.org/docs/current/datatype-oid.html
      
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
          return self.query('SELECT to_regclass($1::text)', [ 'federated_credential' ])
            .then(function(res) {
              if (res && res.rows && res.rows[0] && res.rows[0]['to_regclass'] === null) {
                var sql = fs.readFileSync(path.join(__dirname, '../lib/schema/federated_credential.sql'), 'utf8');
                return self.query(sql);
              }
            });
        })
        .then(function(res) {
          // select all composite types
          return self.query('SELECT pg_class.oid AS relid, pg_type.oid, pg_type.typname, pg_type.typarray FROM pg_class JOIN pg_type ON pg_class.reltype = pg_type.oid WHERE pg_class.relkind = $1 ORDER BY pg_type.oid', [ 'c' ]);
        })
        .then(function(res) {
          // Fetch the attribute tables for all these rows, and insert composite types.
          return Promise.all(res.rows.map(function(row) {
            return createCompositeType(self, row.relid, row.oid, row.typarray);
          }));
        })
        .catch(function(error) {
          console.log('$$$ Failed to initialize pg schema');
          console.log(error);
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
