var express = require('express');
var sys = require('sys');
var shell = require('shelljs');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var temp = shell.exec('cat /sys/class/thermal/thermal_zone0/temp', {silent: true}).output;
    console.log('Temperature:', temp);
    var output = shell.exec('netstat -rn', {silent: true}).output;
    console.log(output);
    var uptime = shell.exec('uptime', {silent: true}).output;
    console.log('Uptime:', uptime);

    var exec = require('child_process').exec;

    function LogMe(error, stdout, stderr) {
        console.log('Uptime 1:', stdout);
    }

    exec("uptime", LogMe);
    res.render('index', {
        title: 'Express',
        temp: temp,
        uptime: uptime
    });
});

module.exports = router;
