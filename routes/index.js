var express = require('express');
require('shelljs/global');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var temp = exec('cat /sys/class/thermal/thermal_zone0/temp', {silent: true}).output;
    console.log('Temperature:', temp);
    var uptime = exec('uptime', {silent: true}).output;
    console.log('Uptime:', uptime);
    res.render('index', {
        title: 'Express',
        temp: temp,
        uptime: uptime
    });
});

module.exports = router;
