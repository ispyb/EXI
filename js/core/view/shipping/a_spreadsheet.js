function SpreadSheet(args){
	this.id = BUI.id();
    this.height = 440;
	this.width = 500;
	this.containerType = "OTHER";
	
	this.acronyms;
	this.forceUpdate = false;
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
		if (args.cells != null){
			this.cells = args.cells;
		}
	}

}

SpreadSheet.prototype.getPanel = function(){
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		//height 		: this.height+ 50,
		items : [ 
				  {
						html 		: '<div  style="overflow: auto;overflow-y: hidden; border:1px solid gray;background-color:white;height:100px;"; id="' + this.id + '_samples"; ></div>',
						//margin 		: '0 0 20 10',
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

SpreadSheet.prototype.reloadAcronyms = function() {
    this.forceUpdate = true;
    this.acronyms = null;
    this.acronyms = this.getAcronyms(true);
}

SpreadSheet.prototype.getAcronyms = function(force) {
    if (force != null){
        this.forceUpdate = force;
    }
	if (this.acronyms == null){
		this.acronyms = _.map(EXI.proposalManager.getProteins(this.forceUpdate), 'acronym').sort(function(a, b) {
			if (a.toLowerCase() < b.toLowerCase()) return -1;
			if (a.toLowerCase() > b.toLowerCase()) return 1;
			return 0;
		});		
	}
	return this.acronyms;
};

SpreadSheet.prototype.setContainerType = function(containerType) {
	this.containerType = containerType;
};

SpreadSheet.prototype.getHeaderWidth = function() {
	return _.map(this.getHeader(), 'column.width');
};

SpreadSheet.prototype.getHeaderId = function(containerType) {
	return _.map(this.getHeader(), 'id');
};

SpreadSheet.prototype.getHeaderText = function() {
	return _.map(this.getHeader(), 'text');
};


SpreadSheet.prototype.getColumns = function() {	
	return _.map(this.getHeader(), 'column');
};


SpreadSheet.prototype.loadData = function(data){
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
			licenseKey: 'non-commercial-and-evaluation',
	});
};

SpreadSheet.prototype.getData = function () {
	return this.spreadSheet.getData();
};
/*
SpreadSheet.prototype.loadData = function (data) {
	return this.spreadSheet.loadData(data);
};
*/

SpreadSheet.prototype.setDataAtCell = function (rowIndex, columnIndex, value) {
	if ((this.getData()[rowIndex][columnIndex] == null)&&(value == "")){
		return;
	}
	if (this.getData()[rowIndex][columnIndex] == value){
		return;
	}
	this.spreadSheet.setDataAtCell(rowIndex, columnIndex, value);
};

SpreadSheet.prototype.disableAll = function () {
	this.spreadSheet.updateSettings({
					readOnly: true
				});
};

/**
* Returns the columnIndex given the columnId
*
* @method getColumnIndex
* @param {Integer} colId The column Id of the column it's column index we want to know 
* @param {String} containerType Optional value to use if we want the header for an specific containerType
*/
SpreadSheet.prototype.getColumnIndex = function (colId) {
	return _.findIndex(this.getHeader(),{id :colId});
};

/**
* Changes the number of rows in the grid
*
* @method updateNumberOfRows
* @param {Integer} n The new number of rows
*/
SpreadSheet.prototype.updateNumberOfRows = function (n) {
	if (this.spreadSheet) {
		var data = this.spreadSheet.getData();
		//Sets the appropiate number of rows according to the capacity
		if (data.length < n){
			for (var i = data.length + 1; i<= n; i++){
				data.push([i]);
			}
		}
		else{
			data = data.slice(0, n);
		}
		this.spreadSheet.loadData(data);
	}
};

/**
* Sets an empty value for all the cells in a given row
*
* @method emptyRow
* @param {Integer} row The row index to be emptied
*/
SpreadSheet.prototype.emptyRow = function (row) {
	var columnIds = this.getHeaderId();
	for (var i = 1 ; i < columnIds.length ; i++) {
		this.setDataAtCell(row,i,"");
	}
};
