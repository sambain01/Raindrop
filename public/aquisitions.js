var genericPath = 'data/item/';
var lastValue;
var timePeriod = 24;
var showCumulativeData;


function getData() {

    var combinedArray = [];

    // Variables to save database current values
    var dateTimeString;
    var time;
    var dateTime;
    var rainfall;
    var cumulativeRainfall = 0;

    firebase.database().ref(genericPath).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            rainfall = parseFloat(childSnapshot.child("RainfallTotal").val());
            cumulativeRainfall += rainfall;
            dateTimeString = childSnapshot.child("DateTime").val();
            dateTime = new Date(dateTimeString);
            time = parseInt(dateTime.getTime())

            combinedArray.push([time, rainfall]) 
        });
        
        Highcharts.stockChart('myChart', {
            
            chart: {
                
                height: 300
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
                        units: [['day', [1]]],
                        approximation: 'sum'
                    }
                }, {
                    type: 'year',
                    count: 1,
                    text: 'Year',
                    dataGrouping: {
                        forced: true,
                        units: [['week', [1]]],
                        approximation: 'sum'
                    }
                }, {
                    type: 'all',
                    text: 'All',
                    dataGrouping: {
                        forced: true,
                        units: [['month', [1]]],
                        approximation: 'sum'
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
                type: 'column',
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






