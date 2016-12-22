/**
* Abstract class for creating a puck widget
*
* @class PuckWidget
* @constructor
*/
function PuckWidget(args){
	this.id = BUI.id();
	
	this.mainRadius = 150;
	this.dataCollectionIds = {};
	this.containerId = 0;
	this.containerCode = "";
	this.enableMouseOver = false;
	this.enableClick = false;
	this.initSelected = {};
	this.isLoading = true;
	this.capacity = 10;
	
	this.isUnipuck = false;
	this.isEmpty = true;
	
	if (args){
		if (args.id) {
			this.id = args.id;
		}
		if (args.mainRadius){
			this.mainRadius = args.mainRadius;
		}
		if (args.isUnipuck){
			this.isUnipuck = args.isUnipuck;			
		}
		if (args.dataCollectionIds){
			this.dataCollectionIds = args.dataCollectionIds;
		}
		if (args.containerIds){
			this.containerIds = args.containerIds;
		}
		if (args.enableMouseOver != null){
			this.enableMouseOver = args.enableMouseOver;
		}
		if (args.enableClick != null){
			this.enableClick = args.enableClick;
		}
		if (args.initSelected){
			this.initSelected = args.initSelected;
		}
		if (args.isLoading != null){
			this.isLoading = args.isLoading;
		}
	}
	
	this.shapeRadiusX = this.mainRadius/10;
	this.shapeRadiusY = this.mainRadius/20;
	
	this.data = {
				mainRadius : this.mainRadius,
				cells : [],
				id : this.id,
				isUnipuck : this.isUnipuck,
				shapeRadiusX : this.shapeRadiusX,
				shapeRadiusY : this.shapeRadiusY,
				containerId : this.containerId,
				containerCode : this.containerCode,
				enableClick : this.enableClick,
				enableMouseOver : this.enableMouseOver,
				dataCollectionIds : this.dataCollectionIds,
				isLoading : this.isLoading
	};
	
	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

/**
* Add a certain number of cell objects to the data following a circle.
*
* @method addCirclePathCells
* @param {Object} data The data of the puck
* @param {Integer} n The number of cells to add
* @param {Double} marginPercent Factor to control the separation between cells
* @param {Double} dist The distance to the center of the puck where the cells are positioned
*/
PuckWidget.prototype.addCirclePathCells = function (data, n, marginPercent, dist) {
	var rad = Math.min(dist*Math.sin((Math.PI/n)*marginPercent), 
						(data.mainRadius - dist)*marginPercent);
	
	for (var i = 0 ; i < n ; i++){
		var ang = i*2*Math.PI/n;
		var newCell = 		{
								x :-dist*Math.sin(ang) + data.mainRadius,
								y :-dist*Math.cos(ang) + data.mainRadius,
								color :'#FFFFFF', 
								radius : rad,								
								id : this.id + "-" + Number(data.cells.length + 1),
								state : "EMPTY",
								location : Number(data.cells.length + 1),
								selected : false,
								dataCollectionIds : data.dataCollectionIds[Number(data.cells.length + 1)]
							};
		data.cells.push(newCell);
	}
	return data;
};

PuckWidget.prototype.getPanel = function () {
	var html = "";
	dust.render("puck.template", this.data, function(err, out){
		html = out;
	});
	
	return html;
};

/**
* Set all the cells of the puck as EMPTY
*
* @method load
*/
PuckWidget.prototype.emptyAll = function () {
	for (cellIndex in this.data.cells) {
		this.data.cells[cellIndex].state = "EMPTY";
		this.render(this.data.cells[cellIndex].location,true);
	}
	this.isEmpty = true;
	this.containerId = 0;
	$("#" + this.id).removeClass("puck-error");
};

/**
* Load sample data to the puck given the result of sample query by containerId
*
* @method loadSamples
* @param {Object} samples Result of the sample query by containerId
* @param {Integer} selectedLocation Optional parameter for having a selected cell
*/
PuckWidget.prototype.loadSamples = function (samples, selectedLocation) {
	var cells = [];
	for (var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		var dataCollectionIds = this.dataCollectionIds[sample.BLSample_location];
		var state = "FILLED";
		if (dataCollectionIds != null && dataCollectionIds.length > 0){
			state = "COLLECTED";
		}
		var selected = false;
		if (selectedLocation != null){
			selected = sample.BLSample_location == selectedLocation;
		}
		if (sample.BLSample_location == "") {
			sample.hasError = true;
		}
		
		// Parse data
		cells.push({
			location : sample.BLSample_location,
			state : state,
			selected : selected,
			sample_name : sample.BLSample_name,
			protein_acronym : sample.Protein_acronym,
			protein_name : sample.Protein_name,
			dataCollectionIds : dataCollectionIds,
			containerId : sample.Container_containerId,
			containerCode : sample.Container_code,
			hasError : sample.hasError
		});
	}
	this.load(cells);
};

/**
* Load sample data to the puck given that the data is correctly parsed
*
* @method load
* @param {Object} data Data correctly parsed
*/
PuckWidget.prototype.load = function (data) {
	var _this = this;
	$("#" + _this.data.id + "-loading-text").remove();

	for (sampleIndex in data){
		var sample = data[sampleIndex];
		if (!sample.hasError){
			var id = this.id + "-" + sample.location;
			var cellIndex = this.findCellIndexById(id);
			this.data.cells[cellIndex].state = sample.state;
			this.data.cells[cellIndex].selected = sample.selected;
			this.data.cells[cellIndex].sample_name = sample.sample_name;
			this.data.cells[cellIndex].protein_acronym = sample.protein_acronym;
			this.data.cells[cellIndex].protein_name = sample.protein_name;
			this.data.cells[cellIndex].containerId = sample.containerId;
			this.data.cells[cellIndex].containerCode = sample.containerCode;
			if (sample.state != "EMPTY"){
				this.containerId = sample.containerId;
				this.containerCode = sample.containerCode;
				this.data.containerId = this.containerId;
				this.data.containerCode = this.containerCode;
				this.isEmpty = false;
			}
		} else {
			this.containerId = sample.containerId;
			this.containerCode = sample.containerCode;
			this.data.containerId = this.containerId;
			this.data.containerCode = this.containerCode;
			this.isEmpty = false;
		}
	}

	for (i in this.data.cells){
		var currentId = this.id + "-" + Number(Number(i) + 1);

		if (this.enableMouseOver){
			$("#" + currentId).unbind('mouseover').mouseover(function(sender){
				var cellIndex = _this.findCellIndexById(sender.target.id);
				
				_this.onMouseOver.notify(sender.target.id.split("-")[1]);
				_this.focus(sender.target.id.split("-")[1],true);
				
				// TOOLTIP
				if (_this.data.cells[cellIndex].sample_name){
	
					var tooltipHtml = "";
					dust.render("plates.tooltip.mxdatacollectiongrid.template", _this.data.cells[cellIndex], function(err, out) {
						tooltipHtml = out;
					});
					$('body').append(tooltipHtml);
					$('#hoveringTooltipDiv').css({
						"top" : $(this).offset().top - 3*_this.data.cells[i].radius,
						"left" : $(this).offset().left + 1.5*_this.data.cells[i].radius
					});
					if (_this.data.cells[cellIndex].y - _this.data.mainRadius < 0) {
						$('#hoveringTooltipDiv').css({
							"top" : $(this).offset().top + 2*_this.data.cells[i].radius,
							"left" : $(this).offset().left + _this.data.cells[i].radius
						});
					}
				}

			});
			
			$("#" + currentId).unbind('mouseout').mouseout(function(sender){
				_this.onMouseOut.notify();
				_this.focus(sender.target.id.split("-")[1],false);

				// TOOLTIP
				$('#hoveringTooltipDiv').remove();
				
			});

		}
		
		if (this.enableClick) {
			$("#" + currentId).unbind('click').click(function(sender){
				var cellIndex = _this.findCellIndexById(sender.target.id);
				_this.render(_this.data.cells[cellIndex].location,true);
				// TOOLTIP
				$('#hoveringTooltipDiv').remove();
			});
		}
		
		this.render(this.data.cells[i].location,true);
	}
};

/**
* Focus or unfocus one cell according to a boolean and its location 
*
* @method focus
* @param {Integer} location The location of the cell on the puck
* @param {Boolean} bool Whether or not to focus the cell
*/
PuckWidget.prototype.focus = function (location, bool) {
	if (bool){
		$("#" + this.id + "-" + location).attr("class", "cell_focus");
		$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_hidden");		
	} else {
		this.render(location,true);
	}
};

/**
* Sets the style classes of the cell on a given location
*
* @method render
* @param {Integer} location The location of the cell on the puck
*/
PuckWidget.prototype.render = function (location) {
	var cellIndex = this.findCellIndexById(this.id + "-" + location);
        
	switch (this.data.cells[cellIndex].state) {
		case "FILLED":
			$("#" + this.id + "-" + location).attr("class","cell_filled");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_filled");
			break;
		case "COLLECTED":
			$("#" + this.id + "-" + location).attr("class","cell_collected");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class","cell_inner_filled");
			break;
		case "RESULTS":
			$("#" + this.id + "-" + location).attr("class","cell_results");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class","cell_inner_filled");
			break;
		case "ERROR":
			$("#" + this.id + "-" + location).attr("class","cell_error");
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_filled");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			break;
		case "EMPTY":
			$("#" + this.id + "-" + location).attr("class", "cell_empty");
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_hidden");
			$("#" + this.id + "-" + location + "-label").attr("fill", "black");
			break;
	}
	if (this.data.cells[cellIndex].selected) {
		$("#" + this.id + "-" + location + "-inner").addClass("cell_selected");
	}
};

/**
* Returns the cell Index in the data of the puck given its id
*
* @method findCellIndexById
* @param {Integer} id The id of the cell
* @return The cell Index in the data of the puck
*/
PuckWidget.prototype.findCellIndexById = function (id) {
	for (cellIndex in this.data.cells) {
		if (this.data.cells[cellIndex].id == id){
			return cellIndex;
		}
	}
};

/**
* Adds the disabled class to each cell
*
* @method disableAllCells
* @return
*/
PuckWidget.prototype.disableAllCells = function () {
	for (var i = 0 ; i < this.data.cells.length ; i++) {
		var cell = this.data.cells[i];
		$("#" + cell.id).addClass("cell-disabled");
	}
};

/**
* Removes the disabled class to each cell
*
* @method allowAllCells
* @return
*/
PuckWidget.prototype.allowAllCells = function () {
	for (var i = 0 ; i < this.data.cells.length ; i++) {
		var cell = this.data.cells[i];
		$("#" + cell.id).removeClass("cell-disabled");
	}
};