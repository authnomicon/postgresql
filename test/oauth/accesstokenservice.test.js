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
            user: { id: '5ba552d67' },
            client: { id: 's6BhdRkqt3' }
          };
          sts.issue(msg, function(err, token) {
            if (err) { return done(err); }
            
            expect(token).to.be.a('string');
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO access_tokens (token_hash, user_id, client_id) VALUES ($1, $2, $3)');
            expect(values).to.deep.equal([
              crypto.createHash('sha256').update(Buffer.from(token, 'base64')).digest(),
              '5ba552d67',
              's6BhdRkqt3'
            ]);
            done();
          });
        })
        .catch(done);
    }); // should insert user ID and client ID
    
    it('should insert scope', function(done) {
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
            user: { id: '5ba552d67' },
            client: { id: 's6BhdRkqt3' },
            scope: [ 'openid', 'email', 'address', 'phone' ]
          };
          sts.issue(msg, function(err, token) {
            if (err) { return done(err); }
            
            expect(token).to.be.a('string');
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO access_tokens (token_hash, user_id, client_id, scope) VALUES ($1, $2, $3, $4)');
            expect(values).to.deep.equal([
              crypto.createHash('sha256').update(Buffer.from(token, 'base64')).digest(),
              '5ba552d67',
              's6BhdRkqt3',
              [ 'openid', 'email', 'address', 'phone' ]
            ]);
            done();
          });
        })
        .catch(done);
    }); // should insert scope
    
  }); // #issue
  
  describe('#verify', function() {
    
    it('should map user ID and client ID', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 1,
        rows: [ {
          token_hash: Buffer.from('lnQPJYXx3smhBXrG+r94Uoa/bBatC/7FT1qeXM1wHmY=', 'base64'),
          user_id: '5ba552d67',
          client_id: 's6BhdRkqt3'
        }]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(sts) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          sts.verify('HwfqlXCJk/lo2GwPtuXCNEUSCubNJ5U4Wu6XOMBPJ9+61gWTjfC8eSQ6fG5Qp24ImnJT3/t+HIY+knthPwfjQg==', function(err, msg) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT * FROM access_tokens WHERE token_hash = $1');
            expect(values).to.deep.equal([
              Buffer.from('lnQPJYXx3smhBXrG+r94Uoa/bBatC/7FT1qeXM1wHmY=', 'base64')
            ]);
            
            expect(msg).to.deep.equal({
              user: { id: '5ba552d67' },
              client: { id: 's6BhdRkqt3' }
            })
            done();
          });
        })
        .catch(done);
    }); // should map user ID and client ID
    
    it('should map scope', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rowCount: 1,
        rows: [ {
          token_hash: Buffer.from('lnQPJYXx3smhBXrG+r94Uoa/bBatC/7FT1qeXM1wHmY=', 'base64'),
          user_id: '5ba552d67',
          client_id: 's6BhdRkqt3',
          scope: [ 'openid', 'email', 'address', 'phone' ]
        }]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(sts) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          sts.verify('HwfqlXCJk/lo2GwPtuXCNEUSCubNJ5U4Wu6XOMBPJ9+61gWTjfC8eSQ6fG5Qp24ImnJT3/t+HIY+knthPwfjQg==', function(err, msg) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT * FROM access_tokens WHERE token_hash = $1');
            expect(values).to.deep.equal([
              Buffer.from('lnQPJYXx3smhBXrG+r94Uoa/bBatC/7FT1qeXM1wHmY=', 'base64')
            ]);
            
            expect(msg).to.deep.equal({
              user: { id: '5ba552d67' },
              client: { id: 's6BhdRkqt3' },
              scope: [ 'openid', 'email', 'address', 'phone' ]
            })
            done();
          });
        })
        .catch(done);
    }); // should map scope
    
  }); // #verify
  
});
