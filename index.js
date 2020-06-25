/**
 * Primary file for the API
 */

// Dependencies

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

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

    // Chose the handler this request should to go.
    var chosenHandler = typeof(router[trimmedPath])  !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }

    // routher the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload) {
      // use the status code called backed by the handler, or default to 200
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

      // use the payload called backed by the handler, or default to and empty object
      payload = typeof (payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the request path
      
      console.log('Request received with this payload: ', statusCode, payloadString);

    });

    // Send the reponse

    
  })
  
  
  
})
 // start the server

server.listen(config.port, function () {
  console.log('the server is listening on port ' + config.port);
})

// ================ ROUTER ================

 // Define a request router
var handlers = {};

// Sample handler
handlers.sample = function(data, callback) {
  // callback a htt status code, and a payload object
  callback(406, {'name': 'sample handler'});
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404)
}

var router = {
  'sample': handlers.sample
};