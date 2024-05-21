var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/clientdirectory');


describe('oauth/clientdirectory', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal([
      'http://i.authnomicon.org/oauth2/ClientDirectory',
      'http://i.authnomicon.org/openidconnect/ClientDirectory'
    ]);
  });
  
  describe('#read', function() {
    
    it('should map name and redirect URIs', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            client_id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirect_uris: [
              'https://client.example.org/callback',
              'https://client.example.org/callback2'
            ]
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('s6BhdRkqt3', function(err, oclient) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT * FROM clients WHERE client_id = $1');
            expect(values).to.deep.equal([ 's6BhdRkqt3' ]);
        
            expect(oclient).to.deep.equal({
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              redirectURIs: [
                'https://client.example.org/callback',
                'https://client.example.org/callback2'
              ]
            });
            done();
          });
        })
        .catch(done);
    }); // should map name and redirect URIs
    
  }); // #read
  
});
