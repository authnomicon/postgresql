var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/authorizationcodeservice');


describe('oauth/authorizationcodeservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal('module:@authnomicon/oauth2.AuthorizationCodeService');
  });
  
});
