function PostgreSQLGrantService(client) {
  this._client = client;
}

PostgreSQLGrantService.prototype.create = function(client, user, cb) {
  //console.log('CREATE GRANT IN DB');
  //console.log(client);
  //console.log(user);
}

PostgreSQLGrantService.prototype.find = function(client, user, cb) {
  //console.log('FIND GRANT IN DB');
  //console.log(client)
  //console.log(user)
  
  this._client.query('SELECT * FROM grants WHERE user_id = $1 AND client_id = $2', [ user.id, client.id ], function(err, res) {
    //console.log(err);
    //console.log(res);
    
    if (err) { return cb(err); }
    var row = res.rows[0];
    if (!row) { return cb(null); }
    
  });
  
  //var self = this;
  //return cb(null, self._grant);
}

module.exports = PostgreSQLGrantService;
