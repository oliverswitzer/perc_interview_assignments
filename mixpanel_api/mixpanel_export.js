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
    md5 = require('MD5')
    jsoncsv = require('jsoncsv');

// query params needed to make signature
var args = ["from_date=2014-01-01", "to_date=2014-03-10", "api_key=6968655dca8ecbf52604b137c6354ed6", "expire=1396609442602"],
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
    console.log(JSON.stringify(body.split(/\n/))); //an array with each event json object as an element
  });
}).on("error", function(e) {
  console.log("Got error: " + e.message)
})



