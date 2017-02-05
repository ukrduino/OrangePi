var express = require('express');


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var temp = "no data";
    var upTime = "no data";
    var exec = require('child_process').exec;

    function getTemp(error, stdout, stderr) {
        console.log('Temp 1:', stdout);
        temp = stdout;
    }

    function getUptime(error, stdout, stderr) {
        console.log('Uptime 1:', stdout);
        upTime = stdout;
    }

    exec("uptime", getTemp());
    exec("cat /sys/class/thermal/thermal_zone0/temp", getUptime());
    res.render('index', {
        title: 'Express',
        temp: temp,
        uptime: upTime
    });
});

module.exports = router;
