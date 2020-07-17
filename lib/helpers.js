/**
 * Helpers for various tasks
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');
const { type } = require('os');

var https = require('https');
var querystring = require('querystring');

// Container for all the helpers
var helpers = {}


// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof (str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}


// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (err) {
    return {};
  }
};

// Create a string of random alphanumeric
helpers.createRandomString = function (strLength) {
  strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;
  if (strLength) {
    var possibleCharacters = 'abcdefghijklmonoqu0123456789';

    // Start the final string
    var str = '';
    for (var i = 1; i <= strLength; i++) {
      // Get a randome character from the possibleCharacters string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

      // Append this character to the final string
      str += randomCharacter;
    }

    return str;

  } else {
    return false;
  }
}

// Send an SMS message
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone = typeof (phone) == 'string' && phone.trim().length > 5 ? phone : false;
  msg = typeof (msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1000 ? msg.trim() : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      'From': config.twilio.fromPhone,
      'To': '+1' + phone,
      'Body': msg
    };

    // Stringify the payload
    var stringPayload = querystring.stringify(payload);

    // configure the request details
    var requestDetails = {
      'protocol': 'https',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + 'Messages.json',
      'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
      'headers': {
        'Content-Type': 'application/x-www-form-urllencoded',
        'Content-Length': Buffer.byteLength(stringpayload)
      }
    }

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      //Grab the status of the sent request
      var status = res.statusCode;
      // Callback successfully the request went through
      if (status == 200 || status == 201) {
        callback(false)
      } else {
        callback('Status code returned was ' + status);
      }
    });

    // Bid to the error event so it doesn't get thrown
    req.on('error', function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Give paramerters were missing or invalid');
  }
}

// Export the module
module.exports = helpers