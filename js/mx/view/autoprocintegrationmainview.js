/**
* Main view for autoprocessing. It displays a grid with a summary of the information of autoprocessing and phasing
* On the right it displays a panel with the plots: completeness, rfacor, cc2, etc.. as well as the list of attachments
*
* @class AutoProcIntegrationMainView
* @constructor
*/
function AutoProcIntegrationMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	var _this = this;
    this.id = BUI.id();
	
    /* _this.programAttachments = [];
     _this.programAttachmentsAutoProcProgramIds = [];
	
	this.slaveWidth = 450;
	*/
	this.autoProcIntegrationGrid = new AutoProcIntegrationGrid({height:300});
	
	/*this.autoProcIntegrationGrid.onSelected.attach(function(sender, records){
		var ids = [];        
		for (var i = 0; i < records.length; i++) {
			ids.push(records[i].v_datacollection_summary_phasing_autoProcIntegrationId);
		}		
		
		try{
			_this.loadPlots(ids);
		}
		catch(e){
            console.log("Error loading plots");    
        }	        			
	});*/

}

AutoProcIntegrationMainView.prototype.getPanel = MainView.prototype.getPanel;


AutoProcIntegrationMainView.prototype.getContainer = function() {
    var height = 200;
    var width = 300;
	this.panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'fit'
            },
            //margin :10,
            //cls : 'border-grid',         
            items: [
              this.autoProcIntegrationGrid.getPanel(),
              {
                  xtype: 'container',
                  layout : 'hbox',
                  margin : 20,
                  items : [{
                      
                      html : '<div id="rfactor">rfactor</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                     
                      html : '<div id="completeness">completeness</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                        html : '<div id="sigmaI">sigmaI</div>',
                    
                      width : width,
                      height :height                                            
                  }
                  ]                                    
              },
               {
                  xtype: 'container',
                  layout : 'hbox',
                  margin : 20,
                  items : [{
                     
                       html : '<div id="cc2">cc2</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                    
                      html : '<div id="sigmaAnno">sigmaAnno</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                      html : '<div id="anno">anno</div>',
                      width : width,
                      height :height                                            
                  }
                  ]                                    
              }
              ]
        });
        return this.panel;
};

/**
* It loads the list of attachments and stores them into two class variables:
* _this.programAttachmentsAutoProcProgramIds with the ids of the autoprocprograms
* _this.programAttachments with a list of attachments
* @method loadAttachments
*/
/*
AutoProcIntegrationMainView.prototype.loadAttachments = function(autoProcessingIntegrationList) {
    var _this = this;
    
  
	var onSuccess = function(sender, data){
        _this.programAttachments = (data);
	};
    _this.programAttachmentsAutoProcProgramIds = _.map(autoProcessingIntegrationList, 'v_datacollection_summary_phasing_autoProcProgramId');
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getAttachmentListByautoProcProgramsIdList(_this.programAttachmentsAutoProcProgramIds);
};	
*/
/**
* It loads autoproc.getViewByDataCollectionId from autoprocessingdataadapter and call to loadAttachments
* @method load
*/
AutoProcIntegrationMainView.prototype.load = function(data) {
	var _this = this;
	this.panel.setTitle("Autoprocessing");
	
	
	this.autoProcIntegrationGrid.load(data);
    
    
    var autoprocProgramId = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].v_datacollection_summary_phasing_autoProcProgramId){
            autoprocProgramId.push(data[i].v_datacollection_summary_phasing_autoProcProgramId);
        }
        
    }
   
   
    var annoCorrPlotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "Anom Corr vs Resolution",
                          //  legend : 'never',
                            targetId : "anno"
    });
    $("#anno").html(annoCorrPlotter.getHTML());                         
    annoCorrPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleAnnoCorrection(autoprocProgramId));	                  
       
    var sigmaAnnoPlotter = new AutoProcIntegrationCurvePlotter({
        height : 250,
        title : "SigAno vs Resolution",
     //   legend : 'never',
        targetId : "sigmaAnno"
    });
        $("#sigmaAnno" + autoprocProgramId).html(sigmaAnnoPlotter.getHTML());                         
    sigmaAnnoPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleSigmaAno(autoprocProgramId));
                       
     var cc2Plotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "CC/2 vs Resolution",
                         //   legend : 'never',
                            targetId : "cc2"
                        });
    $("#cc2").html(cc2Plotter.getHTML());                         
    cc2Plotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCC2(autoprocProgramId));
	                     
       
       
       
        var rFactorPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Rfactor vs Resolution",
		                  //  legend : 'never',
                            targetId : "rfactor"
	                    });                             
                        $("#rfactor").html(rFactorPlotter.getHTML());                         
                        rFactorPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleRfactor(autoprocProgramId));
                        
                           /** Rfactor */
                        var completenessPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Completeness vs Resolution",
		                   // legend : 'never',
                            targetId : " completeness"
	                    });                             
                        $("#completeness").html(completenessPlotter.getHTML());                         
                        completenessPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCompleteness(autoprocProgramId));
	                  
                      	var isigmaPlotter = new AutoProcIntegrationCurvePlotter({
                            height :250,
                            title : "I/SigmaI vs Resolution",
                           // legend : 'never',
                            targetId : " sigmaI"
                        });
                        $("#sigmaI").html(isigmaPlotter.getHTML());                         
                        isigmaPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleISigma(autoprocProgramId));
	                  
                      
                      
    //this.loadAttachments(data);
};


