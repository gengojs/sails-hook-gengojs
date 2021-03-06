var Sails = require('sails').Sails,
  _ = require('lodash'),
  assert = require('chai').assert;

describe('Basic tests ::', function () {

  // Var to hold a running sails app instance
  var sails;

  // Before running any tests, attempt to lift Sails
  before(function (done) {

    // Hook will timeout in 10 seconds
    this.timeout(11000);

    // Attempt to lift sails
    Sails().lift({
      hooks: {
        // Load the hook
        "gengo": require('../'),
        // Skip grunt (unless your hook uses it)
        "grunt": false
      },
      log: { level: "error" }
    }, function (err, _sails) {
      if (err) return done(err);
      sails = _sails;
      return done();
    });
  });
  // After tests are complete, lower Sails
  after(function (done) {

    // Lower Sails (if it successfully lifted)
    if (sails) {
      return sails.lower(done);
    }
    // Otherwise just return
    return done();
  });

  it('gengo.js should exist in sails', function () {
    if (sails) {
      assert.isDefined(sails.__);
      assert.isDefined(sails.__l);
      assert.isDefined(sails.gengo);
      return true;
    }
  });
     
  // Test that Sails can lift with the hook in place
  it('sails does not crash', function () {
    return true;
  });

});