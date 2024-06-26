var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/credentials/passwordstore');


describe('credentials/passwordstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.equal('module:@authnomicon/credentials.PasswordStore');
  });
  
  describe('#create', function() {
    
    it('should create user account with username and password', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            hashed_password: '$pbkdf2-sha256$i=310000$43I1LSSycXBMyfCHL81CKA$urMNIvsWf8bNmVP263MybiMPN0JV/UWXyaTMPJWMsrs'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');

          var user = {
            username: 'mhashimoto'
          };
          store.create(user, 'letmein', function(err, user) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, username, hashed_password)    VALUES ($1, $2, $3) RETURNING *');
            
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values[1]).to.equal('mhashimoto');
            expect(values[2]).to.be.a.string;
            expect(values[2].indexOf('$pbkdf2-sha256$')).to.equal(0);
            
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto'
            });
            done();
          });
        })
        .catch(done);
    }); // should create user account with username and password
    
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

          var user = {
            username: 'mhashimoto'
          };
          store.create(user, 'letmein', function(err, user) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.equal('something went wrong');
            done();
          });
        })
        .catch(done);
    }); // should error when database query fails
    
  }); // #create
  
  describe('#verify', function() {
    
    it('should verify password', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            hashed_password: '$pbkdf2-sha256$i=310000$43I1LSSycXBMyfCHL81CKA$urMNIvsWf8bNmVP263MybiMPN0JV/UWXyaTMPJWMsrs'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
        
          store.verify('mhashimoto', 'letmein', function(err, user) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE username = $1');
            expect(values).to.deep.equal([ 'mhashimoto' ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto'
            });
            done();
          });
        })
        .catch(done);
    }); // should verify password
    
    it('should not verify incorrect password', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            hashed_password: '$pbkdf2-sha256$i=310000$43I1LSSycXBMyfCHL81CKA$urMNIvsWf8bNmVP263MybiMPN0JV/UWXyaTMPJWMsrs'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
      
      var store = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(store) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
        
          store.verify('mhashimoto', 'donotletmein', function(err, user, info) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE username = $1');
            expect(values).to.deep.equal([ 'mhashimoto' ]);
            
            expect(user).to.be.false;
            expect(info.message).to.equal('Incorrect username or password.');
            done();
          });
        })
        .catch(done);
    }); // should not verify incorrect password
    
    it('should not verify unknown username', function(done) {
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
        
          store.verify('mhashimoto', 'letmein', function(err, user, info) {
            if (err) { return done(err); }
            
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE username = $1');
            expect(values).to.deep.equal([ 'mhashimoto' ]);
            
            expect(user).to.be.false;
            expect(info.message).to.equal('Incorrect username or password.');
            done();
          });
        })
        .catch(done);
    }); // should not verify unknown username
    
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
        
          store.verify('mhashimoto', 'letmein', function(err, user) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.equal('something went wrong');
            done();
          });
        })
        .catch(done);
    }); // should error when database query fails
    
  }); // #verify
  
});
