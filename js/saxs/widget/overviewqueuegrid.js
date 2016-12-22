
function OverviewQueueGrid(args) {
	QueueGrid.call(this,args);

	this.height = 0;
	if (args) {
		if (args.height) {
			this.height = args.height;
		}
	}
}

OverviewQueueGrid.prototype.getPercentage = QueueGrid.prototype.getPercentage;
OverviewQueueGrid.prototype.getImage = QueueGrid.prototype.getImage;
OverviewQueueGrid.prototype.parseDataById = QueueGrid.prototype.parseDataById;
OverviewQueueGrid.prototype.attachCallBackAfterRender = QueueGrid.prototype.attachCallBackAfterRender;

/**
* It loads a set of data collections
*
* @method load
* @param {dataCollections} Measurements retrieved from v_saxs_datacollections
*/
OverviewQueueGrid.prototype.load = function(dataCollections) {	
	if (dataCollections != null && dataCollections.length > 0) {				
		this.render(_.orderBy(dataCollections, ['MeasurementToDataCollection_dataCollectionId', 'MeasurementToDataCollection_dataCollectionOrder'], ['desc', 'desc']));
	} else {
		$('#' + this.id).hide().html("<h4>No results found</h4>").fadeIn('fast');
	}	
};

/**
* Fills overview.queue.grid.test.template with data collections
*
* @method render
* @param {dataCollections} Measurements retrieved from v_saxs_datacollections
*/
OverviewQueueGrid.prototype.render = function(data) {
	var html = "";

	/** Calculates the rowSpan so the template knows when to plot the images. Alsp finds where to draw stronger borders*/	
	var grouped = _.groupBy(data, "MeasurementToDataCollection_dataCollectionId");
    
	_.map(data, function(o){ 
        if(o.Subtraction_subtractionId){
		    o.urlDownload = EXI.getDataAdapter().saxs.subtraction.getZip(o.Subtraction_subtractionId);
        }
        if(o.Merge_mergeId){
		    o.urlSpecific = EXI.getDataAdapter().saxs.frame.downloadFramesByAverageIdList(o.Merge_mergeId);
        }
	});
    
	for (var dataCollectionId in grouped){
		var last = _.maxBy(grouped[dataCollectionId], 'MeasurementToDataCollection_dataCollectionOrder');
		if (last.Subtraction_subtractionId){
            last.rowSpan = grouped[dataCollectionId].length;
            last.scattering = this.getImage(last.Subtraction_subtractionId,"scattering");
            last.kratky = this.getImage(last.Subtraction_subtractionId,"kratky");
            last.density = this.getImage(last.Subtraction_subtractionId,"density");
            last.guinier = this.getImage(last.Subtraction_subtractionId,"guinier");
            if (last.Run_runId) {
                last.dataReduction = true;
            }
        }
		 _.minBy(grouped[dataCollectionId], 'MeasurementToDataCollection_dataCollectionOrder').rowClass = "blue-bottom-border-row";
	}


	dust.render("overview.queue.grid.test.template", data, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$('#' + this.id).html(html);

	var nodeWithScroll = document.getElementById(document.getElementById(this.id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
	
	this.attachCallBackAfterRender(nodeWithScroll);
};


/**
* Return an Ext HTML object with a DIV
*
* @method getPanel
*/
OverviewQueueGrid.prototype.getPanel = function(){    
	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : true,
		height : this.height
	}
};
