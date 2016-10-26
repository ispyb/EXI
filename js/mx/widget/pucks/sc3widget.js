function SC3Widget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'SC3Widget';
	this.clockwise = -1;

	this.data = {
		radius : this.radius,
		cells : 5,
		text : []
	};
	
	this.createStructure();
	this.createPucks(2, this.data.cells, 0, this.data.radius/2, 0.8);
}

SC3Widget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
SC3Widget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
SC3Widget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
SC3Widget.prototype.load = SampleChangerWidget.prototype.load;
SC3Widget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
SC3Widget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
SC3Widget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
SC3Widget.prototype.render = SampleChangerWidget.prototype.render;
SC3Widget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
SC3Widget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
SC3Widget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
SC3Widget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;

SC3Widget.prototype.createStructure = function () {
	var textR = this.data.radius*0.9;
	for (var i = 0 ; i < this.data.cells ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		var textNumber = {
			text : i+1,
			x : -textR*Math.sin(ang) + this.data.radius,
			y : -textR*Math.cos(ang) + this.data.radius
		};
		this.data.text.push(textNumber);
	}
}