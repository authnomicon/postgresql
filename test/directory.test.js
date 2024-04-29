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
      client.query = sinon.stub().yieldsAsync(null, {
        rows: [
          {
            user_id: '703887',
            family_name: 'Hashimoto',
            given_name: 'Mork'
          }
        ]
      });
    
    
      var directory = factory(client);
      directory.read('703887', function(err, user) {
        if (err) { return done(err); }
        
        expect(client.query).to.have.been.calledOnce;
        var sql = client.query.getCall(0).args[0];
        var values = client.query.getCall(0).args[1];
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
    });
    
  });
  
});
