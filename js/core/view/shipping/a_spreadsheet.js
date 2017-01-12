function SpreadSheet(args){
	this.id = BUI.id();
	this.height = 380;
	this.width = 500;
	this.containerType = "OTHER";
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.containerType != null) {
			this.containerType = args.containerType;
		}
	}
}

SpreadSheet.prototype.getPanel = function(){
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		height 		: this.height+ 50,
		items : [ 
				  {
						html 		: '<div  style="overflow: auto;overflow-y: hidden; border:1px solid gray;background-color:white;height:500px;width:' + (_this.width - 20) +'px"; id="' + this.id + '_samples"; ></div>',
						margin 		: '20 0 20 10',
						height 		: this.height,
						width 		: this.width,
						autoScroll 	: true,
						resizable 	: true
					}]
	});
    return this.panel;
};

SpreadSheet.prototype.setLoading = function (bool) {
	this.panel.setLoading(bool);
}

SpreadSheet.prototype.getAcronyms = function() {
	var proteins = EXI.proposalManager.getProteins();
	var acronyms = [];
	for (var i = 0; i < proteins.length; i++) {
		acronyms.push(proteins[i].acronym);
	}
	return acronyms;
};

SpreadSheet.prototype.setContainerType = function(containerType) {
	this.containerType = containerType;
};

SpreadSheet.prototype.getHeaderWidth = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].column.with);
	}
	return text;
};

SpreadSheet.prototype.getHeaderId = function(containerType) {
	var header = this.getHeader(containerType);
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].id);
	}
	return text;
};

SpreadSheet.prototype.getHeaderText = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].text);
	}
	return text;
};


SpreadSheet.prototype.getColumns = function() {
	var columns = [];
	for (var i = 0; i < this.getHeader().length; i++) {
		columns.push(this.getHeader()[i].column);
	}
	return columns;
};

/**
* Returns an array of objects for each row in the grid where at least the protein acronym column is filled
*
* @method parseTableData
*/
SpreadSheet.prototype.parseTableData = function() {
	var parsed = [];
	var data = this.spreadSheet.getData();
	// var columnIds = this.getHeaderId();
	if (data != null && data.length > 0){
		var columnIds = this.getHeaderId();
		for (var j = 0; j < data.length; j++) {
			if (data[j].length > 1){
				var row = {};
				row["location"] = j + 1;
				for (var k = 0 ; k < columnIds.length ; k++) {
					var key = columnIds[k];
					var value = data[j][this.getColumnIndex(key)];
					row[key] = value;
				}
				if (row["Protein Acronym"]){
					if (row["Protein Acronym"].length > 0){
						parsed.push(row);
					}
				}
			}
		}
	}
	/** Curated contains the whole-data rows * */
	var curated = [];
	for (var i = 0; i < parsed.length; i++) {
		if (parsed[i]["Protein Acronym"] != null){
			curated.push(parsed[i]);
		}
	}
	return curated;
};

SpreadSheet.prototype.load = function(data){
	var _this = this;
	this.data = data;
	var container = document.getElementById(this.id + '_samples');

	this.spreadSheet = new Handsontable(container, {
			data: data,
			height : this.height,
			width : this.width,
			manualColumnResize: true,
			colWidths: this.getHeaderWidth(),
			colHeaders: this.getHeaderText(),
			stretchH: 'last',
			columns: this.getColumns(),
	});
};

SpreadSheet.prototype.getData = function () {
	return this.spreadSheet.getData();
}

SpreadSheet.prototype.loadData = function (data) {
	return this.spreadSheet.loadData(data);
}

SpreadSheet.prototype.setDataAtCell = function (rowIndex, columnIndex, value) {
	this.spreadSheet.setDataAtCell(rowIndex, columnIndex, value);
}

/**
* Returns the columnIndex given the columnId
*
* @method getColumnIndex
* @param {Integer} colId The column Id of the column it's column index we want to know 
* @param {String} containerType Optional value to use if we want the header for an specific containerType
*/
SpreadSheet.prototype.getColumnIndex = function (colId) {
	return _.findIndex(this.getHeader(),{id :colId});
}