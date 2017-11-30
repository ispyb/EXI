/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class MXDataCollectionGrid
* @constructor
*/
function EMDataCollectionGrid(args) {
    this.id = BUI.id();
    this.template = "emdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

EMDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
//EMDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
EMDataCollectionGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;
EMDataCollectionGrid.prototype.parseEMData = DataCollectionGrid.prototype.parseEMData;

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
EMDataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
        
        var _this = this;
        this.dataCollectionGroup = dataCollectionGroup;
        this.store.loadData(dataCollectionGroup);
        //this.loadMagnifiers(dataCollectionGroup);
        //this.attachCallBackAfterRender();


       

    }
    catch(e){
        console.log(e);
    }
};

EMDataCollectionGrid.prototype.getPanel = function(){
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,  
        padding : 10,              
        id: this.id, 
        store : this.store,       
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        }
       
    });  
    return this.panel;
};

 /*dust.render('tmpl/hello', { world: "Jupiter" }, function(err, out) {
        // dust will call `require(['tmpl/hello'])` since that template isn't loaded yet
      });
*/

/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
EMDataCollectionGrid.prototype.attachCallBackAfterRender = function() {
    
    var _this = this;                              

    var nodeWithScroll = document.getElementById(document.getElementById(_this.id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
    var lazy = {
            bind: 'event',
            /** !!IMPORTANT this is the parent node which contains the scroll **/
            appendScroll: nodeWithScroll,
            beforeLoad: function(element) {
                console.log('image "' + (element.data('src')) + '" is about to be loaded');
               
            },           
            onFinishedAll: function() {
                EXI.mainStatusBar.showReady();
            }
    };
       
    var timer1 = setTimeout(function() {  $('.img-responsive').lazy(lazy);}, 500);
    var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500); 
    
    var tabsEvents = function(grid) {
            this.grid = grid;
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href"); 
                if (target){                  
                }
            });
            _this.panel.doLayout();

    };
    var timer3 = setTimeout(tabsEvents, 500, _this);
   
};

/**
* Opens a modal to edit a comment
* @method editComments
* @param Integer id The id
* @param String mode To edit the dataCollection comment use DATACOLLECTION and to edit the dataCollectionGroup comment use DATACOLLECTIONGROUP
*/
EMDataCollectionGrid.prototype.editComments = function (id,mode) {
    var comment = $("#comments_" + id).html().trim();
    var commentEditForm = new CommentEditForm({mode : mode});
    commentEditForm.onSave.attach(function(sender,comment) {
        $("#comments_" + id).html(comment);
    });
    commentEditForm.load(id,comment);
    commentEditForm.show();
};

EMDataCollectionGrid.prototype.getColumns = function() {
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
                    debugger                                                                  
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
