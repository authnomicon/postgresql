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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
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
    
    it('should map given name', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
            expect(values).to.deep.equal([ '703887' ]);
        
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                givenName: 'Mork'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should map given name
    
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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
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
            expect(sql).to.equal('SELECT * FROM users WHERE user_id = $1');
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name) VALUES ($1, $2, $3) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork'
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
    
    it('should create with middle name', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            middle_name: 'Robert'
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
              middleName: 'Robert'
            }
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, middle_name) VALUES ($1, $2) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Robert'
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                middleName: 'Robert'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should create with middle name
    
    it('should create with honorific prefix', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            honorific_prefix: 'Mr.'
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
              honorificPrefix: 'Mr.'
            }
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, honorific_prefix) VALUES ($1, $2) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Mr.'
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                honorificPrefix: 'Mr.'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should create with honorific prefix
    
    it('should create with honorific suffix', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            honorific_suffix: 'Esq.'
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
              honorificSuffix: 'Esq.'
            }
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, honorific_suffix) VALUES ($1, $2) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Esq.'
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                honorificSuffix: 'Esq.'
              }
            });
            done();
          });
        })
        .catch(done);
    }); // should create with honorific suffix
    
    it('should create with nickname', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            nickname: 'Bobby'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var user = {
            nickname: 'Bobby'
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, nickname) VALUES ($1, $2) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Bobby'
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              nickname: 'Bobby'
            });
            done();
          });
        })
        .catch(done);
    }); // should create with nickname
    
    it('should create with photos', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            photos: '{"(http://sample.site.org/photos/12345.jpg,thumbnail,,)"}'
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
            photos: [{
              value: 'http://sample.site.org/photos/12345.jpg',
              type: 'thumbnail'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, photos) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(http://sample.site.org/photos/12345.jpg,thumbnail,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
              photos: [{
                value: 'http://sample.site.org/photos/12345.jpg',
                type: 'thumbnail'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with photos
    
    it('should create with URLs', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork',
            urls: '{"(http://www.seeyellow.com,work,,)","(http://www.angryalien.com,home,,)"}'
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
            urls: [{
              value: 'http://www.seeyellow.com',
              type: 'work'
            }, {
              value: 'http://www.angryalien.com',
              type: 'home'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, urls) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(http://www.seeyellow.com,work,,)', '(http://www.angryalien.com,home,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Hashimoto',
                givenName: 'Mork'
              },
              urls: [{
                value: 'http://www.seeyellow.com',
                type: 'work'
              }, {
                value: 'http://www.angryalien.com',
                type: 'home'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with URLs
    
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,,,)', '(mhashimoto@plaxo.com,,,)' ]
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,work,true,)', '(mhashimoto@plaxo.com,home,false,)' ]
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, emails) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
              [ '(mhashimoto-04@plaxo.com,work,true,true)', '(mhashimoto@plaxo.com,home,false,false)' ]
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, phone_numbers) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, phone_numbers) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
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
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, phone_numbers) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Hashimoto',
              'Mork',
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
    
    it('should create with gender', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            gender: 'male'
          }
        ]
      });
      
      var postgres = new Object();
      postgres.createConnectionPool = sinon.stub().returns(client);
    
      var directory = factory('postgresql://www.example.com/exampledb', postgres)
        .then(function(directory) {
          expect(postgres.createConnectionPool).to.have.been.calledOnceWith('postgresql://www.example.com/exampledb');
          
          var user = {
            gender: 'male'
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, gender) VALUES ($1, $2) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'male'
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              gender: 'male'
            });
            done();
          });
        })
        .catch(done);
    }); // should create with gender
    
    it('should create with address with street address', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",,,,,,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,,,,,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with addresses with street address
    
    it('should create with address with street address and locality', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",,,,,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,,,,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address and locality
    
    it('should create with address with street address, locality, and region', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,,,,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,,,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, and region
    
    it('should create with address with street address, locality, region, and postal code', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,,,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, and postal code
    
    it('should create with address with street address, locality, region, postal code, and country', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, and country
    
    it('should create with address with street address, locality, region, postal code, country, and type', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,work,,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA',
              type: 'work'
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,work,,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA',
                type: 'work'
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, country, and type
    
    it('should create with address with street address, locality, region, postal code, country, type, and primary status set to true', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,work,t,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA',
              type: 'work',
              primary: true
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,work,true,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA',
                type: 'work',
                primary: true
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, country, type, and primary status set to true
    
    it('should create with address with street address, locality, region, postal code, country, type, and primary status set to false', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,work,f,)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA',
              type: 'work',
              primary: false
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,work,false,)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA',
                type: 'work',
                primary: false
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, country, type, and primary status set to false
    
    it('should create with address with street address, locality, region, postal code, country, type, and verified status set to true', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,work,,t)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA',
              type: 'work',
              verified: true
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,work,,true)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA',
                type: 'work',
                verified: true
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, country, type, and verified status set to true
    
    it('should create with address with street address, locality, region, postal code, country, type, and verified status set to false', function(done) {
      var client = new Object();
      client.query = sinon.stub();
      client.query.onFirstCall().resolves(null);
      client.query.onSecondCall().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Page',
            given_name: 'Larry',
            addresses: '{"(\\"1600 Amphitheatre Parkway\nSuite 200\\",\\"Mountain View\\",CA,94043,USA,work,,f)"}'
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
              familyName: 'Page',
              givenName: 'Larry'
            },
            addresses: [{
              streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
              locality: 'Mountain View',
              region: 'CA',
              postalCode: '94043',
              country: 'USA',
              type: 'work',
              verified: false
            }]
          };
          directory.create(user, function(err, user) {
            if (err) { return done(err); }
        
            expect(client.query).to.have.been.calledTwice;
            var sql = client.query.getCall(1).args[0];
            var values = client.query.getCall(1).args[1];
            expect(sql).to.equal('INSERT INTO users (user_id, family_name, given_name, addresses) VALUES ($1, $2, $3, $4) RETURNING *');
            expect(values[0]).to.be.a.string;
            expect(values[0]).to.be.have.length(36);
            expect(values.slice(1)).to.deep.equal([
              'Page',
              'Larry',
              [ '(1600 Amphitheatre Parkway\nSuite 200,Mountain View,CA,94043,USA,work,,false)' ]
            ]);
            
            expect(user).to.deep.equal({
              id: '703887',
              name: {
                familyName: 'Page',
                givenName: 'Larry'
              },
              addresses: [{
                streetAddress: '1600 Amphitheatre Parkway\nSuite 200',
                locality: 'Mountain View',
                region: 'CA',
                postalCode: '94043',
                country: 'USA',
                type: 'work',
                verified: false
              }]
            });
            done();
          });
        })
        .catch(done);
    }); // should create with address with street address, locality, region, postal code, country, type, and verified status set to false
    
  }); // #create
  
});
