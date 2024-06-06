var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/oauth/grantservice');
var crypto = require('crypto');


describe('oauth/grantservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.deep.equal([
      'module:@authnomicon/oauth2.GrantService'
    ]);
  });
  
  describe('#find', function() {
    
    it('should yield grant', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 1,
        rows: [
          {
            grant_id: 'TSdqirmAxDa0_-DB_1bASQ',
            user_id: '5ba552d67',
            client_id: 's6BhdRkqt3',
            scopes: '{"(\\"{openid,email,address,phone}\\",)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(grants) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          grants.find({ id: 's6BhdRkqt3' }, { id: '5ba552d67' }, function(err, grant) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT * FROM grants WHERE user_id = $1 AND client_id = $2');
            expect(values).to.deep.equal([
              '5ba552d67',
              's6BhdRkqt3'
            ]);
            
            expect(grant).to.deep.equal({
              id: 'TSdqirmAxDa0_-DB_1bASQ',
              user: {
                id: '5ba552d67'
              },
              client: {
                id: 's6BhdRkqt3'
              },
              scopes: [ {
                scope: [ 'openid', 'email', 'address', 'phone' ]
              } ]
            });
            done();
          });
        })
        .catch(done);
    }); // should yield grant
    
    it('should yield without grant when not found', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 0,
        rows: []
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(grants) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          grants.find({ id: 's6BhdRkqt3' }, { id: '5ba552d67' }, function(err, grant) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT * FROM grants WHERE user_id = $1 AND client_id = $2');
            expect(values).to.deep.equal([
              '5ba552d67',
              's6BhdRkqt3'
            ]);
            
            expect(grant).to.be.undefined;
            done();
          });
        })
        .catch(done);
    }); // should yield without grant when not found
    
  }); // #find
  
  describe('#create', function() {
    
    it('should insert with scopes containing scope', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 1,
        rows: [
          {
            grant_id: 'TSdqirmAxDa0_-DB_1bASQ',
            user_id: '5ba552d67',
            client_id: 's6BhdRkqt3',
            scopes: '{"(\\"{openid,email,address,phone}\\",)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(grants) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var grant = {
            scopes: [ {
              scope: [ 'openid', 'email', 'address', 'phone' ]
            } ]
          };
          grants.create(grant, { id: 's6BhdRkqt3' }, { id: '5ba552d67' }, function(err, grant) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO grants (grant_id, user_id, client_id, scopes) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              '5ba552d67',
              's6BhdRkqt3',
              [ '("{openid,email,address,phone}",)' ]
            ]);
            
            expect(grant).to.deep.equal({
              id: 'TSdqirmAxDa0_-DB_1bASQ',
              user: {
                id: '5ba552d67'
              },
              client: {
                id: 's6BhdRkqt3'
              },
              scopes: [ {
                scope: [ 'openid', 'email', 'address', 'phone' ]
              } ]
            });
            done();
          });
        })
        .catch(done);
    }); // should insert with scopes containing scope
    
  }); // #create
  
});
