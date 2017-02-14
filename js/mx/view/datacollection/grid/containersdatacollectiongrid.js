/**
* Displays the containers of the data collections by session or acronym of the protein
*
* @class ContainersDataCollectionGrid
* @constructor
*/
function ContainersDataCollectionGrid(args) {
    this.legend = new PuckLegend({width : 300, height : 50, cy : "12.5%", tOffset : "17%"});
}

ContainersDataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
            fields: ["dataCollectionGroup"]
    });
        
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,            
        columns: this.getColumns(),
        disableSelection: true,
        viewConfig : {
            trackOver : false
        }
    });

    this.container = Ext.create('Ext.panel.Panel', {
        items : [
                this.legend.getPanel(),
                this.panel]
    });


    return this.container;
};

ContainersDataCollectionGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var data = record.data;  
                var nContainers = data.containerIds.length;

                var html = "";          
                
                dust.render("containers.mxdatacollectiongrid.template", data, function(err, out) {                                                                       
                    html = html + out;
                }); 
                
                if (data.containerIds.length > 0){
                    var pucksPanelHeight = 300;
                    var dataCollectionIdsPerContainer = {};
                    // var pucks = {};

                    var tree = $("<div ><div id='a' style='display: block;overflow-y: scroll;height:" + (2*pucksPanelHeight)+"px;'>" + html + "</div></div>");
                    
                    for (var i=0 ; i < data.containerIds.length ; i++){
                        var containerIdNumber = Number(data.containerIds[i]);
                        var containers = _.filter(_this.dataCollectionGroup,{"Container_containerId" : containerIdNumber});
                        
                        if(containers){
                            var dataCollectionIds = {};
                            for (var j = 1 ; j <= containers[0].Container_capacity ; j++) {
                                var sampleByLocation = _.filter(containers,{"BLSample_location":j.toString()});
                                if (sampleByLocation.length > 0) {
                                    var ids = [];
                                    for (sample in sampleByLocation){
                                        ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                                    }
                                    dataCollectionIds[j] = ids.toString();
                                }
                            }
                            dataCollectionIdsPerContainer[data.containerIds[i]] = dataCollectionIds;
                        }
                    }

                    var onSuccess = function (sender, samples) {
                        if (samples) {
                            for (var i = 0 ; i < data.containerIds.length ; i++) {
                                var containerId = Number(data.containerIds[i]);
                                var currentSamples = _.filter(samples,{"Container_containerId":containerId});
                                var attributesContainerWidget = {
                                                                    mainRadius          : pucksPanelHeight/4, 
                                                                    enableMouseOver     : true, 
                                                                    enableClick         : true, 
                                                                    containerId         : containerId, 
                                                                    initSelected        : data.selected[containerId],
                                                                    dataCollectionIds   : dataCollectionIdsPerContainer[containerId]
                                                                }
                                var locations = _.map(currentSamples,"BLSample_location").map(function (i) {return parseInt(i)});
                                var maxLocation = _.max(locations);
                                var puck = new SpinePuckWidget(attributesContainerWidget);
                                if (maxLocation != null && maxLocation > 10) {
                                    puck = new UniPuckWidget(attributesContainerWidget);
                                }
                                $("#puck-panel-" + containerId).html(puck.getPanel().html);
                                /**Parsing the samples */
                                cells = [];
                                for (var j=0 ; j < currentSamples.length ; j++) {
                                    var sample = currentSamples[j];
                                    var selected = false;
                                    if (!_.isEmpty(attributesContainerWidget.initSelected)){
                                        selected = attributesContainerWidget.initSelected.includes(sample.BLSample_location);
                                    }
                                    var dataCollectionIds = puck.dataCollectionIds[sample.BLSample_location];
                                    var state = "FILLED";
                                    if (dataCollectionIds != null && dataCollectionIds.length > 0){
                                        state = "COLLECTED";
                                    }
                                    cells.push(
                                            {
                                                location : sample.BLSample_location,
                                                state : state,
                                                selected : selected,
                                                sample_name : sample.BLSample_name,
                                                protein_acronym : sample.Protein_acronym,
                                                protein_name : sample.Protein_name,
                                                containerId : sample.Container_containerId,
                                                container_code : sample.Container_code,
                                                dewarId : sample.Dewar_dewarId,
                                                dataCollectionIds : dataCollectionIds
                                            }
                                    );
                                    puck.load(cells);

                                    var infoHtml = "";
                                
                                    dust.render("containers.info.mxdatacollectiongrid.template", cells[0], function(err, out) {                                                                       
                                        infoHtml = infoHtml + out;
                                    }); 
                                    
                                    $("#puck-panel-" + containerId + "-info").html(infoHtml);
                                }
                            }
                        }
                        
                        // if (samples){
                        //     var cells = {};
                        //     for (var i = 0; i < samples.length; i++) {
                        //         var sample = samples[i];
                        //         var selected = false;
                        //         if (!_.isEmpty(pucks[sample.Container_containerId].initSelected)){
                        //             selected = pucks[sample.Container_containerId].initSelected.includes(sample.BLSample_location);
                        //         }
                        //         var dataCollectionIds = pucks[sample.Container_containerId].dataCollectionIds[sample.BLSample_location];
                        //         var state = "FILLED";
                        //         if (dataCollectionIds != null && dataCollectionIds.length > 0){
                        //             state = "COLLECTED";
                        //         }
                        //         // Parse data
                        //         if (cells[sample.Container_containerId] == null){
                        //             cells[sample.Container_containerId] = [];
                        //         }
                                
                        //         cells[sample.Container_containerId].push({
                        //             location : sample.BLSample_location,
                        //             state : state,
                        //             selected : selected,
                        //             sample_name : sample.BLSample_name,
                        //             protein_acronym : sample.Protein_acronym,
                        //             protein_name : sample.Protein_name,
                        //             containerId : sample.Container_containerId,
                        //             container_code : sample.Container_code,
                        //             dewarId : sample.Dewar_dewarId,
                        //             dataCollectionIds : dataCollectionIds
                        //         });
                        //     }
                            
                        //     for (containerId in pucks){
                        //         pucks[containerId].load(cells[containerId]);
                        //         var infoHtml = "";
                                
                        //         dust.render("containers.info.mxdatacollectiongrid.template", cells[containerId][0], function(err, out) {                                                                       
                        //             infoHtml = infoHtml + out;
                        //         }); 
                                
                        //         $("#puck-panel-" + containerId + "-info").html(infoHtml);
                        //     }
                        // }
                    };
                    html = tree.html();
                    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(data.containerIds);
                    
                };

                return html;
            }
        },
        {
            header: 'IDs',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: true,
            renderer: function(grid, e, record) {
                var html = "";
                dust.render("ids.mxdatacollectiongrid.template", record.data, function(err, out) {
                    html = out;
                });
                return html;

            }
        }
    ];
    return columns;
};

ContainersDataCollectionGrid.prototype.select = function(selectedDataCollectionGroup) {      
    var selected = {};   
    for (sample in selectedDataCollectionGroup){
        if (selected[selectedDataCollectionGroup[sample].Container_containerId] == null){
            selected[selectedDataCollectionGroup[sample].Container_containerId] = [selectedDataCollectionGroup[sample].BLSample_location];
        } else {
            selected[selectedDataCollectionGroup[sample].Container_containerId].push(selectedDataCollectionGroup[sample].BLSample_location);
        }
    }                                                                      
    this.store.loadData([{containerIds : this.getContainersId(this.dataCollectionGroup), selected : selected}]);
};

ContainersDataCollectionGrid.prototype.getContainersId = function(dataCollectionGroup) {         
   return _.filter(Object.keys(_.keyBy(dataCollectionGroup, "Container_containerId")), function(element){return isNumber(element);});                                                              
};

ContainersDataCollectionGrid.prototype.load = function(dataCollectionGroup) {
    this.dataCollectionGroup = dataCollectionGroup;    
    this.store.loadData([{containerIds:  this.getContainersId(this.dataCollectionGroup), selected :{}}]);
};
