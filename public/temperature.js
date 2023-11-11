var genericPath = 'UsersData/sams_house/';
var lastValue;
var timePeriod = 24;
var showCumulativeData;

const currentDate = Date.now();

const day_ms = 1000*60*60*24; //One day in ms
const week_ms = 7*day_ms; //One week in milliseconds

Highcharts.setOptions({
    time: {
        timezone: 'Pacific/Auckland'
    }
});

function getData() {

    var combinedArray = [];

    // Variables to save database current values
    var dateTimeMilliseconds;
    var time;
    var dateTime;
    var temperature;
    var percent;

    firebase.database().ref(genericPath).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            temperature = parseFloat(childSnapshot.child("temperature").val());
            if (temperature != NaN) {
                dateTimeMilliseconds = childSnapshot.child("timestamp").val()*1000;
                dateTime = new Date(dateTimeMilliseconds);
                // console.log(dateTime)
                time = parseInt(dateTime.getTime()) //Returns time in milliseconds since Jan 1st, 1970
                combinedArray.push([dateTimeMilliseconds, temperature]) 
            }
        });
        
        Highcharts.stockChart('temperatureChart', {
            
            chart: {
                
                height: 500
            },
        
            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: 'Day',
                    dataGrouping: {
                        forced: false
                    }
                }, {
                    type: 'week',
                    count: 1,
                    text: 'Week',
                    dataGrouping: {
                        forced: false
                    }
                }, {
                    type: 'month',
                    count: 1,
                    text: 'Month',
                    dataGrouping: {
                        forced: true,
                        units: [['day', [1]]]
                    }
                }, {
                    type: 'year',
                    count: 1,
                    text: 'Year',
                    dataGrouping: {
                        forced: true,
                        units: [['week', [1]]]
                    }
                }, {
                    type: 'all',
                    text: 'All',
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
                type: 'line',
                name: 'Voltage',
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
            }],

            // yAxis: {
            //     min: 3,
            //     max: 4
            // }
        });
    });
    
}

getData(); 








