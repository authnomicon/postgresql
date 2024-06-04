var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/accesstokenservice');
var crypto = require('crypto');


describe('oauth/accesstokenservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal([
      'http://i.bixbyjs.org/security/TokenService',
      'module:@authnomicon/oauth2.AccessTokenService'
    ]);
  });
  
  describe('#issue', function() {
    
    it('should insert user ID and client ID', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 1,
        rows: []
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(sts) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var msg = {
            client: { id: 's6BhdRkqt3' },
            user: { id: '5ba552d67' }
          };
          sts.issue(msg, function(err, token) {
            if (err) { return done(err); }
            
            expect(token).to.be.a('string');
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO access_tokens (token_hash, user_id, client_id) VALUES ($1, $2, $3)');
            expect(values).to.deep.equal([
              crypto.createHash('sha256').update(Buffer.from(token, 'base64')).digest('base64'),
              '5ba552d67',
              's6BhdRkqt3'
            ]);
            done();
          });
        })
        .catch(done);
    }); // should insert user ID and client ID
    
  }); // #issue
  
});
