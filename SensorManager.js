/**
 * Methods for communication with sensors
 */
var storage = require('node-persist');
var request = require('request');
var AsyncPolling = require('async-polling');


var sensorPolling1 = AsyncPolling(function (end) {
    sendCommandToSensor("sensor1", 'getStatus');
    end(null, 'Polling finished');
}, 1000);


function sendCommandToSensor(sensorName, command) {
    storage.getItem(sensorName).then(function (sensorData) {
        var options = {
            url: sensorData['ip'] + '/' + command,
            agentOptions: {
                timeout: 500
            }
        };
        request(options, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the response body
            if (!error && response.statusCode == 200) {
                // console.log('Update ' + sensorName + ' status in storage ONLINE');
                updateSensorStatus(sensorName, response);
                return (response);
            }
            if (error) {
                console.log('Update ' + sensorName + ' status in storage OFFLINE');
                updateSensorStatusWithError(sensorName, response)
            }
        });
    });
}

function updateSensorStatus(sensorName, response) {
    var jsonObject = JSON.parse(response.body);
    storage.getItem(sensorName).then(function (sensorData) {
        sensorData['motionDetected'] = jsonObject.motionDetected;
        sensorData['sensorEnabled'] = jsonObject.sensorEnabled;
        sensorData['activeTimeSeconds'] = jsonObject.activeTimeSeconds;
        sensorData['status'] = 'online';
        storage.setItem(sensorName, sensorData, function (err) {
            console.log('sensorData updated');
            console.log(sensorData);
        });
    });
}


function updateSensorStatusWithError(sensorName) {
    storage.getItem(sensorName).then(function (sensorData) {
        sensorData['status'] = 'offline';
        storage.setItem(sensorName, sensorData, function (err) {
            // console.log('sensorData updated');
            // console.log(sensorData);
        });
    });
}

module.exports.sensorPolling1 = sensorPolling1;
module.exports.sendCommandToSensor = sendCommandToSensor;