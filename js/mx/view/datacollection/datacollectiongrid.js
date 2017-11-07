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

    var autoProc_spaceGroups = getArrayValues(data.AutoProc_spaceGroups);
    var autoProcIds = getArrayValues(data.autoProcIds);
    var autoProcIntegrationIds = getArrayValues(data.autoProcIntegrationId);
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

    var anomalous = getArrayValues(data.Autoprocessing_anomalous);
    

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
                autoProcIntegrationId: autoProcIntegrationIds[i],
                spaceGroup: autoProc_spaceGroups[i],
                anomalous: anomalous[i]
            };
        }
        
        data[autoProcIds[i]][scalingStatisticsTypes[i]] = ({
            autoProcId: autoProcIds[i],
            scalingStatisticsType: scalingStatisticsTypes[i],
            completeness: Number(completenessList[i]),
            resolutionsLimitHigh: Number(resolutionsLimitHigh[i]),
            resolutionsLimitLow: Number(resolutionsLimitLow[i]),
            rMerge: Number(rMerges[i]),
            spaceGroup: autoProc_spaceGroups[i],
            cell_a: cell_a[i],
            cell_b: cell_b[i],
            cell_c: cell_c[i],
            cell_alpha: cell_alpha[i],
            cell_beta: cell_beta[i],
            cell_gamma: cell_gamma[i],
            anomalous : anomalous[i]

        });

    }
    
    /** Convert from map to array */
    var ids = _.map(data, 'autoProcId');
    var result = [];
    for ( i = 0; i < ids.length; i++) {
        result.push(data[ids[i]]);
    }
    /** Rank results when anomouls is 0 */
    
    return new AutoprocessingRanker().rank(_.filter(result, {anomalous : '0'}), "spaceGroup");  
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
xx
                /** DataCollectionGroup */
                debugger
                //data.xtalShapShot = EXI.getDataAdapter().mx.dataCollectionGroup.getXtalThumbnail(data.DataCollectionGroup_dataCollectionGroupId);

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
   if (data.DataCollectionGroup_experimentType == 'EM'){
        try{
            var moviesCount = [];
            var motionCorrectionsCount = [];
            var ctfsCount = [];
            
            if (data.movieCount){
                moviesCount = data.movieCount.split(",");
            }
             if (data.motionCorrectionCount){
                motionCorrectionsCount = data.motionCorrectionCount.split(",");
            }
            if (data.CTFCount){
                ctfsCount = data.CTFCount.split(",");
            }
           

            
             /** Parsing grid squares */
            for (var i = 0; i < parseFloat(data.numberOfGridSquares); i++){
                gridSquares.push({
                    name : i,
                    movieCount : moviesCount[i],
                    motionCorrectionCount : motionCorrectionsCount[i],
                    ctfCount : ctfsCount[i],
                    DataCollection_dataCollectionId : data.DataCollection_dataCollectionId

                });
            }

        }
        catch(e){
           console.log(e);
        }
   }
   data.gridSquares = gridSquares;   
   return data;
};