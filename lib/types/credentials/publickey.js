exports.fromRow = function(row) {
  var obj = {
    id: row.key_id
  };
  obj.publicKey = row.public_key;
  obj.signCount = row.sign_count;
  obj.transports = row.transports;
  obj.backupEligible = row.backup_eligible;
  obj.backedUp = row.backed_up;
  
  return obj;
}

exports.toRow = function(obj, user) {
  var row = {};
  row.key_id = obj.id;
  row.public_key = obj.publicKey;
  row.sign_count = obj.signCount;
  row.transports = obj.transports;
  row.backup_eligible = obj.backupEligible;
  row.backed_up = obj.backedUp;
  row.user_id = user.id;
  
  return row;
}
