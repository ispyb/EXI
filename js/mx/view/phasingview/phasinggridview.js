/**
* Displays the phasing grid
*
function PhasingGridView(args) {
* @class MXDataCollectionGrid
* @constructor
*/
function PhasingGridView(args) {
    this.hasScroll = true;
    if (args) {
        if (args.hasScroll != null) {
            this.hasScroll = args.hasScroll;
        }
    }
}

PhasingGridView.prototype.load = function(dataCollectionGroupId, PhasingStep_method) {
    this.dataCollectionGroupId = dataCollectionGroupId;
    this.PhasingStep_method = PhasingStep_method;
}

PhasingGridView.prototype.printHTML = function(target) {
    var _this = this;
    
    var onSuccess = function(sender, data){        
        /** It filters all phasing step which method is _this.PhasingStep_method: [SAD | MR]  */
       data[0] = _.filter(data[0], {PhasingStep_method : _this.PhasingStep_method})
    
       /** It gets all space groups */
       var spaceGroups = _.keyBy(data[0], "SpaceGroup_spaceGroupShortName");
       
       var parsed = [];

       /** Loop by space group in order to make a summary */
       for(var spaceGroup in spaceGroups){           
           if (spaceGroup != "null"){

               /** It gets all steps for the same space group */
               var stepsBySpaceGroup = _.filter(data[0],{"SpaceGroup_spaceGroupShortName": spaceGroup});

               function getStepId(stepsBySpaceGroup){
                   return _.keys(_.keyBy(stepsBySpaceGroup, "PhasingStep_phasingStepId")).toString();
               }

               function getCSV(stepsBySpaceGroup){
                   var keys = _.keys(_.keyBy(stepsBySpaceGroup, "csv"));
                   return _.filter(keys, function(e){return e!= "null";});
               }
           
               /** node contains all steps for the same space group organized by step type */
               var node = {};
               
               /** Node to be displayed for MR. It has got two steps: [PHASING, REFINEMENT]*/
               if (_this.PhasingStep_method == "MR"){
                    node = ({
                        spaceGroup       : spaceGroup,                                    
                        hasPhasing          : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PHASING"}) != null,
                        hasRefinement       : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "REFINEMENT"}) != null,                
                        hasLigandFit        : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "LIGAND_FIT"}) != null,
                        downloadCSV      : EXI.getDataAdapter().mx.phasing.getCSVPhasingFilesByPhasingAttachmentIdURL(getCSV(stepsBySpaceGroup)),
                        downloadFilesUrl : EXI.getDataAdapter().mx.phasing.getDownloadFilesByPhasingStepIdURL(getStepId(stepsBySpaceGroup))
                        
                    });

               }
               else{
                    /** Node to be displayed for Phasing that contains several steps: [PREPARE, SUBSTRUCTUREDETERMINATION, PHASING, MODELBUILDING] */
                    node = ({
                        spaceGroup          : spaceGroup,
                        hasPrepare          : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PREPARE"}) != null,
                        hasSub              : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "SUBSTRUCTUREDETERMINATION"}) != null,
                        hasPhasing          : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PHASING"}) != null,                    
                        hasModel            : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null,
                        downloadCSV         : EXI.getDataAdapter().mx.phasing.getCSVPhasingFilesByPhasingAttachmentIdURL(getCSV(stepsBySpaceGroup)),
                        downloadFilesUrl    : EXI.getDataAdapter().mx.phasing.getDownloadFilesByPhasingStepIdURL(getStepId(stepsBySpaceGroup))
                        
                    });
               }
               

               /**
                * This function adds the metrics into the dictionary and also the PNG
                */
               function getMetrics(phasingStep){                                                         
                    if (phasingStep.metric){                        
                            var singleMetric = phasingStep.metric.split(",");
                            var values = phasingStep.statisticsValue.split(",");                            
                            for (var j = 0; j < singleMetric.length; j++) {   
                                    /* Spaces are replaced by _ to be used on the templates */                        
                                    phasingStep[singleMetric[j].trim().replace(/ /g, '_')] = values[j];                           
                            }
                    } 
                    if (phasingStep.png){
                        /** It might happens that there are two PDB like:"159386,159388" */
                        var phasingStepPngs = phasingStep.png.split(",");
                        var fileTypes = phasingStep.fileType.split(",");
                        for (var z=0; z < fileTypes.length; z++){
                            /** Exclude other file types than IMAGE */
                            if (fileTypes[z] == "IMAGE") {
                                phasingStep.pngURL = EXI.getDataAdapter().mx.phasing.getPhasingFilesByPhasingProgramAttachmentIdAsImage(phasingStepPngs[z]);
                            }
                        }
                    }                                        
                    phasingStep.spaceGroup = phasingStep.SpaceGroup_spaceGroupShortName; 
                    return (phasingStep);                     
               }
                              

               /**
                * This functions add to toBepush the URL for every fileType found
                    fileTypesField = CCALL_CCWEAK,OCCUPANCY_SITENUMBER
                    phasingProgramAttachmentFields = XXXX, YYYYY

                */
               function parseFilteTypes(fileTypesField, phasingProgramAttachmentFields, toBePushed){
                        if (fileTypesField != null){                                
                            var types = fileTypesField.split(",");
                            var ids = phasingProgramAttachmentFields.split(",");                                                        
                            for (var r = 0; r < types.length; r++) {
                                toBePushed[types[r]] = EXI.getDataAdapter().mx.phasing.getPhasingFilesByPhasingProgramAttachmentIdAsImage(ids[r]);
                            }                                                            
                        }
               }

                function parseDownloadAttachments(leaf){
                       var fileAttachmentsId = [];
                       while (leaf != null){                             
                                fileAttachmentsId.push(leaf.PhasingStep_phasingStepId);
                                leaf = _.find(stepsBySpaceGroup, {'PhasingStep_phasingStepId':leaf.PhasingStep_previousPhasingStepId});
                       }
                       return fileAttachmentsId;
               }

               function getNodeByPhasingStep(node, stepsBySpaceGroup, step){                                      
                   var steps = _.filter(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : step});
                   node["metrics"] = [];
                   if (steps){                       
                       var metrics = _.map(steps, "metric");
                       var statisticsValues = _.map(steps, "statisticsValue");
                       for (var z=0; z < steps.length; z++){   
                            var toBePushed =  steps[z];
                            var listUglyMol = [];
                            /**
                             * This adds the phasing plots into the dictionary looking for them from the previous steps
                             */
                            var leaf = steps[z];                           
                            while (leaf != null){                             
                                parseFilteTypes(leaf.fileType, leaf.phasingProgramAttachmentId, toBePushed);
                                leaf = _.find(stepsBySpaceGroup, {'PhasingStep_phasingStepId':leaf.PhasingStep_previousPhasingStepId});
                            }
                            
                            if (steps[z].metric){                                                        
                                toBePushed = getMetrics(steps[z]);
                            }  
                            if (step == "MODELBUILDING") { 
	                            /* Opening uglymol with:
	                                    1) pdb file
	                                    2) map1 as first map file
	                                    3) map2 as second map file
	                                    */           
	                            var pdbUrl = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( steps[z].pdb);                            
	                            if ( steps[z].map != null){
	                                var mapsArr = steps[z].map.split(",");
	                                if (mapsArr.length == 2){
	                                    var mapUrl1 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[0]);
	                                    var mapUrl2 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[1]);                                
	                                    toBePushed["uglymol"] = '../viewer/uglymol/index.html?pdb=' + pdbUrl + '&map1=' + mapUrl1 + '&map2=' + mapUrl2;
	                                }
	                            }
                            } else if ((step == "REFINEMENT") || (step == "LIGAND_FIT")) {
                                var refinedPdbFileId = -1;
                                var mrPdbFileId = -1;
                                var peaksFileId = -1;
                                var blobFileId = -1;
                                if (steps[z].map != null) {
                                	var mapsArr = steps[z].map.split(",");
                                } else {
                                	var mapsArr = [];
                                }
                                if (steps[z].pdb != null) {
                                	var pdbsArr = steps[z].pdb.split(",");
                                } else {
                                	var pdbsArr = [];
                                }
                                if (steps[z].csv != null) {
                                	var csvsArr = steps[z].csv.split(",");
                                } else {
                                	var csvsArr = [];
                                }
                                if ("mapFileName" in steps[z]) {
                                    if (steps[z].mapFileName){
                                        var mapFileNamesArr = steps[z].mapFileName.split(",");
                                        for (var i = 0; i < mapFileNamesArr.length; i++) {
                                            mapFileNamesArr[i] = mapFileNamesArr[i].slice(0, -4)
                                        }
                                    }
                                } else {
                                    var mapFileNamesArr = [];
                                }
                                if ("pdbFileName" in steps[z]) {
                                    var pdbFileNamesArr = steps[z].pdbFileName.split(",");
                                    for (var i = 0; i < pdbFileNamesArr.length; i++) {
                                        if (pdbFileNamesArr[i] == "refined.pdb") {
                                            refinedPdbFileId = pdbsArr[i];
                                        } else if (pdbFileNamesArr[i] == "MR.pdb") {
                                            mrPdbFileId = pdbsArr[i];
                                        }
                                    }
                                } else {
                                    var pdbFileNamesArr = [];
                                }
                                if ("csvFileName" in steps[z] && steps[z].csvFileName != null) {
                                    var csvFileNamesArr = steps[z].csvFileName.split(",");
                                    for (var i = 0; i < csvFileNamesArr.length; i++) {
                                        if (csvFileNamesArr[i] == "peaks.csv") {
                                            peaksFileId = csvsArr[i];
                                        } else if (pdbFileNamesArr[i] == "blobs.csv") {
                                            blobFileId = csvsArr[i];
                                        }
                                    }
                                } else {
                                    var csvFileNamesArr = [];
                                }
                                if (mrPdbFileId != -1) {
                                    index2FOFC_MR = mapFileNamesArr.indexOf("2FOFC_MR");
                                    indexFOFC_MR = mapFileNamesArr.indexOf("FOFC_MR");
                                    if ( (index2FOFC_MR == -1) || (indexFOFC_MR) == -1) {
                                        listUglyMol.push("");
                                    } else {
                                        var pdbUrl = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mrPdbFileId );
                                        var mapUrl1 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[index2FOFC_MR]);
                                        var mapUrl2 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[indexFOFC_MR]);
                                        var peaks = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(peaksFileId);
                                        listUglyMol.push('../viewer/uglymol/index.html?pdb=' + pdbUrl + '&map1=' + mapUrl1 + '&map2=' + mapUrl2 + '&peaks=' + peaks);
                                    }
                                } 
                                if (refinedPdbFileId != -1) {
                                    index2FOFC_REFINE = mapFileNamesArr.indexOf("2FOFC_REFINE");
                                    indexFOFC_REFINE = mapFileNamesArr.indexOf("FOFC_REFINE");
                                    if ( (index2FOFC_REFINE == -1) || (indexFOFC_REFINE == -1) ) {
                                        listUglyMol.push("");
                                    } else {
                                        var pdbUrl = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( refinedPdbFileId );
                                        var mapUrl1 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[index2FOFC_REFINE]);
                                        var mapUrl2 = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId( mapsArr[indexFOFC_REFINE]);
                                        var peaks = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(peaksFileId);
                                        listUglyMol.push('../viewer/uglymol/index.html?pdb=' + pdbUrl + '&map1=' + mapUrl1 + '&map2=' + mapUrl2 + '&peaks=' + peaks);
                                    }
                                } 
                            }
                            /** It will add only the files coming from these steps */
                            toBePushed["downloadFilesUrl"] = EXI.getDataAdapter().mx.phasing.getDownloadFilesByPhasingStepIdURL(parseDownloadAttachments(steps[z]));
                            if (listUglyMol.length == 0) {
                                listUglyMol.push("");
                                listUglyMol.push("");
                            }
                            toBePushed["listUglyMol"] = listUglyMol;
                            node["metrics"].push(toBePushed);                         
                       }                                            
                   }     
                   node["phasingStepId"] = steps[0].PhasingStep_phasingStepId;
                   return node;         
               }
               
               /**
                StepS for Phasing are: PREPARE,  SUBSTRUCTUREDETERMINATION, PHASING AND MODELBUILDING
                StepS for Molecular replacement are: PHASING, REFINEMENT and LIGAND_FIT*/

               /** If there is model building then we will display modelbuilding */
               if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null){
                        node = getNodeByPhasingStep(node, stepsBySpaceGroup, "MODELBUILDING");
               }
               else{
                   if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "LIGAND_FIT"}) != null){
                       node = getNodeByPhasingStep(node, stepsBySpaceGroup, "LIGAND_FIT");                                  
                   } else
                   if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "REFINEMENT"}) != null){
                       node = getNodeByPhasingStep(node, stepsBySpaceGroup, "REFINEMENT");                                  
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
               }
               
               /** This will be used to sort */
               var count = 0;
               if (node.hasPrepare){
                   count = count + 1;
               }
               if (node.hasSub){
                   count = count + 1;
               }
               if (node.hasPhasing){
                   count = count + 1;
               }
               if (node.hasModel){
                   count = count + 1;
               }
                if (node.hasRefinement){
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
                            return  parseFloat(b._CC_of_partial_model) - parseFloat(a._CC_of_partial_model);
                        }
                        catch(e){                            
                            return false;
                        }
                    });
                }
            }
        }
        
        var html = "";
        if (_this.PhasingStep_method == "MR"){
            
            dust.render("mr.mxdatacollectiongrid.template",  {parsed : parsed, hasScroll : _this.hasScroll}, function(err, out) {
                    html = html + out;
            });
        }
        else{
            
            dust.render("phasing.mxdatacollectiongrid.template",  {parsed : parsed, hasScroll : _this.hasScroll}, function(err, out) {
                    html = html + out;
            });
        }
        $(target).html(html);
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                                    
    EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).mx.phasing.getPhasingViewByDataCollectionGroupId(this.dataCollectionGroupId);
}