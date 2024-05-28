exports.toAddress = function(e) {
  return '(' + [ e.streetAddress, e.locality, e.region, e.postalCode, e.country, e.type, e.primary, e.verified ].join(',') + ')'
}
