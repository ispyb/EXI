function AutoProcIntegrationPlots(args) {

}

AutoProcIntegrationPlots.prototype.getPanel = function() {
    var height = 200;
    var width = 300;
    this.panel = Ext.create('Ext.panel.Panel', {
        title : 'Auto-Processing Plots',
        // layout: 'fit',
        cls : 'border-grid',
        margin : 5,
        height : 500,        
        items: [
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
* It loads autoProc results and displays different plots
* @method load
*/
AutoProcIntegrationPlots.prototype.load = function(data) {
	var _this = this;
    
    var autoProcIntegrationId = [];
    var spaceGroups = [];
    autoprocProgram = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].v_datacollection_summary_phasing_autoProcProgramId){
            autoProcIntegrationId.push(data[i].AutoProcIntegration_autoProcIntegrationId);
            var spg = data[i].v_datacollection_summary_phasing_autoproc_space_group;
            if (data[i].v_datacollection_summary_phasing_anomalous) {
                spg += " ANOM";
            }
            spg += " - " + data[i].v_datacollection_processingPrograms;
            spaceGroups.push(spg);
            autoprocProgram = data[i].v_datacollection_processingPrograms;
        }
    }

    
    var annoCorrPlotter = new AutoProcIntegrationCurvePlotter({
        height : 250,
        title : "Anom Corr vs Resolution",
        labels : ["Resolution"].concat(spaceGroups),
        targetId : " anno",
        labelsDiv : " anno_legend",
        strokeWidth : 2.0,
        valueRange : [null,100]     
    });
    $("#anno").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [null,100] });
        curveViewer.show();
        curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleAnnoCorrection(autoProcIntegrationId),"Anom Corr vs Resolution",["Resolution"].concat(spaceGroups));
    });  
    $("#anno").html(annoCorrPlotter.getHTML());                         
    annoCorrPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleAnnoCorrection(autoProcIntegrationId));	                  
       
    var sigmaAnnoPlotter = new AutoProcIntegrationCurvePlotter({
        height : 250,
        title : "SigAno vs Resolution",
        labels : ["Resolution"].concat(spaceGroups),
        targetId : " sigmaAnno",
        labelsDiv : " sigmaAnno_legend",
        strokeWidth : 2.0,
        valueRange : [0,null] 
    });
    $("#sigmaAnno").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [0,null] });
        curveViewer.show();
        curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleSigmaAno(autoProcIntegrationId),"SigAno vs Resolution",["Resolution"].concat(spaceGroups));
    });
    $("#sigmaAnno").html(sigmaAnnoPlotter.getHTML());                         
    sigmaAnnoPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleSigmaAno(autoProcIntegrationId));
                       
     var cc2Plotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "CC/2 vs Resolution",
                            labels : ["Resolution"].concat(spaceGroups),
                            targetId : " cc2",
                            labelsDiv : " cc2_legend",
                            strokeWidth : 2.0,
                            valueRange : [0,110]                                               
                        });
    $("#cc2").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [0,110]});
        curveViewer.show();
        if (autoprocProgram == "fastdp"){
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getFastDPCC2(autoProcIntegrationId),"CC/2 vs Resolution",["Resolution"].concat(spaceGroups));
        } else {
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleCC2(autoProcIntegrationId),"CC/2 vs Resolution",["Resolution"].concat(spaceGroups));
        }
    });
    $("#cc2").html(cc2Plotter.getHTML());
    if (autoprocProgram == "fastdp"){
        cc2Plotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getFastDPCC2(autoProcIntegrationId));
    } else {
        cc2Plotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCC2(autoProcIntegrationId));
    }
	            
    var rFactorPlotter = new AutoProcIntegrationCurvePlotter({
                        height : 250,
                        title : "Rfactor vs Resolution",
                        labels : ["Resolution"].concat(spaceGroups),
                        targetId : " rfactor",
                        labelsDiv : " rfactor_legend",
                        strokeWidth : 2.0,
                        valueRange : [0,null]  
                    });                             
    $("#rfactor").html(rFactorPlotter.getHTML());
    $("#rfactor").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [0,null] });
        curveViewer.show();
        if (autoprocProgram == "fastdp"){
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getFastDPRfactor(autoProcIntegrationId),"Rfactor vs Resolution",["Resolution"].concat(spaceGroups));
        } else {
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleRfactor(autoProcIntegrationId),"Rfactor vs Resolution",["Resolution"].concat(spaceGroups));
        }
    });
    if (autoprocProgram == "fastdp"){
        rFactorPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getFastDPRfactor(autoProcIntegrationId));
    } else {
        rFactorPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleRfactor(autoProcIntegrationId));
    }

    
        /** Rfactor */
    var completenessPlotter = new AutoProcIntegrationCurvePlotter({
        height : 250,
        title : "Completeness vs Resolution",
        labels : ["Resolution"].concat(spaceGroups),
        targetId : " completeness",
        labelsDiv : " completeness_legend",
        strokeWidth : 2.0,
        valueRange : [0,110]  
    });                             
    $("#completeness").html(completenessPlotter.getHTML());
    $("#completeness").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [0,100] });
        curveViewer.show();
        if (autoprocProgram == "fastdp"){
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getFastDPCompleteness(autoProcIntegrationId),"Completeness vs Resolution",["Resolution"].concat(spaceGroups));
        } else {
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleCompleteness(autoProcIntegrationId),"Completeness vs Resolution",["Resolution"].concat(spaceGroups));
        }
    });
    if (autoprocProgram == "fastdp"){
        completenessPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getFastDPCompleteness(autoProcIntegrationId));
    } else {
        completenessPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCompleteness(autoProcIntegrationId));
    }
    
    var isigmaPlotter = new AutoProcIntegrationCurvePlotter({
        height :250,
        title : "I/Sigma(I) vs Resolution",
        labels : ["Resolution"].concat(spaceGroups),
        targetId : " sigmaI",
        labelsDiv : " sigmaI_legend",
        strokeWidth : 2.0,
        valueRange : [0,null]
    });
    $("#sigmaI").unbind('click').click(function(sender){
        var curveViewer = new CurveViewer({valueRange : [0,null] });
        curveViewer.show();
        if (autoprocProgram == "fastdp"){
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getFastDPISigma(autoProcIntegrationId),"I/SigmaI vs Resolution",["Resolution"].concat(spaceGroups));
        } else {
            curveViewer.load(autoProcIntegrationId,EXI.getDataAdapter().mx.autoproc.getXScaleISigma(autoProcIntegrationId),"I/SigmaI vs Resolution",["Resolution"].concat(spaceGroups));
        }
    }); 
    $("#sigmaI").html(isigmaPlotter.getHTML());
    if (autoprocProgram == "fastdp"){
        isigmaPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getFastDPISigma(autoProcIntegrationId));
    } else {
        isigmaPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleISigma(autoProcIntegrationId));
    }
};