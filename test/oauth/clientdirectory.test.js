var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/clientdirectory');


describe('oauth/clientdirectory', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.equal('module:@authnomicon/oauth2.ClientDirectory');
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
            redirect_urls: [
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
            expect(sql).to.equal('SELECT *    FROM clients   WHERE client_id = $1');
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
    
    it('should map name and origin URIs', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            client_id: 's6BhdRkqt3',
            name: 'My Example Client',
            origin_urls: [
              'https://client.example.org',
              'https://client.example.dev'
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
            expect(sql).to.equal('SELECT *    FROM clients   WHERE client_id = $1');
            expect(values).to.deep.equal([ 's6BhdRkqt3' ]);
        
            expect(oclient).to.deep.equal({
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              originURIs: [
                'https://client.example.org',
                'https://client.example.dev'
              ]
            });
            done();
          });
        })
        .catch(done);
    }); // should map name and origin URIs
    
  }); // #read
  
});
