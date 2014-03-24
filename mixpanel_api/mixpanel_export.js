// mixpanel_export.js


// FOR MIXPANEL QUERY SIGNATURE
// args = all query parameters going to be sent out with the request 
//        (e.g. api_key, unit, interval, expire, format, etc.) excluding sig.

// args_sorted = sort_args_alphabetically_by_key(args)

// args_concat = join(args_sorted) 

// # Output: api_key=ed0b8ff6cc3fbb37a521b40019915f18event=["pages"]
// #         expire=1248499222format=jsoninterval=24unit=hour

// sig = md5(args_concat + api_secret)

// node modules
var http = require('http'),
    Mixpanel = require('mixpanel'),
    md5 = require('MD5'),
    jsoncsv = require('jsoncsv'),
    fs = require('fs'),
    stringify = require('csv-stringify');




// query params needed to make signature
var today = new Date,
    expireUTC = today.getTime() + 1E8,  // 1E8 is approximately a day in milliseconds
    args = ["from_date=2014-01-01", "to_date=2014-03-10", "api_key=6968655dca8ecbf52604b137c6354ed6", "expire=" + expireUTC],
    argsConcat = args.sort().join(""),
    signature = md5(argsConcat + "1bd71a4868d41f1dd76b702bff3c3e02");

var base_url = "http://data.mixpanel.com/api/2.0/export/?",
    request = base_url + args.join("&") + "&sig=" + signature;



var req = http.get(request, function(response) {
  body = '';
  response.on("data", function(data) {
    body += data.toString();   // getting 'chunks' of json at a time and appending to body message
  });
  response.on("end", function() {
    /*NOTE: Since mixpanel doesnt output standard json, I had to do some messing around to convert the response into proper JSON (e.g. splitting on return characters) */
    
    var eventArray = body.split(/\n/); //an array with each event json object as an element
    var columns,
        outputToCSV = [];

    console.log(typeof(eventArray[1]));
    for (var i = 0, eventJSON; i < eventArray.length - 1; i++) {
      eventJSON = eventArray[i];
      var eventObj = JSON.parse(eventJSON)
      if (i == 0) {
        columns = parseEventColumns(eventObj);
        outputToCSV.push(columns);
      } else {
        eventValues = parseEventValues(eventObj);
        outputToCSV.push(eventValues);
      }
    }

    stringify(outputToCSV, function(err, output){
      // console.log(output);
      // fs.writeFile("/tmp/test.csv", "Hey there!", function(err) {
      //   if(err) {
      //     console.log(err);
      //   } else {
      //     console.log("The file was saved!");
      //   }
      // }); 
    });
  });
}).on("error", function(e) {
  console.log("Got error: " + e.message);
})



function parseEventValues(obj, columns) {
  var propValues = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {  // to sure we are only iterating through specific objects properties and not its inherited prototype methods 
      if (typeof(obj[prop]) == "object"){
        for (var subProp in obj[prop]) {
          propValues.push(obj[prop][subProp]);
        }
      } else {
        propValues.push(obj[prop])
      }
    }
  }
  return propValues
}

function parseEventColumns(obj) {
  var propColumns = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {  // to sure we are only iterating through specific objects properties and not its inherited prototype methods 
      if (typeof(obj[prop]) == "object"){
        for (var subProp in obj[prop]) {
          propColumns.push(subProp);
        }
      } else {
        propColumns.push(prop)
      }
    }
  }
  return propColumns
}


// input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
// stringify(input, function(err, output){
//   output.should.eql('1,2,3,4\na,b,c,d');
// });



