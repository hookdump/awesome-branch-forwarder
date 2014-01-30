var bitbucketParser = {

  parseRequest: function(body){
    var parseResult = validateAndParseRequest(body);
    if(parseResult.errorMessage){
      return new Error(parseResult.errorMessage);
    } else {
      var branches = [],
        commitInfo = parseResult.commitInfo;
      for(var i = 0; i < commitInfo.commits.length; i++){
        // add branch if does not exist in array yet
        var branchToAdd = commitInfo.commits[i].branch;
        if(branches.indexOf(branchToAdd) == -1)
          branches.push(branchToAdd);
      }
      var result = {
        repository : commitInfo.repository.name,
        branches : branches
      };
      return result;
    }
  }

};

var validateAndParseRequest = function(body){
  var errorMessage = null,
    commitInfo = null;
  if(!body.payload)
    errorMessage = 'request body.payload is null';
  else {
    var parsed;

    try {
      commitInfo = JSON.parse(body.payload);
    } catch(ex){
      errorMessage = "bad json in payload : " + body.payload;
    }

    if(commitInfo) {
      if(!commitInfo.commits || !(commitInfo.commits instanceof Array))
        errorMessage = 'commits are null or not an array';
      else if(!commitInfo.repository || !commitInfo.repository.name)
        errorMessage = 'repository or repository name are null';
    }
  }

  return {
    errorMessage : errorMessage,
    commitInfo : commitInfo
  };

};

module.exports = bitbucketParser;