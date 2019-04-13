var camembert;
var baton;
var colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)'
];
var aConfigDataSets = []; //Sera rempli dynamiquement

$(document).ready(function(){
    //Recupere le tableau de donnees depuis le php
    $.ajax({
        type: 'GET',
        url: 'model/model.php',
        dataType: 'json',
        cache: false,
        success: function(result) {
            fillGrid(result);
        },
        error: function(err) {
            alert('Aucune donnee...');
        }
    });
    
    //Met en place des listeners
    $("#camembert").click( 
        function(evt){
            var clickDoghnut = camembert.getElementAtEvent(evt);
            if(clickDoghnut[0] !== undefined){
                var valClick = camembert.data.datasets[0].data[clickDoghnut[0]._index];
                $("#valCamembert").val(valClick);
            }
        }
    );  

    $("#baton").click( 
        function(evt){
            var clickBar = baton.getElementAtEvent(evt);
            if(clickBar[0] !== undefined){
                var valClick = baton.data.datasets[0].data[clickBar[0]._index];
                $("#valBaton").val(valClick);
            }
        }
    );

});

/**
*
* Formatte les données et remplit le JsGrid
*/
function fillGrid(datas){
    //console.log(datas);
    var groupes = Object.values(datas);
    var aLabels = Object.keys(datas[0]);
    var aFields = [];
    for(var label in aLabels){
        if(isNaN(aLabels[label])){
            aFields.push({
                name: aLabels[label],
                type: "text"
            })
        }
    }
    $("#jsGrid").jsGrid({
        width : '100%',

        data: groupes,

        fields: aFields,
        rowClick: function(args) {
            var forCharts = [];
            for(var i in args.item){
                if(!isNaN(i)){
                    forCharts.push(args.item[i]);
                }
            }
            fillPie(forCharts);
            fillBar(forCharts);

            var $row = this.rowByItem(args.item);
            $(".jsgrid-highlight-row").removeClass('jsgrid-highlight-row');
            $row.toggleClass("jsgrid-highlight-row");
        }
    });
    
    createCharts();
}

/**
*
* Crée les graphiques avec Chart.js
*/
function createCharts(){
    var ctx = document.getElementById('camembert').getContext('2d');
    camembert = new Chart(ctx, {
        type: 'doughnut',
        datasets: [],
        options: {
            title: {
            display: true,
            text: 'Donut Repartition Animaux'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var currentValue = dataset.data[tooltipItem.index];       
                        return dataset.label[tooltipItem.index]+' : '+currentValue;
                    }   
                }
            },
            onClick: sliceClickHandler,
            legend: {
                display : true,
                onClick: legendClickHandler
            },
            animation:{
                duration: 1000
            }
        }
    });
    
    var ctx2 = document.getElementById('baton').getContext('2d');
    baton = new Chart(ctx2, {
        type: 'bar',
        datasets: [],
        options: {
            title: {
                display: true,
                text: 'Bar Repartition Animaux'
            },
            onClick: sliceClickHandler,
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    beginAtZero: true
                }]
            },
            animation:{
                duration: 1000
            }
        }
    });
}

/**
*
* Formatte les données pour le Camembert
*/
function fillPie(datas){
    //console.log(datas);
    var finalDatas = {};
    var datasets = [];
    var types = [];
    var totaux = [];
    var data = [];
    var color = [];
    var label = [];
    
    for(var i in datas){
        totaux[i] = datas[i].total;
        types[i] = datas[i].type;
        var tailles = Object.keys(datas[i].animaux);
        var effectifs = Object.values(datas[i].animaux);
        label = label.concat(tailles);
        data = data.concat(effectifs);

        aConfigDataSets[i] = []; //tableau associatif des dataSets
        for(var j=0; j<effectifs.length; j++){
            var newGradient = 0.3+j*0.15+')';
            col = colors[i].replace(/[\d\.]+\)$/g, newGradient);
            color.push(col);

            aConfigDataSets[i][j]=(i*effectifs.length)+j;
        }
    }
    //console.log(aConfigDataSets);
    datasets.push({
        label: types,
        data: totaux,
        backgroundColor: colors
    });
    datasets.push({
        label: label,
        data: data,
        backgroundColor: color
    });
    finalDatas.labels = types;
    finalDatas.datasets = datasets;
    //console.log(finalDatas);
    fillChart(camembert, finalDatas);
}

/**
*
* Formatte les données pour le Baton
*/
function fillBar(datas){
    var finalDatas = {};
    var datasets = [];
    for(var i in datas){
        datasets[i] = {
            label: datas[i].type,
            data: Object.values(datas[i].animaux),
            backgroundColor: colors[i]
        };
        //console.log(datas[i]);
    }
    finalDatas.labels = Object.keys(datas[i].animaux);
    finalDatas.datasets = datasets;
    //console.log(finalDatas);
    fillChart(baton, finalDatas);
}

/**
*
* Remplit les graphiques
*/
function fillChart(chart, allDatas){
    chart.data.labels = allDatas.labels;
    chart.data.datasets = allDatas.datasets;
    chart.update();
}

/**
*
* Gère les clics sur les légendes du camembert
*/
var legendClickHandler = function (e, legendItem) {
    var ci = this.chart;
    var index = legendItem.index;
    var toHide = aConfigDataSets[index];

    var meta1 = ci.getDatasetMeta(0).data[index];
    //console.log(ci);
    meta1.hidden = !meta1.hidden;
    for(j in toHide){
        var meta = ci.getDatasetMeta(1).data[toHide[j]];
        meta.hidden = !meta.hidden;
    }
    ci.update();
};

var sliceClickHandler = function(e, args) {
    var ci = this.chart;
    //console.log(ci);
    if(ci.data.datasets.length !== 0){//les donnees ont été chargées
        var element = ci.getElementsAtEvent(e)[0];
        if (element) {
            var index = args[0]._index;
            var label, data, datasetIndex;
            if(ci.config.type === 'pie'){
                datasetIndex = element._datasetIndex;
                data = ci.data.datasets[datasetIndex].data[index]; //data
                label = ci.data.datasets[datasetIndex].label[index]; //label
            }
            else{
                //console.log(args);
                datasetIndex = element._datasetIndex;
                data = ci.data.datasets[datasetIndex].data[index]; //data
                label = ci.data.datasets[datasetIndex].label[index]; //label
            }
            $("#clicked").text(label+" : "+data);
        }
    }
};
