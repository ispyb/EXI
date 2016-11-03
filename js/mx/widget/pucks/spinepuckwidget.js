/**
* Extends the PuckWidget class for a SpinePuck
*
* @class UniPuckWidget
* @constructor
*/
function SpinePuckWidget(args){
	if (args == null){
		args = {};
	}
	args.isUnipuck = false;
	PuckWidget.call(this, args);
	this.data = this.parseData(this.data);	
	this.capacity = 10;

}

SpinePuckWidget.prototype.getPanel = PuckWidget.prototype.getPanel;
SpinePuckWidget.prototype.load = PuckWidget.prototype.load;
SpinePuckWidget.prototype.addCirclePathCells = PuckWidget.prototype.addCirclePathCells;
SpinePuckWidget.prototype.focus = PuckWidget.prototype.focus;
SpinePuckWidget.prototype.render = PuckWidget.prototype.render;
SpinePuckWidget.prototype.findCellIndexById = PuckWidget.prototype.findCellIndexById;
SpinePuckWidget.prototype.loadSamples = PuckWidget.prototype.loadSamples;
SpinePuckWidget.prototype.emptyAll = PuckWidget.prototype.emptyAll;

/**
* Parses the data
*
* @method parseData
* @return {Object} data The data correctly parsed
*/
SpinePuckWidget.prototype.parseData = function (data) {
	var n = 10;
	var marginPercent = 0.8;
	var dist = 3*data.mainRadius/4;
	
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	return data;
};