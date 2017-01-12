/**
* Extends the PuckWidget class for a UniPuck
*
* @class UniPuckWidget
* @constructor
*/
function UniPuckWidget(args){
	if (args == null){
		args = {};
	}
	args.isUnipuck = true;
	PuckWidget.call(this, args);

	this.data = this.parseData(this.data);
	this.capacity = 16;
};

UniPuckWidget.prototype.getPanel = PuckWidget.prototype.getPanel;
UniPuckWidget.prototype.load = PuckWidget.prototype.load;
UniPuckWidget.prototype.addCirclePathCells = PuckWidget.prototype.addCirclePathCells;
UniPuckWidget.prototype.focus = PuckWidget.prototype.focus;
UniPuckWidget.prototype.focusWell = PuckWidget.prototype.focusWell;
UniPuckWidget.prototype.render = PuckWidget.prototype.render;
UniPuckWidget.prototype.findCellIndexById = PuckWidget.prototype.findCellIndexById;
UniPuckWidget.prototype.loadSamples = PuckWidget.prototype.loadSamples;
UniPuckWidget.prototype.emptyAll = PuckWidget.prototype.emptyAll;
UniPuckWidget.prototype.disableAllCells = PuckWidget.prototype.disableAllCells;
UniPuckWidget.prototype.allowAllCells = PuckWidget.prototype.allowAllCells;
UniPuckWidget.prototype.blink = PuckWidget.prototype.blink;

/**
* Parses the data
*
* @method parseData
* @return {Object} data The data correctly parsed
*/
UniPuckWidget.prototype.parseData = function (data) {
	var n = 5;
	var marginPercent = 0.8;
	/** distance between center point and the well/cell */
	var dist = 4*data.mainRadius/11;
	
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	n = 11;
	marginPercent = 0.8;
	dist = 3*data.mainRadius/4;
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	return data;
};