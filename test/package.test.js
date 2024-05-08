/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/sqlite', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/postgresql');
      expect(json.assembly.components).to.deep.equal([
        'directory',
        'credentials/federatedidstore',
        'credentials/passwordstore',
        'oauth/clientdirectory',
        'oauth/grantservice',
        'oauth/credentials/clientsecretstore'
      ]);
    });
  });
  
});
