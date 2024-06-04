var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/authorizationcodeservice');
var crypto = require('crypto');


describe('oauth/authorizationcodeservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal('module:@authnomicon/oauth2.AuthorizationCodeService');
  });
  
  describe('#issue', function() {
    
    it('should issue with redirect URI', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: []
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(sts) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var msg = {
            client: { id: 's6BhdRkqt3' },
            redirectURI: 'https://client.example.com/cb',
            user: { id: '5ba552d67' }
          };
          sts.issue(msg, function(err, code) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO authorization_codes (code_hash, client_id, redirect_uri, user_id) VALUES ($1, $2, $3, $4)');
            expect(values).to.deep.equal([
              crypto.createHash('sha256').update(Buffer.from(code, 'base64')).digest('base64'),
              's6BhdRkqt3',
              'https://client.example.com/cb',
              '5ba552d67'
            ]);
            
            expect(code).to.be.a('string');
            done();
          });
        })
        .catch(done);
    });
    
  }); // #issue
  
});
