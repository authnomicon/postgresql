var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/accesstokenservice');


describe('oauth/accesstokenservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal([
      'http://i.bixbyjs.org/security/TokenService',
      'module:@authnomicon/oauth2.AccessTokenService'
    ]);
  });
  
});
