var genericPath = 'data/item/';
var lastValue;
var timePeriod = 24;
var showCumulativeData;

var newChart = new Chart("myChart", {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: []
        }],
    },
    options: {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Rainfall (mm)"
                } 
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Time Of Day"
                } 
            }]
            
        }
    }

});

function getData(timePeriod, showCumulativeData) {
    var dateArray = [];
    var rainfallArray = [];
    var rainfallCumulativeArray = [];

    // Variables to save database current values
    var dateTimeString;
    var timeString;
    var dateTime;
    var rainfall;
    var rainfallCumulative = 0;

    firebase.database().ref(genericPath).limitToLast(timePeriod).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            rainfall = parseFloat(childSnapshot.child("RainfallTotal").val());
            dateTimeString = childSnapshot.child("DateTime").val();
            dateTime = new Date(dateTimeString);
            dateTime.setMinutes(Math.round(dateTime.getMinutes() / 60) * 60); // round minutes to nearest hour
            dateTime.setSeconds(0);
            timeString = `${dateTime.getHours()}:00`;

            rainfallArray.push(rainfall);
            dateArray.push(timeString);

            rainfallCumulative += rainfall;
            rainfallCumulativeArray.push(rainfallCumulative);
            document.getElementById("reading-float").innerHTML = rainfall;
            document.getElementById("reading-int").innerHTML = timeString;
            
            newChart.data.labels = dateArray;
            if (showCumulativeData) {
                newChart.data.datasets[0].data = rainfallCumulativeArray;
            } else {
                newChart.data.datasets[0].data = rainfallArray;
            }
            
            
        });
        newChart.update()
    });
}

getData(timePeriod); //Initially set to display last 24 hours



// update data when time period is changed
const timePeriodSelect = document.getElementById('timePeriod');
timePeriodSelect.addEventListener('change', event => {
    timePeriod = parseInt(event.target.value);
    getData(timePeriod, showCumulativeData);
});

const cumulativeCheckbox = document.getElementById("cumulativeCheckbox");
cumulativeCheckbox.addEventListener('click', event => {
    showCumulativeData = cumulativeCheckbox.checked;
    getData(timePeriod, showCumulativeData);
})



