var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

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

module.exports = router;
