/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class QueueGridTest
* @constructor
*/
function QueueGridTest(args) {
    this.id = BUI.id();

    QueueGrid.call(this,args);
    this.imgWidth = 130;

    this.store = Ext.create('Ext.data.Store', {
            fields: ["experiment"]
     });
}

QueueGridTest.prototype.getPercentage = QueueGrid.prototype.getPercentage;
QueueGridTest.prototype.getImage = QueueGrid.prototype.getImage;
QueueGridTest.prototype.parseDataById = QueueGrid.prototype.parseDataById;
QueueGridTest.prototype.attachCallBackAfterRender = QueueGrid.prototype.attachCallBackAfterRender;


QueueGridTest.prototype.load = function(experiment){
    var _this = this;
    
    this.setLoading();
    try{
        if (experiment.experimentId){
            var onSuccess = function(sender, data){
                if (data != null) {
                    _this.dataByDataCollectionId = _this.parseDataById(data);
                    _this.store.loadData(_.keys(_.keyBy(data,'dataCollectionId')), true);
                    _this.attachCallBackAfterRender(document.getElementById(_this.id + "-body").childNodes[0]);
                }
                _this.setLoading(false);
            };

            EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByExperimentId(experiment.experimentId);
        } else {
            this.dataByDataCollectionId = this.parseDataById(experiment);
            this.store.loadData(_.keys(_.keyBy(experiment,'dataCollectionId')), true);
            _this.attachCallBackAfterRender();
            _this.setLoading(false);
        }
    }
    catch(e){
        console.log(e);
    }
};

QueueGridTest.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        id: this.id,
        border: 1,        
        store: this.store,       
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        }
    });

    return this.panel;
};

QueueGridTest.prototype.setLoading = function(bool){
	this.panel.setLoading(bool);
};

QueueGridTest.prototype.filter = function(key, value) {
    var filtered = _.filter(this.dataByDataCollectionId,function(o) {return o[0]["bufferAcronym"] == value});
    this.store.loadData(_.keys(_.keyBy([].concat.apply([], filtered),'dataCollectionId')));
}


QueueGridTest.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {
            dataIndex: 'experiment',
            name: 'experiment',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var dataCollectionId = record.data;
                var currentDataCollection = _this.dataByDataCollectionId[dataCollectionId];                              
                var html = "";

                var codes = [];
                var macromoleculeInfo = [];
                var averages = [];
                var expTemp = currentDataCollection[0].exposureTemperature + " C";

                var rg = "NA";
                var points = "NA";
                if (currentDataCollection[0].rg != null) {
                    rg = Number(currentDataCollection[0].rg).toFixed(_this.decimals);
                    points = currentDataCollection[0].firstPointUsed + " - " + currentDataCollection[0].lastPointUsed + " (" + (currentDataCollection[0].lastPointUsed - currentDataCollection[0].firstPointUsed) + ")";
                }	
                var I0 = "NA";
                if (currentDataCollection[0].I0 != null){
                    var I0 = Number(currentDataCollection[0].I0).toFixed(_this.decimals-2);
                    var I0Stdev = Number(Number(currentDataCollection[0].I0Stdev).toFixed(_this.decimals)).toExponential();
                }

                var rgGnom = "NA";
                if (currentDataCollection[0].rgGnom != null) {
                    rgGnom = Number(currentDataCollection[0].rgGnom).toFixed(_this.decimals);
                }	
                var total = "NA";
                if (currentDataCollection[0].total != null) {
                    total = Number(currentDataCollection[0].total).toFixed(_this.decimals);
                }
                var dmax = "NA";
                if (currentDataCollection[0].dmax != null) {
                    dmax = Number(currentDataCollection[0].dmax).toFixed(_this.decimals);
                }

                var volumePorod = "NA";
                var mmvolest = "NA";
                if (currentDataCollection[0].volumePorod != null) {
                    volumePorod = Number(currentDataCollection[0].volumePorod).toFixed(_this.decimals);
                    mmvolest = Number(currentDataCollection[0].volumePorod / 2).toFixed(1) + " - "
                                            + Number(currentDataCollection[0].volumePorod / 1.5).toFixed(1);
                }

                var scattering = "";
                var kratky = "";
                var density = "";
                var guinier = "";
                var concentration = "";

                for (var j = 0 ; j < currentDataCollection.length ; j++) {
                    var experiment = currentDataCollection[j];
                    // codes.push(experiment.code);
                    if (experiment.concentration != 0) {
                        concentration = Number(experiment.concentration).toFixed(_this.decimals-1);
                    }
                    if (experiment.macromoleculeId != null) {
                        scattering = _this.getImage(experiment,"scattering");
                        kratky = _this.getImage(experiment,"kratky");
                        density = _this.getImage(experiment,"density");
                        guinier = _this.getImage(experiment,"guinier");
                    }
                    var macromoleculeAcronym = "";
                    if (experiment.macromoleculeAcronym != null) {
                        macromoleculeAcronym = experiment.macromoleculeAcronym;
                    }
                    // macromoleculeInfo.push({ acronym : macromoleculeAcronym, concentration : concentration});
                    // averages.push(_this.getPercentage(experiment.framesMerge,experiment.framesCount));

                    codes.push({code : experiment.code, acronym : macromoleculeAcronym, average : _this.getPercentage(experiment.framesMerge,experiment.framesCount)});
                }                      

                var templateData = {
									codes : codes,
									macromoleculeAcronym : macromoleculeAcronym,
                                    concentration : concentration,
									// averages : averages,
									expTemp : expTemp,
									rg : rg,
									points : points,
									I0 : I0,
									I0Stdev : I0Stdev,
									rgGnom : rgGnom,
									total : total,
									dmax : dmax,
									volumePorod : volumePorod,
									mmvolest : mmvolest,
									scattering : scattering,
									kratky : kratky,
									density : density,
									guinier : guinier,
									imgWidth : _this.imgWidth,
                                    creationDate : currentDataCollection[0].creationDate
								};

                dust.render("queue.grid.test.template", templateData, function(err, out) {                                                                       
                    html = html + out;
                });
                
                return html;

            }
        }
    ];

    return columns;
};