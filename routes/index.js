var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;


/* GET home page. */
router.get('/', function (req, res, next) {
    exec('uptime', function (error, stdout, stderr) {
        exec('cat /sys/class/thermal/thermal_zone0/temp', function (error, stdout1, stderr) {

            //refactore to normal functions
            res.render('index', {
                title: 'Express',
                uptime: stdout,
                temp: stdout1
            });
        });
    });
});

module.exports = router;
