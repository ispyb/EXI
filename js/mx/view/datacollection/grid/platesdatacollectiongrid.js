/**
* Displays the plates of the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function PlatesDataCollectionGrid(args) {
    DataCollectionGrid.call(this,args);
}

PlatesDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;


PlatesDataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,               
        columns: this.getColumns(),      
        listeners: {
            viewready: function() {             
            }
        }
    });
    return this.panel;
}

PlatesDataCollectionGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var data = record.data;                              
                var html = "";

                if (data.autoProcIntegrationId){
                    data.resultsCount = _.uniq(data.autoProcIntegrationId.replace(/ /g,'').split(",")).length;
                }
                
                dust.render("plates.mxdatacollectiongrid.template", data, function(err, out) {                                                                       
                    html = html + out;
                }); 
                
                var onSuccess = function (sender, samples) {
                    if (samples){
                        var cells = {};
                        for (var i = 0; i < samples.length; i++) {
                            var sample = samples[i];
                            var selected = false;
                            if (!_.isEmpty(pucks[sample.Container_containerId].initSelected)){
                                selected = pucks[sample.Container_containerId].initSelected.includes(sample.BLSample_location);
                            }
                            var dataCollectionIds = pucks[sample.Container_containerId].dataCollectionIds[sample.BLSample_location];
                            var state = "FILLED";
                            if (dataCollectionIds != null && dataCollectionIds.length > 0){
                                state = "COLLECTED";
                            }
                            // Parse data
                            if (cells[sample.Container_containerId] == null){
                                cells[sample.Container_containerId] = [];
                            }
                            
                            cells[sample.Container_containerId].push({
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
                            });
                        }
                        
                        for (containerId in pucks){
                            pucks[containerId].load(cells[containerId]);
                            var infoHtml = "";
                            
                            dust.render("plates.info.mxdatacollectiongrid.template", cells[containerId][0], function(err, out) {                                                                       
                                infoHtml = infoHtml + out;
                            }); 
                            
                            $("#puck-panel-" + containerId + "-info").html(infoHtml);
                        }
                    }
                };
                
                if (data.containerIds.length > 0){
                    var pucksPanelHeight = 300;
                    var pucks = {};
                    var tree = $("<div ><div id='a' style='height:" + (pucksPanelHeight)+"px;'>" + html + "</div></div>");
                    for (id in data.containerIds){
                        var containerIdNumber = Number(data.containerIds[id]);
                        var container = _.filter(_this.mxDataCollectionGrid.dataCollectionGroup,{"Container_containerId" : containerIdNumber});
                        
                        if(container){
                            var dataCollectionIds = {};
                            for (var i = 1 ; i <= container[0].Container_capacity ; i++) {
                                var sampleByLocation = _.filter(container,{"BLSample_location":i.toString()});
                                if (sampleByLocation.length > 0) {
                                    var ids = [];
                                    for (sample in sampleByLocation){
                                        ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                                    }
                                    dataCollectionIds[i] = ids.toString();
                                }
                            }
                            
                            pucks[containerIdNumber] = new UniPuckWidget({mainRadius : pucksPanelHeight/4, 
                                                                        enableMouseOver : true, 
                                                                        enableClick : true, 
                                                                        containerId : containerIdNumber, 
                                                                        initSelected : data.selected[containerIdNumber],
                                                                        dataCollectionIds : dataCollectionIds
                                                                    });
                            if (container[0].Container_capacity == 10){
                                pucks[containerIdNumber] = new SpinePuckWidget({mainRadius :  pucksPanelHeight/4, 
                                                                                enableMouseOver : true, 
                                                                                enableClick : true, 
                                                                                containerId : containerIdNumber, 
                                                                                dataCollectionId : container.DataCollection_dataCollectionId, 
                                                                                initSelected : data.selected[containerIdNumber],
                                                                                dataCollectionIds : dataCollectionIds
                                                                            });
                            }
                            tree.find("#puck-panel-" + data.containerIds[id]).html(pucks[containerIdNumber].getPanel());
                        }
                    }
                    
                    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(data.containerIds);
                    html = tree.html();
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

PlatesDataCollectionGrid.prototype.reloadPlates = function(data, filtered) {
    var selected = {};
    if (filtered) {
        for (sample in data){
            if (selected[data[sample].Container_containerId] == null){
                selected[data[sample].Container_containerId] = [data[sample].BLSample_location];
            } else {
                selected[data[sample].Container_containerId].push(data[sample].BLSample_location);
            }
        }
    }
    
    var containerIds =_.filter(Object.keys(_.keyBy(data, "Container_containerId")), function(element){return isNumber(element);});                                                      
    this.mxDataCollectionGrid.reloadData([{containerIds : containerIds, selected : selected}]);
}