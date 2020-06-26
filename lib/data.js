/**
 * Libray for storing and editing data
 */

// Dependencies
var fs = require('fs');
var path = require('path');

// container for the module (to be exported)
var lib = {

};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
  // Open the file for writing
  fs.open(lib.baseDir + dir + '\\' + file + '.json', 'wx', function (err, fileDescription) {
    if (!err && fileDescription) {
      // Convert data to string]
      var stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescription, stringData, function (err) {
        if (!err) {
          fs.close(fileDescription, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          })
        } else {
          callback('Error writing to new file');
        }
      });

    } else {
      callback('Could not create new file');
    }
  });
}

// Read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + '\\' + file + '.json', function (err, data) {
    callback(err, data);
  })
}

// update data inside a file
lib.update = function (dir, file, data, callback) {
  fs.open(lib.baseDir + dir + '\\' + file + '.json', 'r+', function (err, fileDescriptor) {
    if (!err && fileDescriptor) {
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor, function (err) {
        if (!err) {
          //Write to the file and closs it
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false, stringData);
                } else {
                  callback('error closing existing file');
                }
              })
            }
          })
        } else {

        }
      })
    } else {
      callback('file my not exist yet');
    }
  })
};

lib.delete = function (dir, file, callback) {
  // Unlink the file
  fs.unlink(lib.baseDir + dir + '\\' + file + '.json', function (err) {
    if (!err) {
      callback(false)
    } else {
      callback('Error delete file')
    }
  })
};

// Export the module
module.exports = lib;