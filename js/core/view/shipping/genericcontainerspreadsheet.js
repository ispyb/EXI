function GenericContainerSpreadSheet(args){
	this.id = BUI.id();
	SpreadSheet.call(this, args);
}

GenericContainerSpreadSheet.prototype.getPanel = SpreadSheet.prototype.getPanel;
GenericContainerSpreadSheet.prototype.setLoading = SpreadSheet.prototype.setLoading;
GenericContainerSpreadSheet.prototype.getAcronyms = SpreadSheet.prototype.getAcronyms;
GenericContainerSpreadSheet.prototype.getHeaderWidth = SpreadSheet.prototype.getHeaderWidth;
GenericContainerSpreadSheet.prototype.getHeaderId = SpreadSheet.prototype.getHeaderId;
GenericContainerSpreadSheet.prototype.getHeaderText = SpreadSheet.prototype.getHeaderText;
GenericContainerSpreadSheet.prototype.getColumns = SpreadSheet.prototype.getColumns;
GenericContainerSpreadSheet.prototype.parseTableData = SpreadSheet.prototype.parseTableData;
GenericContainerSpreadSheet.prototype.getData = SpreadSheet.prototype.getData;
GenericContainerSpreadSheet.prototype.loadData = SpreadSheet.prototype.loadData;
GenericContainerSpreadSheet.prototype.setDataAtCell = SpreadSheet.prototype.setDataAtCell;
GenericContainerSpreadSheet.prototype.getColumnIndex = SpreadSheet.prototype.getColumnIndex;
GenericContainerSpreadSheet.prototype.disableAll = SpreadSheet.prototype.disableAll;
GenericContainerSpreadSheet.prototype.setContainerType  = SpreadSheet.prototype.setContainerType ;

GenericContainerSpreadSheet.prototype.load = function(container){
	var _this = this;
	this.container = container;
	var domElement = document.getElementById(this.id + '_samples');
    
	  function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    td.style.fontWeight = 'bold';
	    td.style.color = 'green';
	    td.style.fontSize = '9px';
	    td.style.background = '#CEC';
	  }
	  
	  function ValueRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    if (!instance.getDataAtRow(row)[1]){
	    	td.style.background = '#EEE';
	    	return;
	    }
	    
	    if ((col == 2)){
		    	if (!value || value == '') {
		    		td.className = 'custom-row-text-required';
		  	    }
	    }
		if ((col == _this.unitCellIndex) || col == _this.spaceGroupIndex) {
			td.style.background = '#EEE';
		}
	  }

	  
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);
	  this.spreadSheet = new Handsontable(domElement, {
				beforeChange: function (changes, source) {
					lastChange = changes;
				},
				data: this.getSamplesData(container),
			
				height : this.height,
				width : this.width,
				manualColumnResize: true,
				colWidths: this.getHeaderWidth(),
				colHeaders: this.getHeaderText(),
				stretchH: 'last',
				columns: this.getColumns(),
		});
};

/**
* Returns an array of arrays for each sample in the given container up to the container's capacity ordered according to the grid
*
* @method getSamplesData
* @param {Object} container The container which's samples are parsed
*/
GenericContainerSpreadSheet.prototype.getSamplesData = function(container) {
    var data = [];
    for (var i = 0; i < container.capacity; i++) {
        if (container.samples){
            if (i < container.samples.length){
                var sample = container.samples[i];
                data.push(
                    [(i+1),sample.Protein_acronym, sample.Protein_name, sample.BLSample_comments]
                );
            } else {
                data.push([(i+1)]);
            }
        } else {
            data.push([(i+1)]);
        }
    }

    return data;
}

GenericContainerSpreadSheet.prototype.getHeader = function() {
    var header = [];
    header = [{ text : '#', 	id: 'position', column : {width : 20}}, 
				{ text :'Samplesheet <br />Acronym', id :'Protein Acronym', 	column :  {
																							width : 100,
																							type: 'dropdown',
																							source: this.getAcronyms()
																						}
				}, 
				{ text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}},
				{ text :'Comments', id :'Comments', column : {width : 200}}
				];

    return header;
}

/**
* Returns a puck object with the corresponding samples from the grid
*
* @method getPuck
*/
GenericContainerSpreadSheet.prototype.getPuck = function() {
    var rows = this.parseTableData();
    var myPuck = {};
    myPuck.sampleVOs = this.container.samples;

    function filterByLocation(samples){
        return _.filter(samples, function(b){return b.BLSample_location == rows[i].location;} );
    }
    
    for (var i = 0; i < rows.length; i++) {
        var sample = {};
        var sampleByLocation = filterByLocation(myPuck.sampleVOs);
        if (sampleByLocation.length > 0){
            /** new sample */
		    sample = sampleByLocation[0];
        }

        sample["name"] = rows[i]["Sample Name"];
        sample["location"]= rows[i]["location"];
		sample["comments"] = rows[i]["Comments"];
        sample["crystalVO"] = {};
        sample["diffractionPlanVO"] = {};

        myPuck.sampleVOs.push(sample);
    }

    return myPuck;
}