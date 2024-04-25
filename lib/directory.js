function PostgreSQLUserDirectory(client) {
  this._client = client;
}

PostgreSQLUserDirectory.prototype.read = function(id, cb) {
  console.log('READ');
}

PostgreSQLUserDirectory.prototype.create = function(user, cb) {
  console.log('CREATE')
}

module.exports = PostgreSQLUserDirectory;
