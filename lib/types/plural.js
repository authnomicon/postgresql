exports.toPlural = function(e) {
  return '(' + [ e.value, e.type, e.primary, e.verified ].join(',') + ')'
}
