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
    
  }); // #read
  
});
