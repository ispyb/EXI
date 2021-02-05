function DataCollectionGrid(args) {

    /** HashMap to store the image snapshot and its animated equivalent image gif **/
    this.imageAnimatedURL = {};
    
    this.store = Ext.create('Ext.data.Store', {
            fields: ["dataCollectionGroup"]
     });
}
    
/**
* By using Jquery sets lazy loading of the thumbnails
*
* @method loadMagnifiers
* @return {dataCollectionGroup} Array of data collections
*/
DataCollectionGrid.prototype.loadMagnifiers = function(dataCollectionGroup){
     for (var i = 0; i < dataCollectionGroup.length; i++) {
            var elementId = dataCollectionGroup[i].DataCollection_dataCollectionId + "_thumb";
            $('#' + elementId).Lazy();
     }

     
    if (this.onBoxReady) {
        this.onBoxReady();
    }
};

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
DataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{        
        
        this.store.loadData(dataCollectionGroup);
        this.loadMagnifiers(dataCollectionGroup);
    }
    catch(e){
        console.log(e);
    }
};

DataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    this.panel = Ext.create('Ext.grid.Panel', {
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

    /** This will allow us to check if pipelines has statistics. Failed, running will not have statistics */
    var autoProcIntegrationIds = getArrayValues(data.autoProcIntegrationId);
    var anomalous = getArrayValues(data.Autoprocessing_anomalous);        
    var processingStatus = getArrayValues(data.processingStatus);
    /** These arrays only will get value if there are statistics it means they did not failed */
    var autoProc_spaceGroups = getArrayValues(data.AutoProc_spaceGroups);
    var autoProcIds = getArrayValues(data.autoProcIds);
    var completenessList = getArrayValues(data.completenessList);
    var resolutionsLimitHigh = getArrayValues(data.resolutionsLimitHigh);
    var resolutionsLimitLow = getArrayValues(data.resolutionsLimitLow);
    var scalingStatisticsTypes = getArrayValues(data.scalingStatisticsTypes);
    var rMerges = getArrayValues(data.rMerges);
    var meanIOverSigIList = getArrayValues(data.meanIOverSigIList);
    var ccHalfList = getArrayValues(data.ccHalfList);
    var cell_a = getArrayValues(data.Autoprocessing_cell_a);
    var cell_b = getArrayValues(data.Autoprocessing_cell_b);
    var cell_c = getArrayValues(data.Autoprocessing_cell_c);

    var cell_alpha = getArrayValues(data.Autoprocessing_cell_alpha);
    var cell_beta = getArrayValues(data.Autoprocessing_cell_beta);
    var cell_gamma = getArrayValues(data.Autoprocessing_cell_gamma);

   
    var parsed = {};
    /** Returning if no autoprocs */
    if (autoProcIds) {
        if (autoProcIds[0] == "") {
            return [];
        }
    }

    var nonSuccessProcessing = 0;
    /** We should skip all processing that are not success: it means failed or running */
    for (var i = 0; i < processingStatus.length; i++) {                  
        if (processingStatus[i] != "SUCCESS"){            
            nonSuccessProcessing = nonSuccessProcessing + 1;
        }
        else{
        var counter = i - nonSuccessProcessing;  
        if (parsed[autoProcIds[counter]] == null) {
            parsed[autoProcIds[counter]] = {
                autoProcId: autoProcIds[counter],
                autoProcIntegrationId: autoProcIntegrationIds[i],
                spaceGroup: autoProc_spaceGroups[counter],
                anomalous: anomalous[i],
                status :  processingStatus[i]

            };
        }
        
        parsed[autoProcIds[counter]][scalingStatisticsTypes[counter]] = ({
            autoProcId: autoProcIds[counter],
            scalingStatisticsType: scalingStatisticsTypes[counter],
            completeness: Number(completenessList[counter]),
            resolutionsLimitHigh: Number(resolutionsLimitHigh[counter]),
            resolutionsLimitLow: Number(resolutionsLimitLow[counter]),
            rMerge: Number(rMerges[counter]),
            meanIOverSigI: Number(meanIOverSigIList[counter]),
            ccHalf: Number(ccHalfList[counter]),
            spaceGroup: autoProc_spaceGroups[counter],
            cell_a: cell_a[counter],
            cell_b: cell_b[counter],
            cell_c: cell_c[counter],
            cell_alpha: cell_alpha[counter],
            cell_beta: cell_beta[counter],
            cell_gamma: cell_gamma[counter],
            anomalous : anomalous[counter]            
        });
        }
    }
    
    /** Convert from map to array */
    var ids = _.map(parsed, 'autoProcId');
    var result = [];
    for ( i = 0; i < ids.length; i++) {
        result.push(parsed[ids[i]]);
    }
    /** Rank results when anomalous is 0 */
    listResultsNoanom = new AutoprocessingRanker().rank(_.filter(result, {anomalous : '0'}), "spaceGroup");
    /** If no results, rank results when anomalous is 1 */
    if (listResultsNoanom.length == 0) {
        listResultsNoanom = new AutoprocessingRanker().rank(_.filter(result, {anomalous : '1'}), "spaceGroup");
    }
    return listResultsNoanom
    //return new AutoprocessingRanker().rank(result, "spaceGroup");  
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

                /** DataCollectionGroup */
                
                data.xtalShapShot = EXI.getDataAdapter().mx.dataCollectionGroup.getXtalThumbnail(data.DataCollectionGroup_dataCollectionGroupId);

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
                              
                
                /** For crystal */
                data.xtal1 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 1);
                data.xtal2 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 2);
                data.xtal3 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 3);
                data.xtal4 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 4);


                /** Image quality indicator **/
                data.indicator = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(record.data.DataCollection_dataCollectionId);                              

                /** Gets the gif for snapshots if there is a workflow with snapshots **/
                if (data.WorkflowStep_workflowStepType){
                    if (data.WorkflowStep_workflowStepType.indexOf('Snapshots') != -1){
                        if (data.WorkflowStep_workflowStepId){
                            var listOfIds = data.WorkflowStep_workflowStepId.split(',');
                            var listOfWorkflowStepType = data.WorkflowStep_workflowStepType.split(',');
                            data.xtalAnimated = EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(listOfIds[_.indexOf(listOfWorkflowStepType, 'Snapshots')]);
                            _this.imageAnimatedURL[data.xtal1] = data.xtalAnimated;
                            _this.imageAnimatedURL[data.xtalAnimated] = data.xtal1;
                            data.hasAnimated = true;
                        }
                        
                    }
                }
                
                data.onlineresults = _this._getAutoprocessingStatistics(record.data);
                /** Screening displayed if 'Characterization' workflow or if indexing success */ 
                if (data.Workflow_workflowType) {
                    if (data.Workflow_workflowType == 'Characterisation') {
                        data.screeningresults = [true];
                    } else {
                        data.screeningresults = [data.ScreeningOutput_indexingSuccess];
                    }
                    if (data.screeningresults[0]) {
                        if (data.ScreeningOutput_indexingSuccess) {
                            data.indexingresults = [true];
                        } else {
                            data.indexingresults = [false];
                        }
                    }
                }
               
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
                

                /** EM technique */                
                data = _this.parseEMData(record.data);
 
                
                dust.render(_this.template, data, function(err, out) {                                                                                           
                    html = html + out;
                });
                

                /** If EM data we need to retrieve the statistics separately for performance issues */



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

DataCollectionGrid.prototype.parseEMData =  function(data){
   var gridSquares = [];
   
   function getArray(data, key){
       if (data[key]){
           return data[key].split(",");
       }
       return [];
   }

   function getPercentrage(count, total){       
       try{
       if (count){
           if(total){
               return count/total*100;
           }
       }
       }
       catch(e){
       }
       return 0;
   }

   if (data.DataCollectionGroup_experimentType == 'EM'){
        try{            
            
            var moviesCount = getArray(data, "movieCount");
            var motionCorrectionsCount = getArray(data, "motionCorrectionCount");
            var motionCorrectionDataCollectionIds = getArray(data, "motionCorrectionDataCollectionIds");
            var ctfsCount = getArray(data, "CTFCount");        
            var ctfDataCollectionIds = getArray(data, "CTFdataCollectionIds");            
            var imageDirectoryList = getArray(data, "imageDirectoryList");
            var startTimeList = getArray(data, "startTimeList");
            var magnificationList = getArray(data, "magnificationList");
            var voltageList = getArray(data, "voltageList");
            var dataCollectionList = getArray(data, "dataCollectionIdList");       
                                                    

            function getMotionCorrectionByDataCollectionId(dataCollectionId, counts, ids ){                                
                var index = _.findIndex(ids, function(o) { return o == dataCollectionId });
                if (index > -1){
                    return counts[index];
                }
                return 0;
            }
            
             /** Parsing grid squares */
            for (var i = 0; i < parseFloat(data.numberOfGridSquares); i++){
                var stats = _.find(data.stats, function(o){return o.dataCollectionId == dataCollectionList[i]});
                var motionCount =  "";
                var ctfCount =  "";   
                var movieCount =  "";           
                if (stats){
                    var motionCount =  stats.motionCorrectionCount;
                    var ctfCount =  stats.ctfCorrectionCount;   
                    var movieCount =  stats.movieCount;           
                }
                gridSquares.push({
                    name : i + 1,
                    movieCount :movieCount,
                    motionCorrectionCount : motionCount,
                    ctfCount : ctfCount,
                    dataCollectionId : dataCollectionList[i],
                    snapshot : EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(dataCollectionList[i], 1),
                    imageDirectory : imageDirectoryList[i],
                    magnification : magnificationList[i],
                    voltage : voltageList[i],
                    startTime : startTimeList[i],
                    motionPercentage : getPercentrage(motionCount, movieCount),
                    ctfPercentage : getPercentrage(ctfCount, movieCount)

                });

        
            }
             
        }
        catch(e){
           console.log(e);
        }
   }
   
   data.gridSquares = gridSquares.reverse();   
   return data;
};
