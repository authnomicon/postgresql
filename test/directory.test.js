var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../com/directory');


describe('directory', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.equal('module:@authnomicon/core.Directory');
  });
  
  describe('#read', function() {
    
    it('should map family name and given name', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('703887', function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should map family name and given name
    
    it('should map emails with address', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            emails: '{"(mhashimoto-04@plaxo.com,,,)","(mhashimoto@plaxo.com,,,)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('703887', function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto',
              emails: [{
                value: 'mhashimoto-04@plaxo.com'
              }, {
                value: 'mhashimoto@plaxo.com'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should map emails with address
    
    it('should map emails with address, type, and primary', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            emails: '{"(mhashimoto-04@plaxo.com,work,t,)","(mhashimoto@plaxo.com,home,,)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('703887', function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto',
              emails: [{
                value: 'mhashimoto-04@plaxo.com',
                type: 'work',
                primary: true
              }, {
                value: 'mhashimoto@plaxo.com',
                type: 'home'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should map emails with address, type, and primary
    
    it('should map emails with verified status', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            emails: '{"(mhashimoto-04@plaxo.com,work,t,t)","(mhashimoto@plaxo.com,home,f,f)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('703887', function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto',
              emails: [{
                value: 'mhashimoto-04@plaxo.com',
                type: 'work',
                primary: true,
                verified: true
              }, {
                value: 'mhashimoto@plaxo.com',
                type: 'home',
                primary: false,
                verified: false
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should map emails with verified status
    
    it('should map phone numbers with number', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            username: 'mhashimoto',
            phone_numbers: '{"(KLONDIKE5,,,)","(650-123-4567,,,)"}'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          directory.read('703887', function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('SELECT *    FROM users   WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              username: 'mhashimoto',
              phoneNumbers: [{
                value: 'KLONDIKE5'
              }, {
                value: '650-123-4567'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should map phone numbers with number
    
  }); // #read
  
  describe('#create', function() {
    
    it('should create with family name and given name', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var user = {
            name: {
              familyName: 'Hashimoto',
              givenName: 'Mork'
            }
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            //expect(values).to.deep.equal([ '703887' ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should create with family name and given name
    
  }); // #create
  
});
