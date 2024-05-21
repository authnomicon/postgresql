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
            emails: '{"(mhashimoto-04@plaxo.com,work,t,)","(mhashimoto@plaxo.com,home,f,)"}'
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
                type: 'home',
                primary: false
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
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              undefined,
              undefined
            ]);
            
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
    
    it('should create with emails with address', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            emails: '{"(mhashimoto-04@plaxo.com,,,)","(mhashimoto@plaxo.com,,,)"}'
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
            },
            emails: [{
              value: 'mhashimoto-04@plaxo.com'
            }, {
              value: 'mhashimoto@plaxo.com'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,,,)', '(mhashimoto@plaxo.com,,,)' ],
              undefined
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
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
    }); // should create with emails with address
    
    it('should create with emails with address, type, and primary', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            emails: '{"(mhashimoto-04@plaxo.com,work,t,)","(mhashimoto@plaxo.com,home,f,)"}'
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
            },
            emails: [{
              value: 'mhashimoto-04@plaxo.com',
              type: 'work',
              primary: true
            }, {
              value: 'mhashimoto@plaxo.com',
              type: 'home',
              primary: false
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,work,true,)', '(mhashimoto@plaxo.com,home,false,)' ],
              undefined
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
              emails: [{
                value: 'mhashimoto-04@plaxo.com',
                type: 'work',
                primary: true
              }, {
                value: 'mhashimoto@plaxo.com',
                type: 'home',
                primary: false
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with emails with address, type, and primary
    
    it('should create with emails with verified status', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            emails: '{"(mhashimoto-04@plaxo.com,work,t,t)","(mhashimoto@plaxo.com,home,f,f)"}'
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
            },
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
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,work,true,true)', '(mhashimoto@plaxo.com,home,false,false)' ],
              undefined
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
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
    }); // should create with emails with verified status
    
    it('should create with phone numbers with number', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            phone_numbers: '{"(KLONDIKE5,,,)","(650-123-4567,,,)"}'
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
            },
            phoneNumbers: [{
              value: 'KLONDIKE5'
            }, {
              value: '650-123-4567'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              undefined,
              [ '(KLONDIKE5,,,)', '(650-123-4567,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
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
    }); // should create with phone numbers with number
    
    it('should create with phone numbers with number, type, and primary', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            phone_numbers: '{"(KLONDIKE5,work,t,)","(650-123-4567,mobile,f,)"}'
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
            },
            phoneNumbers: [{
              value: 'KLONDIKE5',
              type: 'work',
              primary: true
            }, {
              value: '650-123-4567',
              type: 'mobile',
              primary: false
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              undefined,
              [ '(KLONDIKE5,work,true,)', '(650-123-4567,mobile,false,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
              phoneNumbers: [{
                value: 'KLONDIKE5',
                type: 'work',
                primary: true
              }, {
                value: '650-123-4567',
                type: 'mobile',
                primary: false
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with phone numbers with number, type, and primary
    
    it('should create with phone numbers with verified status', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            phone_numbers: '{"(KLONDIKE5,work,t,f)","(650-123-4567,mobile,f,t)"}'
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
            },
            phoneNumbers: [{
              value: 'KLONDIKE5',
              type: 'work',
              primary: true,
              verified: false
            }, {
              value: '650-123-4567',
              type: 'mobile',
              primary: false,
              verified: true
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails, phone_numbers)    VALUES ($1, $2, $3, $4, $5) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              undefined,
              [ '(KLONDIKE5,work,true,false)', '(650-123-4567,mobile,false,true)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
              phoneNumbers: [{
                value: 'KLONDIKE5',
                type: 'work',
                primary: true,
                verified: false
              }, {
                value: '650-123-4567',
                type: 'mobile',
                primary: false,
                verified: true
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with phone numbers with verified status
    
  }); // #create
  
});
