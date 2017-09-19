/**
 * Macromolecule Grid showing macromolecules and adding anb updating buttons
 * 
 * @height
 * @maxHeight
 * @width
 * @cssFontStyle
 * @searchBar makes this grid as Ext.ux.LiveSearchGridPanel
 * @tbar top bar containing "Add" and "Update From SMIS" button 
 * @collapsed
 * @collapsible
 * @btnEditVisible
 * @btnRemoveVisible
 * @multiselect makes it multiselect using Ext.selection.CheckboxModel
 * 
 * #onSelected
 * #onMacromoleculesChanged
 */
function MeasurementGrid(args) {
	this.id = BUI.id();
    
    this.onRemoved = new Event(this);
}


MeasurementGrid.prototype.load = function(dataCollections) {
	dataCollections = _.orderBy(dataCollections, ['MeasurementToDataCollection_dataCollectionId', 'MeasurementToDataCollection_dataCollectionOrder'], ['desc', 'desc']);
	_.map(dataCollections, function(o){ 
											o.samplePlateLetter = BUI.getSamplePlateLetters()[o.SamplePlatePosition_rowNumber - 1];										

										});

	
	
	
	var html = "";
	dust.render("measurement.grid.template", dataCollections, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$('#' + this.id).html(html);
};

MeasurementGrid.prototype.getPanel = function(){
    var _this = this;

	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : false
	}
};