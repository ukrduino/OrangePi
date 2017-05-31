$(function () {
    // //Update temperature
    // setInterval(function () {
    //     $.get("/services/temp", function (string) {
    //         $('#temp').text(string);
    //     });
    // }, 1000);
    var timerId = getSensorStatus('sensor1', processResult, processError);
    console.log(timerId);

    $('#alarm1 ').find('.arm').on('click', function () {
        toggleSensor("sensor1", "enable");
        clearTimeout(timerId);
        timerId = getSensorStatus('sensor1', processResult, processError);
        console.log(timerId);
    });
    $('#alarm1 ').find('.disarm').on('click', function () {
        toggleSensor("sensor1", "disable");
        clearTimeout(timerId);
        timerId = getSensorStatus('sensor1', processResult, processError);
        console.log(timerId);
    });
});

function playSound(path) {
    new Audio(path).play(); //TODO find bug
}

function callNTimes(func, num, delay) { //TODO find bug
    var x;
    for (x = 1; x <= num; x++) {
        console.log(x);
        console.log(delay * x);
        setTimeout(func, delay * x)
    }
    ;
}


function processResult(result, timerId) {
    console.log(result);

    var statusLabel = $('#alarm1 ').find('.sensorStatus');
    var statusString = result['status'] + ' ' + moment.duration(result['activeTimeSeconds'], "seconds").humanize();
    console.log(result['sensorEnabled']);
    if (result['sensorEnabled']) {
        statusString += " ARMED";
    } else {
        statusString += " DISARMED";
    }
    statusLabel.html(statusString);
    if (result['status'] == 'online' && result['motionDetected'] == false) {
        statusLabel.removeAttr('class').attr('class', 'label sensorStatus label-success');
    }
    if (result['status'] == 'online' && result['motionDetected'] == true) {
        statusLabel.removeAttr('class').attr('class', 'label sensorStatus label-danger');
        statusLabel.html('MOTION DETECTED!!!');
        callNTimes(playSound('sounds/Alarm.mp3'), 30, 1000);
        clearTimeout(timerId);
    }
    if (result['status'] == 'offline') {
        statusLabel.html('DISCONNECTED');
        statusLabel.removeAttr('class').attr('class', 'label sensorStatus label-warning');
        playSound('sounds/Disconnect.mp3');
    }
}

function processError() {
    var statusLabel = $('#alarm1 ').find('.sensorStatus');
    statusLabel.html('INTERNAL ERROR !!!');
    statusLabel.removeAttr('class').attr('class', 'label sensorStatus label-info');
    playSound('sounds/Disconnect.mp3');
}


function toggleSensor(sensor, action) {
    $.get('/' + sensor + '/' + action)
        .success(function () {
            console.log(sensor + " " + action + " success");
        })
        .error(function (jqXHR, textStatus, errorThrown) {
            console.log(sensor + " " + action + " failed");
            console.log(sensor + " response: " + textStatus);
            console.log(sensor + " error: " + errorThrown);
        });
}

function getSensorStatus(sensor, processResult, onError) {
    var timerId = setInterval(function () {
        $.get('/' + sensor + '/status')
            .success(function (result) {
                processResult(result, timerId);
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                onError();
            });

    }, 1000);

    return timerId;
}
