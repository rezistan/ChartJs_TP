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
        success: function(data) {
            fillGrid(data);
        },
        error: function(err) {
            console.log(err);
            alert('Erreur reception donnees ...');
        }
    });
});

/**
*
* Formatte les données et remplit le JsGrid
*/
function fillGrid(datas){
    var groupes = Object.values(datas);
    var aLabels = Object.keys(datas[0]);
    var aFields = [];
    for(var label in aLabels){
        if(isNaN(aLabels[label])){
            aFields.push({
                name: aLabels[label],
                type: "text"
            });
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
        type: 'pie',
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
                        var total = dataset.data.reduce(function(previousValue, currentValue) {
                            return previousValue + currentValue;
                        });

                        //Pourcentage des sous ensembles
                        if(tooltipItem.datasetIndex === 1){
                            for(var i in aConfigDataSets){
                                if(aConfigDataSets[i].includes(tooltipItem.index)){
                                    total = data.datasets[0].data[i];
                                }
                            }
                        }

                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.round((currentValue/total) * 100);
                        return dataset.label[tooltipItem.index]+' : '+percentage + "%";
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
            legend: {
                onClick: function(e, legendItem){
                    Chart.defaults.global.legend.onClick.call(this, e, legendItem); //rajout this!!!
                    updateGrid(this.chart, legendItem.datasetIndex);
                }
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
                    beginAtZero: true
                }]
            }
        }
    });
}

/**
*
* Formatte les données pour le Camembert
*/
function fillPie(datas){
    var finalDatas = {};
    var datasets = [];
    var types = [];
    var totaux = [];
    var data = [];
    var colors2 = [];
    var label = [];

    for(var i=0; i<datas.length; i++){
        totaux[i] = datas[i].total;
        types[i] = datas[i].type;
        var tailles = Object.keys(datas[i].animaux);
        var effectifs = Object.values(datas[i].animaux);
        label = label.concat(tailles);
        data = data.concat(effectifs);

        aConfigDataSets[i] = []; //tableau associatif des dataSets
        for(var j=0; j<effectifs.length; j++){
            aConfigDataSets[i][j]=(i*effectifs.length)+j;

            //couleurs des ensembles
            var newGradient = 0.3+j*0.15+')';
            var col = colors[i].replace(/[\d\.]+\)$/g, newGradient);
            colors2.push(col);
        }
    }
    datasets.push({
        label: types,
        data: totaux,
        backgroundColor: colors
    });
    datasets.push({
        label: label,
        data: data,
        backgroundColor: colors2
    });
    finalDatas.labels = types;
    finalDatas.datasets = datasets;
    fillChart(camembert, finalDatas);

    gridDetails(datas);//affichage du tableau des détails
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
    }
    finalDatas.labels = Object.keys(datas[i].animaux);
    finalDatas.datasets = datasets;
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
* Gère les clics sur les légendes
*/
var legendClickHandler = function (e, legendItem) {
    var ci = this.chart;
    var index = legendItem.index;

    hideSlices(ci, index);

    //Maj du jsGrid
    updateGrid(ci, index);
};

/**
 * Cache les parts du camembert
 * @param ci
 * @param index
 */
function hideSlices(ci, index){
    var toHide = aConfigDataSets[index];

    var meta1 = ci.getDatasetMeta(0).data[index];
    meta1.hidden = !meta1.hidden;
    for(var j in toHide){
        var meta = ci.getDatasetMeta(1).data[toHide[j]];
        meta.hidden = !meta.hidden;
    }
    ci.update();
}

/**
 *
 * Gère les clics sur les graphiques
 */
var sliceClickHandler = function(e, args) {
    var ci = this.chart;
    if(ci.data.datasets.length !== 0){//les donnees ont été chargées
        var element = ci.getElementsAtEvent(e)[0];
        if (element) {
            var index = args[0]._index;
            var datasetIndex = ci.getDatasetAtEvent(e)[0]._datasetIndex;
            var type = '';
            var label;
            if(ci.config.type === 'pie' || ci.config.type === 'doughnut'){
                if(datasetIndex === 1){
                    for(var i in aConfigDataSets){
                        if(aConfigDataSets[i].includes(index)){
                            type = ' ('+ci.data.datasets[0].label[i]+')';//type des animaux
                        }
                    }
                }
                label = ci.data.datasets[datasetIndex].label[index]; //label
            }
            else{ //bar
                label = ci.data.datasets[datasetIndex].label; //label
                type = ' ('+ci.data.labels[index]+')';
            }
            var data = ci.data.datasets[datasetIndex].data[index]; //data
            $("#clicked").text(label+" : "+data+type);
        }
    }
};


/**
 * JsGrid contenant les détails des graphiques
 * @param data
 */
function gridDetails(data) {
    var fields = [];
    var details = [];
    for(var i in data) {
        var tabAnimaux = {type: data[i].type};
        Object.assign(tabAnimaux, data[i].animaux); //concatenation d'objets
        details = details.concat(tabAnimaux);
    }
    for(var key in details[0]){
        fields.push({
            name: key,
            type: 'text'
        });
    }

    $("#gridDetails").jsGrid({
        width : '100%',
        data: details,
        fields: fields,
        rowClass: function(item){ //détermine les lignes à cacher
            if(item.cacher){
                return "hidden-row";
            }
            return "";
        }
    });
}

/**
 *
 * update gridDetails
 */
function updateGrid(chart, index){
    var meta = chart.getDatasetMeta(0).data[index];
    var grid = $("#gridDetails");
    var gridData = grid.jsGrid("option", "data");
    if(chart.config.type === 'bar'){
        var dataset = chart.config.data.datasets[index];
        gridData[index].cacher = dataset._meta[1].hidden;
        hideSlices(camembert, index);
    }
    else{ //pie or doughnut
        gridData[index].cacher = meta.hidden;
        var slice = baton.config.data.datasets[index];
        slice._meta[1].hidden = meta.hidden;
        baton.update();
    }
    grid.jsGrid("refresh");
}
