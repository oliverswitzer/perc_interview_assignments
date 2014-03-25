// mixpanel_export.js


// node modules
http = require('http');
Mixpanel = require('mixpanel');
md5 = require('MD5');
jsoncsv = require('jsoncsv');
fs = require('fs');
stringify = require('csv-stringify');

// cmd line input to get the event to filter the request by
eventFilter = process.argv[2];

// query params needed to make Mixpanel signature
today = new Date;
expireUTC = today.getTime() + 1E8;  // 1E8 is approximately a day in milliseconds
params = ["from_date=2014-01-01", "to_date=2014-03-10", "api_key=6968655dca8ecbf52604b137c6354ed6", "expire=" + expireUTC];

// if the user has supplied an event to filter by, push it to params array 
if (eventFilter !== undefined) {
  params.push("event=" + JSON.stringify([eventFilter]))
}   

// create the signature
paramsConcat = params.sort().join(""),
signature = md5(paramsConcat + "1bd71a4868d41f1dd76b702bff3c3e02");

//concat query params 
var base_url = "http://data.mixpanel.com/api/2.0/export/?",
    request = base_url + params.join("&") + "&sig=" + signature;

console.log("REQUEST URL: " + request)

// make get request to Mixpanel API
var req = http.get(request, function(response) {
  body = '';
  response.on("data", function(data) {
    body += data.toString();   // getting 'chunks' of data at a time and appending to body message
  });
  response.on("end", function() {
    /*NOTE: Since mixpanel doesnt output standard json, I had to do some messing around to convert the response into proper JSON (e.g. splitting on return characters) */
    var eventArray = body.split(/\n/); //an array with each event json object as an element
    
    // init our arrays for outputting to CSV
    var columns,
        outputToCSV = [];

    // iterate through array of JSON objects
    for (var i = 0, eventJSON; i < eventArray.length - 1; i++) {
      eventJSON = eventArray[i];
      var eventObj = JSON.parse(eventJSON),
          flatEventObj = flattenObject(eventObj); // a function which flattens nested properties into an object with on level of properties

      if (i == 0) {
        // get columns from first event object
        columns = parseEventColumns(eventObj);
        outputToCSV.push(columns);
      } else {
        // parse each object's values
        eventValues = parseEventValues(flatEventObj, columns);
        outputToCSV.push(eventValues);
      }
    }

    saveCSV(outputToCSV);
  
  });
}).on("error", function(e) {
  console.log("Got error: " + e.message);
})


var saveCSV = function(outputArray) {
  stringify(outputArray, function(err, output){
    fs.writeFile("eventOutput.csv", output, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    }); 
  });
}

var parseEventValues = function(obj, columns) {
  var propValues = [];
  for (var i in columns) {
    propValues.push(obj[columns[i]])  
  }
  return propValues
};

var parseEventColumns = function(obj) {
  var propColumns = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {  // to sure we are only iterating through specific objects properties and not its inherited prototype methods 
      if (typeof(obj[prop]) == "object"){
        for (var subProp in obj[prop]) {
          if (typeof(obj[prop][subProp]) != "object") {
            propColumns.push(subProp);
          }
        }
      } else {
        propColumns.push(prop)
      }
    }
  }
  return propColumns
};

var flattenObject = function(ob) {
  var toReturn = {};
  
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    
    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};



