var http = require('http');
var https = require('https');
var _ = require('underscore');
var urlParser = require('url');

/*
 * was getting an error w/o this config option
 * http://stackoverflow.com/questions/11091974/ssl-error-in-nodejs
 */
// https.globalAgent.options.secureProtocol = 'SSLv3_method';

var Forwarder = function(config, parser, cb){
  this.proxy = null;
  this.server = null;

  if (!config.urls) {
  	throw new Error('missing urls from config');
  }

  if (!config.listenPort) {
  	throw new Error('missing listenPort from config');
  }

  this.urls = config.urls;
  this.parser = parser;

  this.init(config.listenPort, cb);
};

Forwarder.prototype.urldecode = function(url) {
  return decodeURIComponent(url.replace(/\+/g, ' '));
}

Forwarder.prototype.init = function(port, cb) {

	var self = this;

	// Init server
	self.server = require('http').createServer(function(req, res) {

		var myBody = "";

		req.on('data', function(chunk) {
			myBody += chunk;
    });

    req.on('end', function() {
      console.log('Received request: ');
      console.log(myBody);

    	var forwardTo = [];
    	var decoded = self.urldecode(myBody);

    	decoded = decoded.replace("payload=", "");
			var jsonData = JSON.parse(decoded);

      var result = self.parser.parseRequest(jsonData);

      var watchingRepo = self.urls[ result.repository ];
      if (watchingRepo) {
      	// console.log('I received a push for a repo that I am supposed to proxy. Let\'s see...');

      	var watchingBranches = _.keys(watchingRepo);

      	result.branches.forEach(function(pushedBranch) {

      		if (watchingBranches.indexOf(pushedBranch) > -1) {
      			// console.log('Branch ' + pushedBranch + ', let\'s forward this push to ' + watchingRepo[pushedBranch]);
      			forwardTo.push( watchingRepo[pushedBranch] );
      		}

      	});

      	// console.log('Okay, amount of forwards to do: ' + forwardTo.length);
      	self.forwardMany(forwardTo, req.headers, myBody, null, function(err, result) {
      		// console.log('Finished forwarding! :)', result);

      		res.setHeader('Content-Type', 'plain/text');
	    		res.end(result);
      	});


      } else {
      	// console.log('I received a push for an unknown repo.');
      }

    });

	});

	self.server.listen(port);

	self.server.on('listening', function() {
		return cb(null);
	});

	self.server.on('error', function(err) {
		return cb(err);
	});
};

Forwarder.prototype.forwardMany = function(targets, headers, body, lastResponse, cb) {
	var self = this;

	if (targets.length === 0) {

		return cb(null, lastResponse);

	} else {

		var nextTarget = targets.shift();
		// console.log('Performing forward to ' + nextTarget);
		self.request(nextTarget, headers, body, function(err, response) {
			self.forwardMany(targets, headers, body, response, cb);
		});

	}

};

Forwarder.prototype.request = function(url, headers, body, cb) {
	console.log('going to ' + url);
  console.log('body: ');
  console.log(body);
	var parsed = urlParser.parse(url);

	var options = {
		hostname: parsed.hostname
		, port: parsed.port || 443
		, method: 'POST'
		, path: parsed.pathname
	};

	var h = {
		'content-length': headers["content-length"],
		'content-type': 'application/x-www-form-urlencoded',
		'accept-encoding': 'gzip, deflate',
		'user-agent': 'Bitbucket.org'
	};
	options.headers = h;

	var req =	https.request(options, function(res) {
		var body = "";
	  // res.setEncoding('utf8');

	  res.on('data', function(chunk) {
	      body += chunk;
	  });

	  res.on('end', function() {
	  	console.log('got response from target:', body);
      console.log(res.headers);
	     cb(null, body);
	  });

	});

	req.write(body);
	req.end();

}

Forwarder.prototype.stop = function(cb) {
	if (this.server._handle) {
		this.server.close(function() {
			return cb(null);
		});
	}
};

module.exports = Forwarder;
