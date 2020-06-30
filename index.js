/**
 * Primary file for the API
 */

// Dependencies

var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var _data = require('./lib/data');
var handlers = require('./lib/handlers')
var helpers = require('./lib/helpers')

// TESTING
// @TODO delete this
// _data.delete('test', 'newFile', function (err, data) {
//   console.log('err: ', err, 'data: ', data);
// })

// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

// start the httpServer
httpServer.listen(config.httpPort, function () {
  console.log('the server is listening on port ' + config.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log('the server is listening on port ' + config.httpsPort);
})

// All the server logic for both the http and https server
var unifiedServer = function (req, res) {

  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);

  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parseUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the header as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  })

  req.on('end', function () {
    buffer += decoder.end();

    // Chose the handler this request should to go.
    var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': helpers.parseJsonToObject(buffer)
    }

    // routher the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
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
}

// ================ ROUTER ================

var router = {
  'ping': handlers.ping,
  'users': handlers.users
};