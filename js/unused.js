function exportChart(){
    var canvas = document.getElementById('baton');
    var img = canvas.toDataURL("image/png");
    document.write('<img src="'+img+'"/>');
}


/**
*
* Met à jour le graphique avec les données 'data'
*/
function majChart(chart, labels, datas){
    for(var i=0; i<chart.data.datasets.length; i++){
        chart.data.labels = labels;
        chart.data.datasets[i].data = datas;
    }
    //chart.data.datasets[0].data = data;
    chart.update();
}

var ctx = document.getElementById('camembert').getContext('2d');
camembert = new Chart(ctx, {
    type: 'pie',
    datasets: [],
    options: {
        title: {
        display: true,
        text: 'Donut Repartition Chiens/Chats'
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
                    return dataset.label[tooltipItem.index]+' : '+percentage + "%";
                }   
            }
        }   
    }
});