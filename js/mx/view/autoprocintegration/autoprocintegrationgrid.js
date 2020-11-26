/**
* It shows information from the autoprocessing like cells (a,b,c,alpha,beta,gamma) and also about phasing
*
* @class AutoProcIntegrationGrid
* @constructor
*/
function AutoProcIntegrationGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	
	this.preventSelection = false;
	this.maxHeight = 500;
	this.minHeight = 500;
    this.minHeight = 500;
      
    this.collapsed = true;
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
        
		if (args.maxHeight != null) {
			this.maxHeight = args.maxHeight;
		}
		if (args.searchBar != null) {
			this.searchBar = args.searchBar;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}

		if (args.collapsed != null) {
			this.collapsed = args.collapsed;
		}

		if (args.width != null) {
			this.width = args.width;
		}              
	}	
	this.onSelected = new Event(this);
}

AutoProcIntegrationGrid.prototype.parseData = function(data) {        
     /** Adding stats */
    for(var i = 0; i < data.length; i++){
         try{             
            data[i].statistics = this.getStatistics(data[i]);
            data[i].collapsed = this.getCollapseStatistics(data[i]);
            data[i].phasing = this.getPhasing(data[i]);              
            if (data[i].v_datacollection_summary_phasing_autoProcProgramId){
                var fileName = data[i].DataCollection_imagePrefix +"_" +data[i].DataCollection_dataCollectionNumber;
                if (data[i].v_datacollection_summary_phasing_anomalous){
                    fileName = fileName +  "_anomalous";
                }
                if (data[i].v_datacollection_summary_phasing_autoproc_space_group){
                    fileName = fileName +  "_" + data[i].v_datacollection_summary_phasing_autoproc_space_group.replace(/\s+/g, '');
                }
                fileName = fileName + "_" +  data[i].v_datacollection_processingPrograms + ".zip"; 
                data[i].downloadFilesUrl = EXI.getDataAdapter().mx.autoproc.downloadAttachmentListByautoProcProgramsIdList(data[i].v_datacollection_summary_phasing_autoProcProgramId, fileName);
            }
            data[i].processingStatus = data[i].v_datacollection_processingStatus;
            if (data[i].processingStatus == "RUNNING") {
            	var startTime = new Date(data[i].v_datacollection_processingStartTime);
            	var elapsed = Date.now() - startTime;
            	if (elapsed > 14400000) { // Four hours, 4*3600*1000
            		data[i].processingStatus = "TIMEOUT";
            	}
            }
         }       
         catch(e){             
             console.log(e);
         }  
    }
    
    var anomalous = _.filter(data, function(o) { return (o.v_datacollection_summary_phasing_anomalous && (o.v_datacollection_processingStatus == "SUCCESS" || (o.v_datacollection_processingStatus == 1)))});    
    var nonanomalous = _.filter(data, function(o) { return (o.v_datacollection_summary_phasing_anomalous == false && (o.v_datacollection_processingStatus == "SUCCESS" || (o.v_datacollection_processingStatus == 1 )))});
    var running = _.filter(data, function(o) { return o.v_datacollection_processingStatus == "RUNNING";});
    var failed = _.filter(data, function(o) { return o.v_datacollection_processingStatus == "FAILED" || (o.v_datacollection_processingStatus == 0 ); });
   
    /**Set non anomalous first */
    anomalousdata = new AutoprocessingRanker().rank(anomalous, "v_datacollection_summary_phasing_autoproc_space_group");    
    nonanomalousdata = new AutoprocessingRanker().rank(nonanomalous, "v_datacollection_summary_phasing_autoproc_space_group");    

    // https://github.com/ispyb/EXI/issues/204    
    return _.concat(nonanomalousdata, anomalousdata, running,failed);
    
};

AutoProcIntegrationGrid.prototype.load = function(data) {      
    this.data =this.parseData(data);
       
    if (this.collapsed){   
        this.loadCollapsed(this.data);
    }
    else{
	    this.store.loadData(this.data, false);
    }
};

AutoProcIntegrationGrid.prototype.loadCollapsed = function(data) {
	this.store.loadData([{ collapsed : true, items : data}], false);
};
/*
AutoProcIntegrationGrid.prototype.selectRowByAutoProcIntegrationId = function(autoProcIntegrationId) {
	this.preventSelection = true;debugger
	this.panel.getSelectionModel().select(this.store.find("v_datacollection_summary_phasing_autoProcIntegrationId", autoProcIntegrationId));
};
*/
AutoProcIntegrationGrid.prototype.getPhasing = function(data) {      
    var phasing = [];
    
    if (data.spaceGroupShortName){        
        var spaceGroups = data.spaceGroupShortName.split(',');
        var steps = data.phasingStepType.split('PREPARE');        
        for(var i = 0; i < spaceGroups.length; i++){            
            phasing.push({
                spaceGroup              : spaceGroups[i],
                prepare                 : true,
                sub                     : steps[i+1].indexOf("SUBSTRUCTUREDETERMINATION") != -1,
                phasing                 : steps[i+1].indexOf("PHASING") != -1,
                model                   : steps[i+1].indexOf("MODEL") != -1,
                autoProcIntegrationId   : data.v_datacollection_summary_phasing_autoProcIntegrationId
            });
        }
        
        
    }
    return phasing;
};                 

AutoProcIntegrationGrid.prototype.getCollapseStatistics = function(data) {	  
    if (data.scalingStatisticsType) {                   
        var type = data.scalingStatisticsType.split(",");
    } else {
        var type = [];
    }
    function getValue(attribute, i, decimals){
        
        if (attribute){
            var splitted = attribute.split(",");
            if (splitted[i]){
                if (decimals){
                    try{ 
                        return Number( splitted[i]).toFixed(decimals)
                    }
                    catch(e){
                        return "NaN";
                    }
                }
                return splitted[i];
            }
        }
        return "";        
     }      
    
     for (var i = 0; i < type.length; i++) {
        if (type[i]){           
                data[type[i]] = {
                                            type 					: type[i],
                                            resolutionLimitLow 		: getValue(data.resolutionLimitLow, i,1),
                                            resolutionLimitHigh 	: getValue(data.resolutionLimitHigh, i,1),
                                            multiplicity 			: getValue(data.multiplicity, i, 1),
                                            anomalousMultiplicity 	: getValue(data.anomalousMultiplicity, i, 1),
                                            meanIOverSigI 			: getValue(data.meanIOverSigI, i, 1),
                                            completeness 			: getValue(data.completeness, i, 1),
                                            anomalousCompleteness 	: getValue(data.anomalousCompleteness, i, 1),
                                            rMerge 			        : getValue(data.rMerge, i, 1),
                                            ccHalf 			        : getValue(data.ccHalf, i,1),
                                            rPimWithinIPlusIMinus 	: getValue(data.rPimWithinIPlusIMinus, i,1),
                                            rMeasAllIPlusIMinus 	: getValue(data.rMeasAllIPlusIMinus, i,1),
                                            ccAno                	: getValue(data.ccAno, i),
                                            sigAno                	: getValue(data.sigAno, i)
                                           
                                            
               };            
        }       
    }        
    return data;    				
};


AutoProcIntegrationGrid.prototype.getStatistics = function(data) {	 
    if (data.scalingStatisticsType) {                   
        var type = data.scalingStatisticsType.split(",");
    } else {
        var type = [];
    }
    function getValue(attribute, i, decimals){        
        if (attribute){
            var splitted = attribute.split(",");
            if (splitted[i]){
                if (decimals){
                    try{ 
                        return Number( splitted[i]).toFixed(decimals)
                    }
                    catch(e){
                        return "NaN";
                    }
                }
                return splitted[i];
            }
        }
        return "";        
    }
    
    var parsed = [];
    for (var i = 0; i < type.length; i++) {
        parsed.push({
            type 					: type[i],
            resolutionLimitLow 		: getValue(data.resolutionLimitLow, i),
            resolutionLimitHigh 	: getValue(data.resolutionLimitHigh, i),
            multiplicity 			: getValue(data.multiplicity, i),
            anomalousMultiplicity 	: getValue(data.anomalousMultiplicity, i),
            meanIOverSigI 			: getValue(data.meanIOverSigI, i),
            completeness 			: getValue(data.completeness, i),
            anomalousCompleteness 	: getValue(data.anomalousCompleteness, i),
            rMerge 			        : getValue(data.rMerge, i),
            ccHalf 			        : getValue(data.ccHalf, i),
            rPimWithinIPlusIMinus 	: getValue(data.rPimWithinIPlusIMinus, i),
            rMeasAllIPlusIMinus 	: getValue(data.rMeasAllIPlusIMinus, i),
            ccAno                	: getValue(data.ccAno, i),
            sigAno                	: getValue(data.sigAno, i)
            
        });
        
    }
            
    return parsed;    				
};

AutoProcIntegrationGrid.prototype.getPanel = function() {
	var _this = this;
    
	this.store = Ext.create('Ext.data.Store', {
		
		fields : [ 'autoProcId',
		           'refinedCellA', 
                   'v_datacollection_summary_phasing_autoProcIntegrationId',
		           'autoProcIntegrationId',
		           'v_datacollection_summary_phasing_anomalous',
		           'v_datacollection_summary_phasing_processingPrograms',
		           'v_datacollection_summary_phasing_autoproc_space_group']
	});
  
	
	this.panel = Ext.create('Ext.grid.Panel', {		
		store : this.store,		
        //tbar: this.getToolBar(),
        margin : 10,
		//cls : 'border-grid',
        // height : this.height,
        layout : 'fit',
		columns : [             
                    {
                        text : 'autoProcIntegrationId',
                        dataIndex : 'processingPrograms',
                        flex : 1,
                        hidden : true,
                        renderer : function(e, sample, record){
                            return record.data.v_datacollection_summary_phasing_autoProcIntegrationId;
                        }
                    },        
                    {
                        dataIndex: 'dataCollectionGroup',
                        name: 'dataCollectionGroup',
                        flex: 1.5,
                        hidden: false,
                        renderer: function(grid, e, record) {                            
                            var data = record.data;                            
                            var html = "";        
                                                                                          
                            if (_this.collapsed){              
                                dust.render("collapsed.autoprocintegrationgrid.template", data.items, function(err, out) {
                                    html = html + out;
                                
                                });
                            }
                            else{
                                dust.render("autoprocintegrationgrid.template", data, function(err, out) {
                                    html = html + out;
                                
                                });
                            }
                            return html;
                        }
                    }                        		
		],
		flex : 1,
          viewConfig : {
                preserveScrollOnRefresh : true,
                stripeRows              : false,                
	    	}
	});
  
	return this.panel;
};
