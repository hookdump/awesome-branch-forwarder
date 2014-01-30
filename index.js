var utils = require('./lib/utils');

var awesomeForwarder = {

	forwarder: null,

	init: function(config, cb) {
	  if (!config) {
	    throw new Error('config cannot be null');
	  }

	  this.forwarder = utils.createForwarder(config, function(err) {
	  	return cb(err, awesomeForwarder);
	  });
	},

	stop: function(cb) {
		awesomeForwarder.forwarder.stop(cb);
	}

};

module.exports = awesomeForwarder;