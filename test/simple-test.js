/*
var should = require('should');
var http = require('http');

var testString = "YesYes";

describe('Simple test', function() {

	before(function(done) {
		instance = http.createServer(function(request, res) {
	    res.setHeader('Content-Type', 'plain/text');
	    res.end(testString);
		}).listen(9991);
		instance.on("listening", function() {
			done();
		});
	});

	after(function(done){
		instance.close();
		done();
	});

	it("should work :)", function(done) {
		var body = "";
		http.get("http://localhost:9991/", function(res) {

      res.on('data', function(chunk) {
          // Note: it might be chunked, so need to read the whole thing.
          body += chunk;
      });
      res.on('end', function() {
          should.equal(body, testString);
          should.equal(res.statusCode, 200);
          done();
      });

		})
	});

	it('should rock', function(done) {
		done();
	});

});
*/