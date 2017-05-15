$(function () {

    // Update temperature
    setInterval(function () {
        $.get("/services/temp", function (string) {
            $('#temp').text(string);
        });
        new Audio('sounds/Alarm.mp3').play()
    }, 1000);

});
