var genericPath = 'data/item/';
var lastValue;
var timePeriod = 24;
var showCumulativeData;


function getData() {

    var combinedArray = [];

    // Variables to save database current values
    var dateTimeString;
    var timeString;
    var dateTime;
    var rainfall;

    firebase.database().ref(genericPath).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            rainfall = parseFloat(childSnapshot.child("RainfallTotal").val());
            dateTimeString = childSnapshot.child("DateTime").val();
            dateTime = new Date(dateTimeString);
            timeString = parseInt(dateTime.getTime())

            combinedArray.push([timeString, rainfall]) 
        });
        
        Highcharts.stockChart('myChart', {

            chart: {
                height: 300
            },
        
            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                    type: 'month',
                    count: 3,
                    text: 'Day',
                    dataGrouping: {
                        forced: true,
                        units: [['day', [1]]]
                    }
                }, {
                    type: 'year',
                    count: 1,
                    text: 'Week',
                    dataGrouping: {
                        forced: true,
                        units: [['week', [1]]]
                    }
                }, {
                    type: 'all',
                    text: 'Month',
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]]
                    }
                }],
                buttonTheme: {
                    width: 60
                },
                selected: 2
            },
        
            _navigator: {
                enabled: false
            },
        
            series: [{
                name: 'Rainfall',
                data: combinedArray,
                marker: {
                    enabled: null, // auto
                    radius: 3,
                    lineWidth: 1,
                    lineColor: '#FFFFFF'
                },
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
}

getData(); 






