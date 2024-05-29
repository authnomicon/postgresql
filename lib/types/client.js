exports.fromClient = function(row) {
  var obj = {
    id: row.client_id
  };
  if (row.name) { obj.name = row.name; }
  if (row.redirect_urls) { obj.redirectURIs = row.redirect_urls; }
  if (row.origin_urls) { obj.originURIs = row.origin_urls; }
  
  return obj;
}
