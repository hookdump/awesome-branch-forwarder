var should = require('should');
var http = require('http');

var awesomeBranchForwarder = require('../index');

describe('Initialization', function() {

	before(function(done) {
		done();
	});

	after(function(done){
		done();
	});

	it('should fail with empty config', function(done) {
		try {
			awesomeBranchForwarder.init();
			should.fail('no error was thrown when it should have been')
		}
		catch (error) {
			should.equal(error.message, 'config cannot be null');
			done();
		}
	});

	it('should fail if config is missing urls', function(done) {
		var invalidConfig = {"repositoryType": "bitbucket"};

		try {
			awesomeBranchForwarder.init(invalidConfig);
			should.fail('no error was thrown when it should have been')
		}
		catch (error) {
			should.equal(error.message, 'missing urls from config');
			done();
		}
	});

	it('should fail if config is missing repositoryType', function(done) {
		var invalidConfig = {"urls": []};

		try {
			awesomeBranchForwarder.init(invalidConfig);
			should.fail('no error was thrown when it should have been')
		}
		catch (error) {
			should.equal(error.message, 'missing repositoryType from config');
			done();
		}
	});
		
});