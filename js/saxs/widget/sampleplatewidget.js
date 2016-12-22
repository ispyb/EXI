/**
 * 
 * @nodeSize
 * @fontSize
 * @strokeWidth
 * @showTooltip
 * @showBorderLabels
 * @showFullName
 * @showLabels
 * @backgroundColor
 * 
 **/

function SamplePlateWidget(args) {
	this.actions = [];

	this.width = "1";
	this.height = "1";

	this.legendFontSize = 7;

	this.backgroundColor = "#E6E6E6";
	this.wellColor = "#FFFFFF ";

	this.id = BUI.id();
	this.notSupportedMessage = "IE doesn't support HTML5 features";

	this.nodeSize = 14;
	this.fontSize = 10;
	this.strokeWidth = 2;
	this.showTooltip = true;
	this.showBorderLabels = true;
	this.showFullName = false;
	this.showLabels = false;

	this.enableClick = true;

	if (args != null) {
		if (args.showBorderLabels != null) {
			this.showBorderLabels = args.showBorderLabels;
		}
		if (args.showLabels != null) {
			this.showLabels = args.showLabels;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.nodeSize != null) {
			this.nodeSize = args.nodeSize;
		}
		if (args.notSupportedMessage != null) {
			this.notSupportedMessage = args.notSupportedMessage;
		}
		if (args.fontSize != null) {
			this.fontSize = args.fontSize;
		}
		if (args.showFullName != null) {
			this.showFullName = args.showFullName;
		}
		if (args.showTooltip != null) {
			this.showTooltip = args.showTooltip;
		}
		if (args.backgroundColor != null) {
			this.backgroundColor = args.backgroundColor;
		}
		if (args.strokeWidth != null) {
			this.strokeWidth = args.strokeWidth;
		}
		if (args.enableClick != null) {
			this.enableClick = args.enableClick;
		}
	}

	this.onNodeSelected = new Event(this);

	/** this is the ids[specimenId] = nodeId **/
	this.ids = {};
	this.onVertexUp = new Event(this);
	this.selectedSVGNodes = [];
	this.markedSpecimenId = {};
};

SamplePlateWidget.prototype.clear = function(experiment, samplePlate, targetId) {
	if (document.getElementById(this.targetId) != null) {
		document.getElementById(this.targetId).innerHTML = "";
	}
};

SamplePlateWidget.prototype.load = function (dataCollections) {
	for (var i = 0 ; i < dataCollections.length ; i++) {
		var specimen = dataCollections[i];
		if (specimen.SamplePlate_name == this.samplePlate.type) {
			var nodeId = this.id + "-node-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber;
			// var color = experiment.getSpecimenColorByBufferId(specimen.Specimen_specimenId);
			// if (specimen.Macromolecule_macromoleculeId != null) {
			// 	color = experiment.macromoleculeColors[specimen.macromolecule3VO.macromoleculeId]
			// }
			var color = "blue";
			$("#" + nodeId).attr("fill",color);
			if (specimen.Measurement_measurementId) {
				if (specimen.Run_runId != null) {
					$("#" + this.id + "-square-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber).attr("visibility","visible");
				}
			}
		}
	}
};

SamplePlateWidget.prototype.draw = function(dataCollections, samplePlate, targetId, windowContainerId) {
	this.onVertexUp = new Event(this);
	this.samplePlate = samplePlate;
	this.dataCollections = dataCollections;

	this.targetId = targetId;
	$("#" + this.targetId).append( "<div id='" + this.targetId + "-div-svg" + "'></div>" );

	var rows = this.samplePlate.rowCount;
	var columns = this.samplePlate.columnCount;

	var formatter = {
			// type : "LineEdgeNetworkFormatter",
			'fill-opacity' : 1,
			fill : this.wellColor,
			'stroke-width' : this.strokeWidth,
			'stroke-opacity' : 1,
           
			stroke : "#000000",
			size : this.nodeSize,
			title : {
				fontSize : this.fontSize,
				fill : "#000000"
			},
			labeled : false,
			height : this.height,
			width : this.width,
		
			right : this.width,
			backgroundColor : this.backgroundColor,
			balanceNodes : false,
			nodesMaxSize : 12,
			nodesMinSize : 2
		};

	this.nodes = [];
	var text = [];
	var margin = 10;
	var nodeRadius = Math.min((this.width-margin)/columns,(this.height-margin)/rows)/2;
	nodeRadius = Math.min(nodeRadius, formatter.nodesMaxSize);
	nodeRadius = Math.max(nodeRadius, formatter.nodesMinSize);

	var horizontalMargin = ((this.width-margin) - 2*nodeRadius*columns)/(columns + 1);
	var verticalMargin = ((this.height-margin) - 2*nodeRadius*rows)/(rows + 1);

	for ( var i = 1; i <= rows; i++) {
		for ( var j = 1; j <= columns; j++) {
			var factor = 0.8;
			if (this.samplePlate.type == " 4 x ( 8 + 3 ) Block") {
				if (j >= 9) {
					factor = 1.0;
				} else {
					factor = 0.6;
				}
			}
			var squareSide = Math.min(horizontalMargin,verticalMargin) + 2*nodeRadius*factor;

			this.nodes.push({
							nodeId 		:	this.id + "-node-" + i + "-" + j,
							squareId 	:	this.id + "-square-" + i + "-" + j,
							radius 		: 	nodeRadius*factor,
							x 			: 	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin,
							y 			: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin,
							row 		: 	i,
							column 		: 	j,
							xSquare 	:	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin - squareSide/2 ,
							ySquare		: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin - squareSide/2,
							squareSide	:	squareSide
			});
			if (j == 1) {
				var letter = ["A","B","C","D","E","F","G","H"][i-1];
				text.push({
							text 	:	letter,
							x		:	Math.max(horizontalMargin,nodeRadius) / 2,
							y 		: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin + this.fontSize/2
				});
			}
			if (i == rows) {
				text.push({
							text 	:	j,
							x		:	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin,
							y 		: 	this.height
				});
			}
		}
	}

	var templateData = {
							id 			: 	this.id,
							nodes 		: 	this.nodes,
							text		:	text,
							formatter 	: 	formatter,
							enableClick	:	this.enableClick
	}

	var html = "";
	dust.render("sample.plate.template", templateData, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$("#" + this.targetId + "-div-svg").html(html);

	if (this.enableClick){
		this.attachClickListeners();
	}

	this.load(this.dataCollections);

};

SamplePlateWidget.prototype.attachClickListeners = function (row, column) {
	var _this = this;
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		$("#" + node.nodeId).unbind('click').click(function(sender){
			_this.onNodeSelected.notify({
										samplePlate : _this.samplePlate,
										node : _this.getNodeById(sender.target.id)
									});
		});
	}
};

SamplePlateWidget.prototype.getNodeById = function (id) {
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		if (node.nodeId == id) {
			return node;
		}
	}
	return;
};

SamplePlateWidget.prototype.clearSelection = function() {
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		$("#" + node.squareId).removeClass("plate-square-selected");
	}
};

SamplePlateWidget.prototype.selectSpecimen = function(specimen) {
	var squareId = this.id + "-square-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber;
	$("#" + squareId).addClass("plate-square-selected");
};

SamplePlateWidget.prototype.drawBorders = function() {
	var xArray = {};
	var yArray = {};

	var xValues = [];
	var yValues = [];

	var verticesLayout = this.network.graphCanvas.getLayout().vertices;
	for ( var vertice in verticesLayout) {
		var verticeX = verticesLayout[vertice].x;
		if (xArray[verticeX] == null) {
			xArray[verticeX] = true;
			xValues.push(verticeX);
		}

		var verticeY = verticesLayout[vertice].y;
		if (yArray[verticeY] == null) {
			yArray[verticeY] = true;
			yValues.push(verticeY);
		}
	}

	/** LEGENG **/
	var letters = BUI.getSamplePlateLetters();
	for ( var i = 1; i <= xValues.length; i++) {
		SVG.drawText(xValues[i - 1] * this.network.graphCanvas.getWidth() - 5, this.network.graphCanvas.getHeight(), i, this.network.graphCanvas._svg,
				[ [ 'font-size', this.legendFontSize + 'px' ], [ 'font-weight', 'bold' ], [ 'fill', 'black' ] ]);
	}

	for ( var i = 1; i <= yValues.length; i++) {
		SVG.drawText(5, yValues[i - 1] * this.network.graphCanvas.getHeight() + 5, letters[i - 1], this.network.graphCanvas._svg, 
				[ [ 'font-size', this.legendFontSize + 'px' ], [ 'font-weight', 'bold' ], [ 'fill', 'black' ] ]);
	}

};

SamplePlateWidget.prototype.addOkIcon = function(x, y, id, specimen) {
	var svg = this.network.graphCanvas._svg;
	var _this = this;

	var id = id + "_marked";
	if (this.markedSpecimenId[id] == null) {
		SVG.drawRectangle(x - 10, y - 10, 22, 22, svg, [ [ "id", id ], [ "fill", "gray" ],["stroke-opacity", "0.5"], [ "fill-opacity", "0.2" ], [ 'stroke', 'black' ] ]);
		this.markedSpecimenId[id] = true;
	}
};


SamplePlateWidget.prototype.getVertexByPosition = function(row, column) {
	var vertices = this.network.getDataset().getVertices();
	for ( var vertexId in vertices) {
		if ((vertices[vertexId].args.row == row) && (vertices[vertexId].args.column == column)) {
			return vertices[vertexId];
		}
	}
	return null;
};

SamplePlateWidget.prototype.showLabel = function(row, column, specimen) {
	if (specimen != null) {
		var vertex = this.getVertexByPosition(row, column);
		if (this.fontSize != 0) {
			if (specimen.macromolecule3VO != null) {
				if (this.showFullName) {
					vertex.setName(specimen.code);
				} else {
					vertex.setName(specimen.macromolecule3VO.acronym);
				}
			} else {
				if (this.showFullName) {
					vertex.setName(specimen.code);
				} else {
					vertex.setName(specimen.macromolecule3VO.acronym);
				}
			}
		}
	}
};

SamplePlateWidget.prototype.getNodeIdBySpecimenId = function(specimenId) {
	var nodeId = this.ids[specimenId];
};

SamplePlateWidget.prototype.markSpecimenAsOk = function(specimen, x, y, id) {
	if (specimen.measurements != null) {
		for ( var j = 0; j < specimen.measurements.length; j++) {
			if (specimen.measurements[j].merge3VOs != null) {
				if (specimen.measurements[j].merge3VOs.length > 0) {
					this.addOkIcon((x * this.network.graphCanvas.getWidth()), y * this.network.graphCanvas.getHeight(), id, specimen);
				}
			}
		}
	}
};
/**
 * Input: specimenId of the sample containing a macromolecule
 * Ouput: color of the specimen buffer associated
 */
SamplePlateWidget.prototype.getSpecimenBufferColorFromSampleSpecimenId = function(specimenId) {
	var dcs = this.experiment.getDataCollectionsBySpecimenId(specimenId);
	if (dcs.length > 0){
		var dataCollection = dcs[0];
		for (var i = 0; i < dataCollection.measurementtodatacollection3VOs.length; i++) {
			var measurementToDc = dataCollection.measurementtodatacollection3VOs[i];
			if (measurementToDc.dataCollectionOrder == 1){
				var measurement = this.experiment.getMeasurementById(measurementToDc.measurementId);
				if (measurement != null){
					return this.experiment.getSpecimenColorByBufferId(measurement.specimenId);
				}
				return 'pink';
			}
		}
	}
	return 'orange';
};

SamplePlateWidget.prototype.fillWell = function(row, column, specimen) {
	var _this = this;
	if (specimen != null) {
		var vertex = this.getVertexByPosition(row, column);
		if (vertex == null) {
			console.log(row + ", " + column + " not found");
			return;
		}
		var id = this.network.getGraphCanvas().getSVGNodeId(vertex.id);

		this.showLabel(row, column, specimen);
		this.ids[specimen.specimenId] = vertex.id;
		var x = this.network.getLayout().vertices[vertex.id].x;
		var y = this.network.getLayout().vertices[vertex.id].y;
		this.markSpecimenAsOk(specimen, x, y, id);

		if (specimen.macromolecule3VO == null) {
			/** BUFFER * */
			var color = this.experiment.getSpecimenColorByBufferId(specimen.specimenId);
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setFill(color);
//			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke(this.experiment.getSpecimenColorByBufferId(specimen.specimenId));
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke('blue');
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStrokeWidth(2);

		} else {
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setFill(this.experiment.macromoleculeColors[specimen.macromolecule3VO.macromoleculeId]);
//			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke(this.getSpecimenBufferColorFromSampleSpecimenId(specimen.specimenId));
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke('black');
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStrokeWidth(1);
		}

		if (this.showLabels) {
			x = this.network.getLayout().vertices[vertex.id].x;
			y = this.network.getLayout().vertices[vertex.id].y;
			if (specimen.macromolecule3VO != null) {
				var acronym = specimen.macromolecule3VO.acronym;
				if (acronym.length > 10) {
					acronym = acronym.slice(0, 10) + "...";
				}

				SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 20, acronym, this.network.graphCanvas._svg, [
					[ 'font-size', 'xx-small' ], [ 'fill', 'black' ] ]);

				SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 35, Number(specimen.concentration).toFixed(2) + " mg/ml", this.network.graphCanvas._svg, [
					[ 'font-size', 'xx-small' ], [ 'fill', 'black' ] ]);
			}

			var bufferName = this.experiment.getBufferById(specimen.bufferId).acronym;
			if (bufferName.length > 10) {
				bufferName = bufferName.slice(0, 10) + "...";
			}

			SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 5, this.experiment.getBufferById(specimen.bufferId).acronym, this.network.graphCanvas._svg, [
				[ 'font-size', 'xx-small' ], [ 'fill', 'blue' ] ]);
		}

		if (this.showTooltip) {
			var id = this.network.getGraphCanvas().getSVGNodeId(vertex.id);
		}
	}
};

SamplePlateWidget.prototype._getToolTipContent = function(specimen) {
	var content = "<table style='font-size:11px;'>";
	content = content + "<TR><TD>" + "Specimen " + "</TD><TD style='color:black; font-weight:bold;'>" + specimen.code + "</TD></TR>";
	content = content + "<TR style='height:20px'><TD>" + "" + "</TD><TD style='color:black; font-weight:bold;'></TD></TR>";
	content = content + "<TR><TD>" + "Buffer: " + "</TD><TD style='color:blue; font-weight:bold;'>" + this.experiment.getBufferById(specimen.bufferId).name + "</TD></TR>";
	if (specimen.macromolecule3VO != null) {
		content = content + "<TR><TD>" + "Macromolecule: " + "</TD><TD  style='color:green; font-weight:bold;'>" + specimen.macromolecule3VO.acronym + "</TD></TR>";
		content = content + "<TR><TD>" + "Concentration: " + "</TD><TD >" + specimen.concentration + "</TD></TR>";
	}
	//	content = content + "<TR><TD>" + "Temperature: "+ "</TD><TD>" + specimen.exposureTemperature + "</TD></TR>";
	content = content + "<TR><TD>" + "Volume: " + "</TD><TD>" + specimen.volume + "</TD></TR>";

	if (specimen.viscosity != null) {
		content = content + "<TR><TD>" + "Viscosity: " + "</TD><TD>" + specimen.viscosity + "</TD></TR>";
	}

	content = content + "</table>";
	return content;
};

SamplePlateWidget.prototype.fillSimulator = function(samples) {
	for ( var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		if (sample.sampleplateposition3VO != null) {
			if (sample.sampleplateposition3VO.samplePlateId == this.samplePlate.samplePlateId) {
				var position = sample.sampleplateposition3VO;
				this.fillWell(position.rowNumber, position.columnNumber, sample);
			}
		}
	}

};

SamplePlateWidget.prototype.relayout = function(network, rows, columns) {
	if (this.samplePlate.platetype3VO.shape == "REC") {
		this.squareRelayout(network, rows, columns);
	}
	if (this.samplePlate.platetype3VO.shape == "CIR") {
		this.circleRelayout(network, rows, columns);
	}
};

SamplePlateWidget.prototype.squareRelayout = function(network, rows, columns) {
	var count = network.getDataset()._getVerticesCount();
	var yMin = 0.07;
	var yMax = 0.9;
	var xMin = 0.075;
	var xMax = 0.95;
	var stepY = (yMax - yMin) / (rows - 1);
	var stepX = (xMax - xMin) / (columns - 1);

	var verticesCoordinates = [];
	for ( var i = 0; i < rows; i++) {
		for ( var j = 0; j < columns; j++) {
			y = i * stepY + yMin;
			x = j * stepX + xMin;

			verticesCoordinates.push({
				'x' : x,
				'y' : y
			});

		}
	}
	var aux = 0;
	for ( var vertex in network.getDataset().getVertices()) {
		if (network.getLayout().vertices[vertex] == null) {
			this.vertices[vertex] = new NodeLayout(vertex, 0, 0);
		}
		network.getLayout().vertices[vertex].setCoordinates(verticesCoordinates[aux].x, verticesCoordinates[aux].y);
		aux++;
		network.getLayout().vertices[vertex].changed.attach(function(sender, item) {
			_this.changed.notify(item);
		});
	}
};

SamplePlateWidget.prototype.circleRelayout = function(network, rows, columns) {
	network.getLayout().getLayout("CIRCLE");
};


