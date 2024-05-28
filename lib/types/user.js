var address = require('./address');
var plural = require('./plural');

exports.fromUser = function(row) {
  var obj = {
    id: row.user_id,
  };
  if (row.username) { obj.username = row.username; }
  if (row.family_name) { (obj.name = obj.name || {}).familyName = row.family_name; }
  if (row.given_name) { (obj.name = obj.name || {}).givenName = row.given_name; }
  if (row.middle_name) { (obj.name = obj.name || {}).middleName = row.middle_name; }
  if (row.honorific_prefix) { (obj.name = obj.name || {}).honorificPrefix = row.honorific_prefix; }
  if (row.honorific_suffix) { (obj.name = obj.name || {}).honorificSuffix = row.honorific_suffix; }
  if (row.nickname) { obj.nickname = row.nickname; }
  if (row.photos) {
    obj.photos = plural.fromPluralArray(row.photos);
  }
  if (row.urls) {
    obj.urls = plural.fromPluralArray(row.urls);
  }
  if (row.emails) {
    obj.emails = plural.fromPluralArray(row.emails);
  }
  if (row.phone_numbers) {
    obj.phoneNumbers = plural.fromPluralArray(row.phone_numbers);
  }
  if (row.gender) { obj.gender = row.gender; }
  // TODO: birthday
  if (row.addresses) {
    obj.addresses = address.fromAddressArray(row.addresses);
  }
  // TODO: utcOffset
  // TODO: published
  // TODO: updated
  
  return obj;
};
