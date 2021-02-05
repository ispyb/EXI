/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class MXDataCollectionGrid
* @constructor
*/
function UncollapsedDataCollectionGrid(args) {
    this.id = BUI.id();
    this.template = "mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

UncollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
UncollapsedDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
UncollapsedDataCollectionGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;
UncollapsedDataCollectionGrid.prototype.parseEMData = DataCollectionGrid.prototype.parseEMData;
UncollapsedDataCollectionGrid.prototype.getArray = DataCollectionGrid.prototype.getArray;

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
UncollapsedDataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
        
        var _this = this;
        this.dataCollectionGroup = dataCollectionGroup;
        this.store.loadData(dataCollectionGroup);
        this.loadMagnifiers(dataCollectionGroup);
        this.attachCallBackAfterRender();
    }
    catch(e){
        console.log(e);
    }
};

UncollapsedDataCollectionGrid.prototype.getPanel = function(){
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,  
        id: this.id,     
        minHeight : 900,
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
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
UncollapsedDataCollectionGrid.prototype.displayDataCollectionTab = function(target, dataCollectionGroupId) {
    var _this = this;
    var onSuccess = function(sender, data){
       
        _.forEach(data, function(value) {
            // URL to image quality indicators
            value.showQILink = true;
            if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
                value.urlImageQualityIndicators = "../images/white_square.png";
                value.showQILink = false;
            }else {
                value.urlImageQualityIndicators = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(value.dataCollectionId);
            }

            // Result from auto-processing>                     
            
            value.onlineresults = UncollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics(value);
            if (value.onlineresults && value.onlineresults.length > 0){
                value.bestAutoprocIntegrationId = value.onlineresults[0].autoProcIntegrationId;
            }
            // Re-formatted template
            if (value.fileTemplate.endsWith(".h5")) {
                // Check if characterisation
                if (Math.abs(value.overlap) > 1) {
                    value.formattedFileTemplate = value.fileTemplate.replace("%04d", "?_master");
                } else {
                    value.formattedFileTemplate = value.fileTemplate.replace("%04d", "1_master");
                };
            } else {
                value.formattedFileTemplate = value.fileTemplate.replace("%04d", "????");
            };
            // Multiply ccHalf values by 100
            if (value.onlineresults.length > 0) {
                if (value.onlineresults[0].innerShell) {
                    value.onlineresults[0].innerShell.ccHalf = value.onlineresults[0].innerShell.ccHalf * 100;
                } else {
                	value.onlineresults[0].innerShell.ccHalf = 0
                }
                if (value.onlineresults[0].outerShell) {
                    value.onlineresults[0].outerShell.ccHalf = value.onlineresults[0].outerShell.ccHalf * 100;
                } else {
                	value.onlineresults[0].outerShell.ccHalf = 0
                }
                if (value.onlineresults[0].overall) {
                    value.onlineresults[0].overall.ccHalf = value.onlineresults[0].overall.ccHalf * 100;
                } else {
                	value.onlineresults[0].overall.ccHalf = 0
                }
            }
        });
        var html = "";
        
        dust.render("datacollections.mxdatacollectiongrid.template", data, function(err, out) {                                                                                               
            html = html + out;
        });
        $(target).html(html);
        $(".dataCollection-edit").unbind('click').click(function(sender){
            var dataCollectionId = sender.target.id.split("-")[0];
            _this.editComments(dataCollectionId,"DATACOLLECTION");
        });
        _this.panel.doLayout();
    };
    
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };
    /** Retrieve data collections */   
    EXI.getDataAdapter({onSuccess:onSuccess, onError:onError}).mx.dataCollection.getDataCollectionsByDataCollectionGroupId(dataCollectionGroupId);
};

/**
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
UncollapsedDataCollectionGrid.prototype.displayResultAutoprocessingTab = function(target, dataCollectionId) {
    var _this = this;
    var onSuccess = function(sender, data){            
        /** Parsing data */
        var html = "";    
         
        var autoprocessingData =  new AutoProcIntegrationGrid().parseData(data[0]);
        
        dust.render("collapsed.autoprocintegrationgrid.template", autoprocessingData, function(err, out) {            
                    html = html + out;
        });
        $(target).html(html);

        //_this.panel.doLayout();
        $(".autoprocintegrationrow").addClass("clickable-row");
        $(".autoprocintegrationrow").click(function(sender) {
            
            if (_.indexOf(sender.target.classList,"glyphicon-folder-close") > 0) {
                    var autoprocProgramId = sender.target.id.split("_")[1];
                    var selectedProcessingProgram = _.find(autoprocessingData, {'v_datacollection_summary_phasing_autoProcProgramId':Number(autoprocProgramId)});
                    
                    var panel = Ext.create('Ext.window.Window', {
                        title : selectedProcessingProgram.v_datacollection_processingPrograms + " [" + selectedProcessingProgram.v_datacollection_summary_phasing_autoproc_space_group + "]",
                        height : 450,
                        width : 600,
                        modal : true,
                        layout : 'fit',
                        items : [ {
                                html : '<div id="' + autoprocProgramId + '">Test</div>',
                                margin : 10

                        } ],
                        buttons : [ {
                                text : 'Close',
                                handler : function() {
                                    window.close();
                                }
                            } ]
                    }).show();

                    var onSucessFiles = function(sender, files){  
                        var html = "";                       
                         dust.render("files.collapsed.autoprocintegrationgrid.template", files[0], function(err, out) {
                                html = html + out;
                         });
                          $("#" + autoprocProgramId).html(html);  
                    };                 

                    EXI.getDataAdapter({onSuccess : onSucessFiles}).mx.autoproc.getAttachmentListByautoProcProgramsIdList([autoprocProgramId])
                  
            }

            // Check if the click is not on the download button
            /*if (_.indexOf(sender.target.classList,"glyphicon-download") < 0) {
                var dataCollectionId = sender.currentTarget.id.split("-")[0];
                var autoProcIntegrationId = sender.currentTarget.id.split("-")[1];
                window.open('#/autoprocintegration/datacollection/' + dataCollectionId + '/autoprocIntegration/' + autoProcIntegrationId + '/main',"_blank");
            }*/
            
             

        });
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);  
};

/**
* Displays the data workflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayWorkflowsTab = function(target, dataCollectionId) {
   var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
   var _this = this;
    if (dc){
        var html = "";
        var items = (new WorkflowSectionDataCollection().parseWorkflow(dc));
        var workflowId = dc.Workflow_workflowId;
        var workflowLogUrl = EXI.getDataAdapter().mx.workflow.getWorkflowLogUrl(dc.Workflow_workflowId);
        _.map(items, function(item){item.workflowId = workflowId;});
        dust.render("workflows.mxdatacollectiongrid.template",  {items : items, dataCollectionId : dataCollectionId, workflowId : workflowId, workflowLogUrl : workflowLogUrl}, function(err, out) {
                        html = html + out;
        });
        $(target).html(html);
        _this.panel.doLayout();
    }   
};

/**
* Displays the phasing tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @param {String} PhasingStep_method [SAD | MR ] 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayPhasingTab = function(target, dataCollectionGroupId, PhasingStep_method) {
    var phasingGridView = new PhasingGridView();    
    phasingGridView.load(dataCollectionGroupId,PhasingStep_method);
    phasingGridView.printHTML(target);

};

/**
* Displays the sample tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displaySampleTab
*/
UncollapsedDataCollectionGrid.prototype.displaySampleTab = function(target, dataCollectionId) {                 
    var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
    if (dc){
        /** Loading crystal snapshots within the DIV with id = sa_{.DataCollection_dataCollectionId}_crystal_snapshots */
         //{>"crystalsnapshots.sample.mxdatacollectiongrid.template"  /}  
         console.log(dc);
         var crystalSnapShotDIV = "sa_" + dataCollectionId + "_crystal_snapshots";
         if ($("#" + crystalSnapShotDIV)){
            var html = "";
            dc.showXtal2 = 1;
            dc.showXtal3 = 1;
            dc.showXtal4 = 1;
            if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
                if (dc.DataCollection_xtalSnapshotFullPath2 == null){
                    dc.showXtal2 = 0;
                }
                if (dc.DataCollection_xtalSnapshotFullPath3 == null){
                    dc.showXtal3 = 0;
                }
                if (dc.DataCollection_xtalSnapshotFullPath4 == null){
                    dc.showXtal4 = 0;
                }
            }
            dust.render("crystalsnapshots.sample.mxdatacollectiongrid.template",  dc, function(err, out) {
                        html = html + out;
            });
            $("#" + crystalSnapShotDIV).html(html);    
         }

        if ($("#sample_puck_layout_" +dataCollectionId)){
            if (dc.Container_containerId){
                var containers =_.filter(grid.dataCollectionGroup, {"Container_containerId":Number(dc.Container_containerId)});
                if(containers){
                    var dataCollectionIds = {};
                    for (var i = 1 ; i <= containers[0].Container_capacity ; i++) {
                        var sampleByLocation = _.filter(containers,{"BLSample_location":i.toString()});
                        if (sampleByLocation.length > 0) {
                            var ids = [];
                            for (sample in sampleByLocation){
                                ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                            }
                            dataCollectionIds[i] = ids.toString();
                        }
                    }
                }
                var attributesContainerWidget = {
                                                mainRadius : 100, 
                                                enableMouseOver : false, 
                                                enableClick : false,
                                                dataCollectionIds : dataCollectionIds
                };

                var puckLegend = new PuckLegend();

                $("#sample_puck_legend_" + dataCollectionId).html(puckLegend.getPanel().html);
                
                var onSuccess = function(sender, samples){
                    if (samples){
                        var puck = new UniPuckWidget(attributesContainerWidget);
                        if (dc.Container_capacity == 10){
                            puck = new SpinePuckWidget(attributesContainerWidget);
                        }
                        var locations = _.map(samples,"BLSample_location").map(function (i) {return parseInt(i)});
                        var maxLocation = _.max(locations);
                        if (maxLocation) {
                            if (maxLocation > 10) {
                                puck = new UniPuckWidget(attributesContainerWidget);
                            } else {
                                puck = new SpinePuckWidget(attributesContainerWidget);
                            }
                        }
                        $("#sample_puck_layout_" + dataCollectionId).html(puck.getPanel().html);
                        puck.loadSamples(samples,dc.BLSample_location);
                    }
                };
                
                EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(dc.Container_containerId);
            }
        }
    }
};

/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
UncollapsedDataCollectionGrid.prototype.attachCallBackAfterRender = function() {
    
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
                    /** Activate tab of data collections */
                    if (target.startsWith("#dc")){
                    var dataCollectionGroupId = target.slice(4);
                    _this.displayDataCollectionTab(target, dataCollectionGroupId);
                    }
                    
                    if (target.startsWith("#re")){
                        var dataCollectionId = target.slice(4);  
                        _this.displayResultAutoprocessingTab(target, dataCollectionId);                                       
                    }

                    if (target.startsWith("#sa")){                    
                        var dataCollectionId = target.slice(4);                        
                        _this.displaySampleTab(target, dataCollectionId);                   
                    }
                    
                    if (target.startsWith("#wf")){      
                        var dataCollectionId = target.slice(4);
                        _this.displayWorkflowsTab(target, dataCollectionId);              
                    
                    }
                    
                    if (target.startsWith("#ph")){                           
                        var dataCollectionGroupId = target.slice(4);
                        _this.displayPhasingTab(target, dataCollectionGroupId, 'SAD');              
                    }

                      if (target.startsWith("#mr")){                           
                        var dataCollectionGroupId = target.slice(4);                        
                        _this.displayPhasingTab(target, dataCollectionGroupId, 'MR'); 
                    }
                }
            });
            _this.panel.doLayout();

    };
    var timer3 = setTimeout(tabsEvents, 500, _this);

    var movieEvents = function(grid) {
        $(".animatedXtal").mouseover(function() {               
            this.src=_this.imageAnimatedURL[this.src]}
        );
        $(".animatedXtal").mouseout(function() {
            this.src=_this.imageAnimatedURL[this.src]}
        );
       $(".dataCollectionGroup-edit").click(function(sender){
            var dataCollectionGroupId = sender.target.id.split("-")[0];
            _this.editComments(dataCollectionGroupId,"DATACOLLECTIONGROUP");
        });
    };
    
    var timer4 = setTimeout(movieEvents, 500, _this);
};

/**
* Opens a modal to edit a comment
* @method editComments
* @param Integer id The id
* @param String mode To edit the dataCollection comment use DATACOLLECTION and to edit the dataCollectionGroup comment use DATACOLLECTIONGROUP
*/
UncollapsedDataCollectionGrid.prototype.editComments = function (id,mode) {
    var comment = $("#comments_" + id).html().trim();
    var commentEditForm = new CommentEditForm({mode : mode});
    commentEditForm.onSave.attach(function(sender,comment) {
        $("#comments_" + id).html(comment);
    });
    commentEditForm.load(id,comment);
    commentEditForm.show();
};