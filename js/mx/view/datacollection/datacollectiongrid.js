function DataCollectionGrid(args) {

    this.store = Ext.create('Ext.data.Store', {
            fields: ["dataCollectionGroup"]
        });

    if (args) {
        if (args.mxDataCollectionGrid) {
            this.mxDataCollectionGrid = args.mxDataCollectionGrid;
        }
    }
}
    
/**
* Parses statistics and return the best one
*
* @method _getAutoprocessingStatistics
* @param {Object} data Record with all the information that it is stored in the store
* @return {Object} return all statistics sorted by best values
*/
DataCollectionGrid.prototype._getAutoprocessingStatistics = function(data) {
    /** This converts and array of comma separated value in a array */
    function getArrayValues(value) {
        /** It splits every value */
        return _.map(_.trim(value).split(","), function(singleValue) { return _.trim(singleValue); });
    }

    var autoProc_spaceGroups = getArrayValues(data.AutoProc_spaceGroups);
    var autoProcIds = getArrayValues(data.autoProcIds);
    var completenessList = getArrayValues(data.completenessList);
    var resolutionsLimitHigh = getArrayValues(data.resolutionsLimitHigh);
    var resolutionsLimitLow = getArrayValues(data.resolutionsLimitLow);
    var scalingStatisticsTypes = getArrayValues(data.scalingStatisticsTypes);
    var rMerges = getArrayValues(data.rMerges);
    var cell_a = getArrayValues(data.Autoprocessing_cell_a);
    var cell_b = getArrayValues(data.Autoprocessing_cell_b);
    var cell_c = getArrayValues(data.Autoprocessing_cell_c);

    var cell_alpha = getArrayValues(data.Autoprocessing_cell_alpha);
    var cell_beta = getArrayValues(data.Autoprocessing_cell_beta);
    var cell_gamma = getArrayValues(data.Autoprocessing_cell_gamma);

    data = {};
    /** Returning if no autoprocs */
    if (autoProcIds) {
        if (autoProcIds[0] == "") {
            return [];
        }
    }
    for (var i = 0; i < autoProcIds.length; i++) {
        if (data[autoProcIds[i]] == null) {
            data[autoProcIds[i]] = {
                autoProcId: autoProcIds[i],
                spaceGroup: autoProc_spaceGroups[i]
            };
        }

        data[autoProcIds[i]][scalingStatisticsTypes[i]] = ({
            autoProcId: autoProcIds[i],
            scalingStatisticsType: scalingStatisticsTypes[i],
            completeness: Number(completenessList[i]).toFixed(0),
            resolutionsLimitHigh: Number(resolutionsLimitHigh[i]).toFixed(1),
            resolutionsLimitLow: Number(resolutionsLimitLow[i]).toFixed(1),
            rMerge: Number(rMerges[i]).toFixed(1),
            spaceGroup: autoProc_spaceGroups[i],
            cell_a: cell_a[i],
            cell_b: cell_b[i],
            cell_c: cell_c[i],
            cell_alpha: cell_alpha[i],
            cell_beta: cell_beta[i],
            cell_gamma: cell_gamma[i]

        });

    }

    /** Convert from map to array */
    var ids = _.map(data, 'autoProcId');
    var result = [];
    for ( i = 0; i < ids.length; i++) {
        result.push(data[ids[i]]);
    }

    function sortByBest(a, b) {
        var spaceGroupA = a.spaceGroup.replace(/\s/g, "");
        var spaceGroupB = b.spaceGroup.replace(/\s/g, "");              
        return (_.indexOf(ExtISPyB.spaceGroups, spaceGroupA) > _.indexOf(ExtISPyB.spaceGroups, spaceGroupB));
    }

    var sorted = result.sort(sortByBest).reverse();    
    /** Add new attribute for ranking order */
    for ( i = 0; i < sorted.length; i++) {
        sorted[i]["rank"] = i + 1;
    }

    return sorted;
};



DataCollectionGrid.prototype.getColumns = function() {
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

                /** For thumbnail */
                data.urlThumbnail = EXI.getDataAdapter().mx.dataCollection.getThumbNailById(data.lastImageId);
                data.url = EXI.getDataAdapter().mx.dataCollection.getImageById(data.lastImageId);
                data.ref = '#/mx/beamlineparameter/datacollection/' + data.DataCollection_dataCollectionId + '/main';
                data.runNumber = data.DataCollection_dataCollectionNumber;
                data.prefix = data.DataCollection_imagePrefix;
                data.comments = data.DataCollectionGroup_comments;
                data.sample = data.BLSample_name;
                data.folder = data.DataCollection_imageDirectory;

                
                try{
                    if (data.autoProcIntegrationId){                        
                        data.resultsCount = _.uniq(data.autoProcIntegrationId.replace(/ /g,'').split(",")).length;
                    }
                }
                catch(e){}
                /** For Phasing */
                
                if (data.phasingStepType) {
                    var phasingSteps = data.phasingStepType.split(",");
                    data.phasingStepLength = phasingSteps.length;
                
                }
                
                /** For crystal */
                data.xtal1 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 1);
                data.xtal2 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 2);
                data.xtal3 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 3);
                data.xtal4 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 4);

                /** Image quality indicator **/
                data.indicator = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(record.data.DataCollection_dataCollectionId);              
                data.onlineresults = _this._getAutoprocessingStatistics(record.data);
                
                /** We dont show screen if there are results of autoprocessing */
                data.isScreeningVisible = true;
                if (data.onlineresults){
                    if (data.onlineresults.length > 0){
                        data.isScreeningVisible = false;
                    }                    
                }
                /** For the workflows **/
                if (record.data.WorkflowStep_workflowStepType) {
                    data.workflows = new WorkflowSectionDataCollection().parseWorkflow(record.data);
                }
                if (data.workflows == null) {
                    data.workflows = [];
                }
             
                dust.render(_this.template, data, function(err, out) {                                                                       
                    html = html + out;
                });
                
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