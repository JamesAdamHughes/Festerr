angular.module('festerrApp').factory('DateFormatService', function() {

    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    /*
       Formats a date
       takes YYYY-MM-DD to DDth, Month, YY
    */
    var format = function(date) {
        var splitDates = date.split("-");

        var year = splitDates[0];
        var month = months[Number(splitDates[1]) - 1];
        var day = splitDates[2];

        return month + " " + day + " " + year;

    };

    return {
        format: format
    };



});