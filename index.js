/**
 * Primary file for the API
 */

// Dependencies

var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {

  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);
  
  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Send the reponse

  res.end('hello world');

  // log the request path
  console.log('Request received on path: ' + trimmedPath + ' with method: ' + method);
  
})
 // start the server, listen on port 3000

 server.listen(3000, function() {
   console.log('the server is listening on port 3000');
 })