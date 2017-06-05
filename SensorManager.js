/**
 * Methods for communication with sensors
 */
var storage = require('node-persist');
var request = require('request');
var AsyncPolling = require('async-polling');


var processSensors = AsyncPolling(function (end) {
    var storageKeysArray = storage.keys();
    if (storageKeysArray.length > 0) {
        storageKeysArray.forEach(function (storageKey) {
            if (storageKey.indexOf('192') == 0) {
                sendCommandToSensor(storageKey, 'getStatus');
            }
        })
    }
    end(null, 'Polling finished');
}, 1000);


function sendCommandToSensor(ip, command) {
    var options = {
        url: 'http://' + ip + ':3333' + '/' + command,
        agentOptions: {
            timeout: 500
        }
    };
    request(options, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the response body
        if (!error && response.statusCode == 200) {
            // console.log('Update ' + sensorName + ' status in storage ONLINE');
            updateSensorStatus(ip, response);
            return (response);
        }
        if (error) {
            // console.log('Update ' + ip + ' status in storage OFFLINE');
            updateSensorStatusWithError(ip, response)
        }
    });
}

function updateSensorStatus(ip, response) {
    var jsonObject = JSON.parse(response.body);
    storage.getItem(ip).then(function (sensorData) {
        sensorData['motionDetected'] = jsonObject.motionDetected;
        sensorData['sensorEnabled'] = jsonObject.sensorEnabled;
        sensorData['activeTimeSeconds'] = jsonObject.activeTimeSeconds;
        sensorData['status'] = 'online';
        storage.setItem(ip, sensorData, function (err) {
            // console.log('sensorData updated');
            // console.log(sensorData);
        });
    });
}


function updateSensorStatusWithError(ip) {
    storage.getItem(ip).then(function (sensorData) {
        sensorData['status'] = 'offline';
        storage.setItem(ip, sensorData, function (err) {
            // console.log('sensorData updated');
            // console.log(sensorData);
        });
    });
}

module.exports.processSensors = processSensors;
module.exports.sendCommandToSensor = sendCommandToSensor;