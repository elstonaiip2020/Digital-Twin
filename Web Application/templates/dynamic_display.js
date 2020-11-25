$(document).ready(function () {
    const configP = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                labe1: "Digital Twin Output",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            },
            {
                label: "Solar Farm Output",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }				
            ],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Creating Real-Time Charts with Flask'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            layout:{
                padding:{
                    left:0,
                    right:50,
                    top:0,
                    bottom:0
                    }
                },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'power[kW]'
                    }
                }]
            }
        }
    };


    const configH = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Ho Label",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Creating Real-Time Charts with Flask'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            layout:{
                padding:{
                    left:0,
                    right:50,
                    top:0,
                    bottom:0
                    }
                },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginATzero:false,
                        max:95,
                        min:-95,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Azimuth[deg]'
                    }
                }]
            }
        }
    };

    

    const contextH = document.getElementById('Ho').getContext('2d');

    const contextP = document.getElementById('power').getContext('2d');

    const lineChartP = new Chart(contextP, configP);

    const lineChartH = new Chart(contextH, configH);

    function upDateChart(chart, dataVal, data) {
        if (chart.data.labels.length ===10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push(data["twin_output"]['date_time']);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data["twin_output"][dataVal]);
        });
        chart.update();
    }

    const source = new EventSource("/realtime");

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        upDateChart(lineChartH, "P", data)
        upDateChart(lineChartP, "Ho", data)
    }
});