var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var sendCommandToSensor = require('../SensorManager').sendCommandToSensor;
var storage = require('node-persist');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('HomePage', {title: 'Orange Pi Zero'});
});

router.get('/logs', function (req, res, next) {
    res.render('LogsPage', {title: 'Orange Pi Zero'});
});

router.get('/services/temp', function (req, res, next) {
    exec('cat /sys/class/thermal/thermal_zone0/temp', function (error, stdout, stderr) {
        console.log(stdout);
        res.write(stdout);
        res.end();
    });

});

router.get('/services/shutdown', function (req, res, next) {
    exec('shutdown', function (error, stdout, stderr) {
        console.log(stdout);
    });
});

router.get('/services/reboot', function (req, res, next) {
    exec('reboot', function (error, stdout, stderr) {
        console.log(stdout);
    });
});

router.get('/sensor1/disable', function (req, res, next) {
    sendCommandToSensor('sensor1', 'disable');
    res.status(200);
    res.end();
});

router.get('/sensor1/enable', function (req, res, next) {
    sendCommandToSensor('sensor1', 'enable');
    res.status(200);
    res.end();
});

router.get('/sensor1/status', function (req, res, next) {
    storage.getItem('sensor1').then(function (sensorData) {
        var json = JSON.stringify(sensorData);
        console.log('----/sensor1/status - ' + sensorData.status);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(json);
    });
});

module.exports = router;
