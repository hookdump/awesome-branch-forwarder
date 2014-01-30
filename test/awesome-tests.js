var should = require('should');
var http = require('http');

var awesomeBranchForwarder = require('../index');

var testBody = { 
	payload: '{"repository": {"website": "", "fork": false, "name": "test.service", "scm": "git", "owner": "Iggy", "absolute_url": "/Something/SomethingElse/", "slug": "test.service", "is_private": true}, "truncated": false, "commits": [{"node": "1234567", "files": [{"type": "modified", "file": "README"}], "raw_author": "Iggy <me@test.com>", "utctimestamp": "2014-01-29 22:00:04+00:00", "author": "hookdump", "timestamp": "2014-01-29 23:00:04", "raw_node": "1234567245", "parents": ["asdasdasd"], "branch": "staging", "message": "--- TEST 3 ---", "revision": null, "size": -1}], "canon_url": "https://bitbucket.org", "user": "hookdump"}' 
};

var config = {
	repositoryType: "bitbucket"
	, urls: {
		"test.service": {
			"staging": "http://127.0.0.1:9898"
			, "production": "http://127.0.0.1:9898"
		}
	}
	, listenPort: 8883
};

var instance;
var targetServer;
var testString = "asd";

describe('Awesome Branch Forwarder', function() {

	before(function(done) {

		targetServer = http.createServer(function(req, res) {

			// console.log('TARGET SERVER RECEIVED A REQUEST!');

	    res.setHeader('Content-Type', 'plain/text');
	    res.end(testString);

		}).listen(9898);

		targetServer.on("listening", function() {

			awesomeBranchForwarder.init(config, function(err, obj) {
				instance = obj;
				done();
			});

		});

	});

	after(function(done){
		targetServer.close();
		done();
	});

	it('should get initialized', function(done) {
		(instance === null).should.be.false;
		done();
	});


	it('should forward requests', function(done) {
		var options = {
			hostname: '127.0.0.1'
			, port: config.listenPort
			, path: '/'
			, method: 'POST'
		};

		var req =	http.request(options, function(res) {
			var body = "";
		  res.setEncoding('utf8');

	    res.on('data', function(chunk) {
	        body += chunk;
	    });

	    res.on('end', function() {
        should.equal(body, testString);
        should.equal(res.statusCode, 200);
        done();
	    });
		});

    req.write(JSON.stringify(testBody));
    req.end();

	});


});