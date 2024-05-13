var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/credentials/federatedidstore');


describe('credentials/federatedidstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.equal('module:@authnomicon/credentials.FederatedIDStore');
  });
  
  describe('#find', function() {
    
    it('should find user with credential', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            provider: 'https://server.example.com',
            subject: '248289761001',
            user_id: '400320'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var subject = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var provider = 'https://server.example.com';
          
          store.find(subject, provider, function(err, user) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM federated_credentials   WHERE provider = $1 AND subject = $2');
            expect(values).to.deep.equal([ 'https://server.example.com', '248289761001' ]);
            
            expect(user).to.deep.equal({
              id: '400320'
            });
            done();
          });
        })
        .catch(done);
    }); // should find user with credential
    
    it('should not find user with non-existent credential', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: []
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var subject = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var provider = 'https://server.example.com';
          
          store.find(subject, provider, function(err, user) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM federated_credentials   WHERE provider = $1 AND subject = $2');
            expect(values).to.deep.equal([ 'https://server.example.com', '248289761001' ]);
            
            expect(user).to.be.undefined;
            done();
          });
        })
        .catch(done);
    }); // should not find user with non-existent credential
    
    it('should error when database query fails', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(new Error('something went wrong'));
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var subject = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var provider = 'https://server.example.com';
          
          store.find(subject, provider, function(err, user) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.equal('something went wrong');
            done();
          });
        })
        .catch(done);
    }); // should error when database query fails
    
  }); // #find
  
  describe('#add', function() {
    
    it('should add credential to user account', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            provider: 'https://server.example.com',
            subject: '248289761001',
            user_id: '400320'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var subject = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var provider = 'https://server.example.com';
          var user = {
            id: '400320',
            name: {
              familyName: 'Doe',
              givenName: 'Jane'
            }
          };
          
          store.add(subject, provider, user, function(err, cred) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO federated_credentials (provider, subject, user_id)      VALUES ($1, $2, $3)   RETURNING *');
            expect(values).to.deep.equal([ 'https://server.example.com', '248289761001', '400320' ]);
            
            expect(cred).to.be.undefined;
            done();
          });
        })
        .catch(done);
    }); // should add credential to user account
    
    it('should error when database query fails', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(new Error('something went wrong'));
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var subject = {
            id: '248289761001',
            displayName: 'Jane Doe'
          };
          var provider = 'https://server.example.com';
          var user = {
            id: '400320',
            name: {
              familyName: 'Doe',
              givenName: 'Jane'
            }
          };
          
          store.add(subject, provider, user, function(err, cred) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.equal('something went wrong');
            done();
          });
        })
        .catch(done);
    }); // should error when database query fails
    
  }); // #add
  
});
