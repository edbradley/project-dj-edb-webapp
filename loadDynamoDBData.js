/**********************************************************************************
A simple NodeJS script for loading Mix Info data into a DynamoDB table from a JSON 
text file.

Code stolen from:
https://calorious.wordpress.com/2016/03/18/episode-4-importing-json-into-dynamodb/
***********************************************************************************/

// package to read json files
var jsonfile = require("jsonfile");
// AWS Javascript/node sdk
var AWS = require("aws-sdk");

// update/set region in config
AWS.config.update({
  region: "us-east-1"
});

// create an AWS Document Client instance (allows using JSON directly)
var docClient = new AWS.DynamoDB.DocumentClient();

/*
expected JSON file format:
[{ ... }, { ... }]
*/
var mixInfoFile = "SampleDJedbDBItems.json";
var mixInfoArray = jsonfile.readFileSync(mixInfoFile);

// utility function to create a single DynamoDB PUT request (params)
function getMixInfo(index) {
  return {
    TableName: "dj_edb_mixes",
    Item: mixInfoArray[index]
  };
}

// recursive function to save one Mix Info item at a time
function saveMixes(index) {
  if (index == mixInfoArray.length) {
    console.log("saved all Mixes.");
    return;
  }

  var params = getMixInfo(index);
  // DEBUG: spit out the data we are saving, for sanity
  //console.log(JSON.stringify(params));

  // use the Document Client to execute DynamoDB PUT request.
  docClient.put(params, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("saved Mix Info item " + index);
      index += 1;
      // save the next Mix on the array/list
      // with half a second delay/throttle
      setTimeout(function() {
        saveMixes(index);
      }, 500);
    }
  });
}

// start saving Mix Info items from index - 0
saveMixes(0);
