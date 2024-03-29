var genericPath = 'data/item/';
var lastValue;
var timePeriod = 24;
var showCumulativeData;

var currentDate = new Date("2023-05-19T00:00:00+12:00"); 
console.log(currentDate.getFullYear());

const day_ms = 1000*60*60*24; //One day in ms
const week_ms = 7*day_ms; //One week in milliseconds


function getData() {

    var combinedArray = [];

    // Variables to save database current values
    var dateTimeString;
    var time;
    var dateTime;
    var rainfall;
    var diffTime;
    var cumulativeDayRainfall = 0;
    var cumulative48Rainfall = 0;
    var cumulativeWeekRainfall = 0;
    var cumulativeMonthRainfall = 0;
    var cumulativeYearRainfall = 0;

    firebase.database().ref(genericPath).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            rainfall = parseFloat(childSnapshot.child("RainfallTotal").val());
            dateTimeString = childSnapshot.child("DateTime").val();
            dateTime = new Date(dateTimeString);
            if (dateTime.getFullYear() == currentDate.getFullYear()) {
                cumulativeYearRainfall += rainfall;
                if (dateTime.getMonth() == currentDate.getMonth()) {
                    cumulativeMonthRainfall += rainfall;
                    if (dateTime.getDay() == currentDate.getDay()) {
                        cumulativeDayRainfall += rainfall;
                    }    
                }               
            }

            diffTime = currentDate - dateTime;
            if (diffTime < week_ms) {
                cumulativeWeekRainfall += rainfall;
                if (diffTime < 2*day_ms) {
                    cumulative48Rainfall += rainfall;
                }
            }  
            

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

        const cumDayElement = document.getElementById("cumDay");
        const cum48Element = document.getElementById("cum48");
        const cumWeekElement = document.getElementById("cumWeek");
        const cumMonthElement = document.getElementById("cumMonth");
        const cumYearElement = document.getElementById("cumYear");

        cumDayElement.innerHTML = cumulativeDayRainfall;
        cum48Element.innerHTML = cumulative48Rainfall;
        cumWeekElement.innerHTML = cumulativeWeekRainfall;
        cumMonthElement.innerHTML = cumulativeMonthRainfall;
        cumYearElement.innerHTML = cumulativeYearRainfall;
    });
    
}

getData(); 








