/**
 * Primary file for the API
 */

// Dependencies

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req, res) {

  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);
  
  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  var queryStringObject = parseUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the header as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data); 
  })

  req.on('end', function() {
    buffer += decoder.end();

    // Send the reponse
    res.end('hello world');

    // log the request path
    console.log('Request received with this payload: ', buffer);
  })
  
  
  
})
 // start the server, listen on port 3000

 server.listen(3000, function() {
   console.log('the server is listening on port 3000');
 })