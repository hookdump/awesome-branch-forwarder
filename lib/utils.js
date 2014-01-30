var parsers = require('./parsers')
  , forwarder = require('./forwarder');

var utils = {

  createForwarder: function(config, cb) {

    if (!config.repositoryType) {
      throw new Error('missing repositoryType from config');
      return;
    }
    
    switch(config.repositoryType){
      case 'bitbucket' :
        parser = parsers.bitbucket;
        break;

      default:
        throw new Error('invalid repositoryType: ' + repositoryType);
        return;
    }

    return new forwarder(config, parser, cb);
  }

};

module.exports = utils;