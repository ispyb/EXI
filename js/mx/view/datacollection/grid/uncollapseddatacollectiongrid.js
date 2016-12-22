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

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
UncollapsedDataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
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
    var onSuccess = function(sender, data){
        var html = "";
        dust.render("datacollections.mxdatacollectiongrid.template", data, function(err, out) {                                                                                               
            html = html + out;
        });
        $(target).html(html);
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
    var onSuccess = function(sender, data){    
          
        /** Parsing data */
        var html = "";     
        dust.render("collapsed.autoprocintegrationgrid.template",  new AutoProcIntegrationGrid().parseData(data[0]), function(err, out) {
                    html = html + out;
        });
        $(target).html(html);        
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);  
};

/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayWorkflowsTab = function(target, dataCollectionId) {
   var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
    if (dc){
        var html = "";
        var items = (new WorkflowSectionDataCollection().parseWorkflow(dc));
        
        dust.render("workflows.mxdatacollectiongrid.template",  items, function(err, out) {
                        html = html + out;
        });
        $(target).html(html);
    }   
};


/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayPhasingTab = function(target, dataCollectionGroupId) {
  var onSuccess = function(sender, data){                       
        /** Parsing data */
       var spaceGroups = _.keyBy(data[0], "SpaceGroup_spaceGroupShortName");
       var parsed = [];
       for(var spaceGroup in spaceGroups){
           if (spaceGroup != "null"){               
               var stepsBySpaceGroup = _.filter(data[0],{"SpaceGroup_spaceGroupShortName": spaceGroup});
               function getStepId(stepsBySpaceGroup){
                   return _.keys(_.keyBy(stepsBySpaceGroup, "PhasingStep_phasingStepId")).toString();
               }
               function getCSV(stepsBySpaceGroup){
                   var keys = _.keys(_.keyBy(stepsBySpaceGroup, "csv"));
                   return _.filter(keys, function(e){return e!= "null";});
               }
           
               var node = {};
               node = ({
                   spaceGroup       : spaceGroup,
                   prepare          : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PREPARE"}) != null,
                   sub              : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "SUBSTRUCTUREDETERMINATION"}) != null,
                   phasing          : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PHASING"}) != null,
                   model            : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null,
                   downloadCSV      : EXI.getDataAdapter().mx.phasing.getCSVPhasingFilesByPhasingAttachmentIdURL(getCSV(stepsBySpaceGroup)),
                   downloadFilesUrl : EXI.getDataAdapter().mx.phasing.getDownloadFilesByPhasingStepIdURL(getStepId(stepsBySpaceGroup))
                   
               });
               
               function getMetrics(phasingStep){                                      
                    if (phasingStep.metric){                        
                            var singleMetric = phasingStep.metric.split(",");
                            var values = phasingStep.statisticsValue.split(",");                            
                            for (var j = 0; j < singleMetric.length; j++) {   
                                    /* Spaces are replaced by _ to be used on the templates */                        
                                    phasingStep[singleMetric[j].replace(/ /g, '_')] = values[j];                           
                            }
                    } 
                    if (phasingStep.png){
                        phasingStep.pngURL = EXI.getDataAdapter().mx.phasing.getPhasingFilesByPhasingProgramAttachmentIdAsImage(phasingStep.png);
                    }
                    
                    
                    phasingStep.spaceGroup = phasingStep.SpaceGroup_spaceGroupShortName; 
                    return (phasingStep);                     
               }
               
               function getNodeByPhasingStep(node, stepsBySpaceGroup, step){
                   
                   var modelBuildingSteps = _.filter(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : step});
                   node["metrics"] = [];
                   if (modelBuildingSteps){
                       var metrics = _.map(modelBuildingSteps, "metric");
                       var statisticsValues = _.map(modelBuildingSteps, "statisticsValue");
                       for (var z=0; z < modelBuildingSteps.length; z++){   
                            var toBePushed =  modelBuildingSteps[z];                          
                            if (modelBuildingSteps[z].metric){                                                        
                                toBePushed = getMetrics(modelBuildingSteps[z]);
                            }  
                            
                            /* Opening uglymol with:
                                    1) pdb file
                                    2) map1 as first map file
                                    3) map2 as second map file
                                    */           
                            var pdbUrl = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( modelBuildingSteps[z].pdb);
                            if ( modelBuildingSteps[0].map != null){
                                var mapsArr = modelBuildingSteps[z].map.split(",");
                                if (mapsArr.length == 2){
                                    var mapUrl1 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[0]);
                                    var mapUrl2 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[1]);                                
                                    toBePushed["uglymol"] = '../viewer/uglymol/index.html?pdb=' + pdbUrl + '&map1=' + mapUrl1 + '&map2=' + mapUrl2;
                                }
                            }                                                                            
                            node["metrics"].push(toBePushed);                         
                       }                                            
                   }     
                   node["phasingStepId"] = modelBuildingSteps[0].PhasingStep_phasingStepId;
                   return node;         
               }
               
               /** Filling the model if any */
               if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null){
                        node = getNodeByPhasingStep(node, stepsBySpaceGroup, "MODELBUILDING");
               }
               else{
                   /** There is no model building the we parse the phasing*/
                    if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PHASING"}) != null){
                       node = getNodeByPhasingStep(node, stepsBySpaceGroup, "PHASING");
                    }
                    else{
                        if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "SUBSTRUCTUREDETERMINATION"}) != null){ 
                            node = getNodeByPhasingStep(node, stepsBySpaceGroup, "SUBSTRUCTUREDETERMINATION"); 
                        }
                        else{
                           node = getNodeByPhasingStep(node, stepsBySpaceGroup, "PREPARE");      
                        }
                    }
               }
               
               /** This will be used to sort */
               var count = 0;
               if (node.prepare){
                   count = count + 1;
               }
               if (node.sub){
                   count = count + 1;
               }
               if (node.phasing){
                   count = count + 1;
               }
               if (node.model){
                   count = count + 1;
               }
               
               node["count"] = count;               
               parsed.push(node);
           }
       }
       
        parsed.sort(function(a,b){return a.count < b.count;});
        /** Parsing the metrics */
        for(var i =0; i< parsed.length; i++){
            if (parsed[i]){
                if (parsed[i].metrics){
                    parsed[i].metrics.sort(function(a,b){   
                        try{                                             
                            return parseFloat(a._CC_of_partial_model) < parseFloat(b._CC_of_partial_model);
                        }
                        catch(e){
                            return false;
                        }
                    });
                }
            }
        }
        
        var html = "";     
        dust.render("phasing.mxdatacollectiongrid.template",  parsed, function(err, out) {
                    html = html + out;
        });
        $(target).html(html);        
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.phasing.getPhasingViewByDataCollectionGroupId(dataCollectionGroupId);
    //EXI.getDataAdapter({onSuccess : onSuccess}).mx.phasing.getPhasingViewByDataCollectionId(dataCollectionId);  
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
        if ($("#sample_puck_layout_" +dataCollectionId)){
            
            if (dc.Container_containerId){
                var container =_.filter(grid.dataCollectionGroup, {"Container_containerId":Number(dc.Container_containerId)});
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
                }
                var attributesContainerWidget = {
                                                mainRadius : 100, 
                                                enableMouseOver : false, 
                                                enableClick : false,
                                                dataCollectionIds : dataCollectionIds
                };

                var puckLegend = new PuckLegend();

                $("#sample_puck_legend_" + dataCollectionId).html(puckLegend.getPanel().html);
    
                var puck = new UniPuckWidget(attributesContainerWidget);
                
                if (dc.Container_capacity == 10){
                    puck = new SpinePuckWidget(attributesContainerWidget);
                }
                
                $("#sample_puck_layout_" + dataCollectionId).html(puck.getPanel().html);
                
                var onSuccess = function(sender, samples){
                    if (samples){
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
    debugger
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
                    _this.displayPhasingTab(target, dataCollectionGroupId);              
                   
                }
            });
    };
    var timer3 = setTimeout(tabsEvents, 500, _this);
};