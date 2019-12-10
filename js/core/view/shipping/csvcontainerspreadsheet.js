function CSVContainerSpreadSheet(args){
	this.id = BUI.id();


    this.cells = function(){		
		cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties){
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			td.style.fontWeight = 'bold';
			td.style.color = 'green';
			td.style.background = '#CEC';
		}
	}

	args.cells = this.cells;


	SpreadSheet.call(this, args);

    /** Cache to store crystal indexed by protein acronym this.crystals["acroynm"] -> last crystal */
    this.crystals = {};

	/** Cache of proteins of the sessions */
	this.proteins = {};
	/** Array of arrays with the list of crystal form by protein acronym */
    this.crystalFormList = {};

  	this.crystalFormIndex = -1;
	// this.unitCellIndex = -1;
	this.spaceGroupIndex = -1;
	
	this.onModified = new Event(this);

	this.count = 0;

	/** Colors for parcels */
	this.cellColorBackground = this.getParcelColors();
	
	this.parcelColorBackground = {};

	/** When getPanel it will load all the samples for this proposal */
	this.proposalSamples = [];

	/** Controlled list of values */
	if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
	this.containerTypeControlledList = [
											{ name:"Unipuck", capacity: 16 }
										];
    } else {
    this.containerTypeControlledList = [
    											{ name:"Unipuck", capacity: 16 },
    											{ name:"SPINEpuck", capacity:10 }
    										];
    }
	/** dewars names that already exist on this shipment. This object is supposed to be a SET */
	this.dewarNameControlledList = new Set();
	this.containerNameControlledList = new Set();

	/** It validates the data */
	this.puckValidator = new PuckValidator();

	/** Table Indices */
	this.PARCELNAME_INDEX = 0;
	this.CONTAINERNAME_INDEX = 1;
	this.CONTAINERTYPE_INDEX = 2;
	this.SAMPLEPOSITION_INDEX = 3;
	this.PROTEINACRONYM_INDEX = 4;
	this.SAMPLENAME_INDEX = 5;

	/** Validation errors */
	this.errors = this.resetErrors();

	
}

CSVContainerSpreadSheet.prototype.getPanel = SpreadSheet.prototype.getPanel;
CSVContainerSpreadSheet.prototype.setLoading = SpreadSheet.prototype.setLoading;
CSVContainerSpreadSheet.prototype.getAcronyms = SpreadSheet.prototype.getAcronyms;
CSVContainerSpreadSheet.prototype.getHeaderWidth = SpreadSheet.prototype.getHeaderWidth;
CSVContainerSpreadSheet.prototype.getHeaderId = SpreadSheet.prototype.getHeaderId;
CSVContainerSpreadSheet.prototype.getHeaderText = SpreadSheet.prototype.getHeaderText;
CSVContainerSpreadSheet.prototype.getColumns = SpreadSheet.prototype.getColumns;
CSVContainerSpreadSheet.prototype.getData = SpreadSheet.prototype.getData;
CSVContainerSpreadSheet.prototype.setDataAtCell = SpreadSheet.prototype.setDataAtCell;
CSVContainerSpreadSheet.prototype.getColumnIndex = SpreadSheet.prototype.getColumnIndex;
CSVContainerSpreadSheet.prototype.disableAll = SpreadSheet.prototype.disableAll;
CSVContainerSpreadSheet.prototype.setContainerType  = SpreadSheet.prototype.setContainerType;
CSVContainerSpreadSheet.prototype.updateNumberOfRows  = SpreadSheet.prototype.updateNumberOfRows;
CSVContainerSpreadSheet.prototype.emptyRow  = SpreadSheet.prototype.emptyRow;
CSVContainerSpreadSheet.prototype.parseTableData  = ContainerSpreadSheet.prototype.parseTableData;
CSVContainerSpreadSheet.prototype.disableAll  = ContainerSpreadSheet.prototype.disableAll;

CSVContainerSpreadSheet.prototype._getContainerTypeControlledListNames = function() {
	return _.map(this.containerTypeControlledList, "name");
};
/**
* Remove errors produced after validation
*
* @method resetErrors
* @return {Boolean} Return true if data is valid or false otherwise
*/
CSVContainerSpreadSheet.prototype.resetErrors = function() {
	return {
		INCORRECT_PARCEL_NAME : [],
		INCORRECT_CONTAINER_NAME : [],
		INCORRECT_CONTAINER_TYPE : [],
		INCORRECT_SAMPLE_POSITION : [],
		INCORRECT_SAMPLE_NAME : []
	};
};

/**
* Remove errors produced after validation
*
* @method resetErrors
* @return {Boolean} Return true if data is valid or false otherwise
*/
CSVContainerSpreadSheet.prototype.getErrors = function() {
	//this.resetErrors();
	//this.validateData();
	return this.errors;
};


/**
* This checks all rows and validate the data
*
* @method isDataValid
* @return {Boolean} isValid Return true if data is valid or false otherwise
*/
CSVContainerSpreadSheet.prototype.isDataValid = function() {
	/** Reset errors */
	this.errors = this.resetErrors();
	var data = this.spreadSheet.getData();
	var keySampleName = {};
	var isValid = true;
	for (var i = 0; i< data.length; i++){
		if (this.validateRow(data[i], i) == false){
			isValid = false;
		}
		/** Are protein + sample Names unique */
		var proteinName = data[i][this.PROTEINACRONYM_INDEX];
		var sampleName = data[i][this.SAMPLENAME_INDEX];
		var key = proteinName + "__" + sampleName;
		if (keySampleName[key] == null){
			keySampleName[key] = true;
		}
		else{
			isValid = false;			
		}
	}
	return isValid;
};

/**
* This checks all rows and validate the data
*
* @method validateData
* @param {Array} row A row for the handsontable
* @param {Array} rowIndex Index of the row in the table
* @return {Boolean} Return true if data is valid or false otherwise
*/
CSVContainerSpreadSheet.prototype.validateRow = function(row, rowIndex) {		
	var parcelName = row[this.PARCELNAME_INDEX];
	var containerName = row[this.CONTAINERNAME_INDEX];
	var containerType = row[this.CONTAINERTYPE_INDEX];
	var samplePosition = row[this.SAMPLEPOSITION_INDEX];
	var proteinName = row[this.PROTEINACRONYM_INDEX];	
	var sampleName = row[this.SAMPLENAME_INDEX];	

	if (this.isParcelNameValid(parcelName)){
		if (this.isContainerNameValid(containerName)){
			if (this.isContainerTypeValid(containerType)){
				if (this.isSamplePositionValid(containerType, samplePosition)){
					if (this.isSampleNameValid(sampleName, proteinName)){
						return true;
					}
					else{
						this.errors.INCORRECT_SAMPLE_NAME.push({
							value 		: samplePosition,
							rowIndex	: rowIndex
						});
					}					
				}
				else{
					this.errors.INCORRECT_SAMPLE_POSITION.push({
						value 		: samplePosition,
						rowIndex	: rowIndex
					});

				}
			}
			else{				
				this.errors.INCORRECT_CONTAINER_TYPE.push({
					value 		: containerType,
					rowIndex	: rowIndex
				});
			}
		}
		else{
			this.errors.INCORRECT_CONTAINER_NAME.push({
				value 		: containerName,
				rowIndex	: rowIndex
			});
		}
	}
	else{				
		this.errors.INCORRECT_PARCEL_NAME.push({
			value 		: parcelName,
			rowIndex	: rowIndex
		});
	}	
	return false;
};



/**
* Returns a list of objects that will contain colors for parent and containers nodes
*
* @method getParcelColors
*/
CSVContainerSpreadSheet.prototype.getParcelColors = function(){	
	return [{"color": "#0099ff", "containers" : [{"color":"#4db8ff"}, {"color":"#80ccff"}, {"color":"#b3e0ff"}, {"color":"#e6f5ff"}]}, 
			{"color": "#33cc33", "containers" : [{"color":"#5cd65c"},{"color":"#85e085"},{"color":"#adebad"},{"color":"#d6f5d6#"}]},
			{"color": "#ffbb33", "containers" : [{"color":"#ffcc66"},{"color":"#ffdd99"},{"color":"#ffeecc"}, {"color":"#fff7e6"}]},
			{"color": "#bb33ff", "containers" : [{"color":"#cc66ff"}, {"color":"#dd99ff"},{"color":"#e6b3ff"}, {"color":"#eeccff"}]}
	];
};

CSVContainerSpreadSheet.prototype.loadData = function(data){

      var _this = this;
	  function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    td.style.fontWeight = 'bold';
	    td.style.color = 'green';
	    td.style.fontSize = '9px';
	    td.style.background = '#CEC';
	  }
	  
	  function ValueRenderer(instance, td, row, col, prop, value, cellProperties) {
	        Handsontable.renderers.TextRenderer.apply(this, arguments);	        				
	  }
	  	  		
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);	 
	  this.spreadSheet = new Handsontable(
		  document.getElementById(this.id + '_samples'), {
		  		afterCreateRow: function (index, numberOfRows) {
                    data.splice(index, numberOfRows);
                },
				beforeChange: function (changes, source) {
					lastChange = changes;
				},
				afterChange: function (changes, source) {						  			
				},
				cells: function (row, col, prop) {														
				},
				data: data,
				height : this.height,
				width : this.width,
				manualColumnResize: true,
				colWidths: this.getHeaderWidth(),
				colHeaders: this.getHeaderText(),
				stretchH: 'last',
				columns: this.getColumns(),
		});
}

/** Parcels and dewars are the same */
CSVContainerSpreadSheet.prototype.getParcelsByRows = function(rows) {
	return _.groupBy(rows, "parcel");
};

CSVContainerSpreadSheet.prototype.getContainersByRows = function(rows) {
	return _.groupBy(rows, "containerCode");
};

CSVContainerSpreadSheet.prototype.getProteinByAcronym = function(acronym) {
	var proteins = EXI.proposalManager.getProteinByAcronym(acronym);
	if (proteins){
		if (proteins.length > 0){
			return proteins[0];
		}
	}
	return null;
};

CSVContainerSpreadSheet.prototype.emptyToNull = function(value) {
	if (value == ""){
		return null;
	}
	return value;

};
/**
* Returns a set of parcels
*
* @method getParcels
*/
CSVContainerSpreadSheet.prototype.getParcels = function() {
	var _this = this;
	function  getDiffrationPlanByRow(row){
		return {
			radiationSensivity 		: _this.emptyToNull(row["Radiation Sensitivity"]),
			aimedCompleteness 		: _this.emptyToNull(row["Aimed Completeness"]),
			aimedMultiplicity 		: _this.emptyToNull(row["Aimed Multiplicity"]),
			aimedResolution 		: _this.emptyToNull(row["Aimed Resolution"]),
			requiredResolution 		: _this.emptyToNull(row["Required Resolution"]),
			forcedSpaceGroup 		: _this.emptyToNull(row["forcedSpaceGroup"]),
			experimentKind 			: _this.emptyToNull(row["experimentKind"]),
			observedResolution 		: _this.emptyToNull(row["Observed Resolution"]),
			preferredBeamDiameter 	: _this.emptyToNull(row["Beam Diameter"]),
			numberOfPositions	 	: _this.emptyToNull(row["Number Of positions"]),
			axisRange	 			: _this.emptyToNull(row["axisRange"]),
			minOscWidth				: _this.emptyToNull(row["minOscWidth"])


		};		
	};

  

	function  getCrystalByRow(row){		
		return {
			spaceGroup 	: _this.emptyToNull(row["Space Group"]),
			cellA 		: _this.emptyToNull(row["a"]),
			cellB 		: _this.emptyToNull(row["b"]),
			cellC 		: _this.emptyToNull(row["c"]),
			cellAlpha 	: _this.emptyToNull(row["alpha"]),
			cellBeta 	: _this.emptyToNull(row["beta"]),
			cellGamma 	: _this.emptyToNull(row["gamma"]),
			proteinVO 	: _this.getProteinByAcronym(row["Protein Acronym"])
		};
	};

	function getSamplesByContainerRows(rows){
		var samples3vo = [];		
		if (rows){
			for(var i = 0; i< rows.length; i++){
				samples3vo.push({
					name : rows[i]["Sample Name"],
					location : rows[i]["position"],
					diffractionPlanVO : getDiffrationPlanByRow(rows[i]),
					crystalVO : getCrystalByRow(rows[i]),				
					smiles : rows[i]["Smiles"],
					comments: rows[i]["Comments"]

				});
			}
		}
		return samples3vo;
	};

	function getContainerType(rows){		
		if (rows){
			if (rows[0]){
				if (rows[0].containerType){
					return rows[0].containerType;
				}
			}
		}
	};

	function getContainerCapacity(rows){		
		if (rows){
			if (rows[0]){
				if (rows[0].containerType){
					 if (rows[0].containerType.toUpperCase() == "SPINEPUCK"){
						 return 10;
					 }
					 return 16;
				}
			}
		}
	};
		
	var rows = this.parseTableData();			
	var dewars3vo = [];
	var parcels = this.getParcelsByRows(rows);
	for(var parcel in parcels){
		
		/** dewars3vo: JSON object with perfect macthing with 3VO ISPyB objects */
		var containerVOs = [];
		var containers = this.getContainersByRows(parcels[parcel]);
		for (key in containers){
			var containerRows = containers[key];						
			containerVOs.push({
				code : _.trim(containerRows[0].containerCode),		
				containerType : getContainerType(containerRows),
				capacity :		getContainerCapacity(containerRows),
				sampleVOs : getSamplesByContainerRows(containerRows)
			});						
		}
		
		dewars3vo.push({
			code : _.trim(parcel),
			type : 'Dewar',
			containerVOs : containerVOs
		});		
	}	
	debugger       
	return dewars3vo;
};


/**
* This method set the property containerNameControlledList as a Set
*
* @method setContainerNameControlledList
* @param {Array} containerNameControlledList list of names of all containers for this shipment
*/
CSVContainerSpreadSheet.prototype.setContainerNameControlledList = function (containerNameControlledList){	
	this.containerNameControlledList = new Set(containerNameControlledList);	
};


/**
* This method set the property dewarNameControlledList as a Set
*
* @method setDewarNameControlledList
* @param {Array} dewarNameControlledList list of names of all dewars for this shipment
*/
CSVContainerSpreadSheet.prototype.setDewarNameControlledList = function (dewarNameControlledList){
	this.dewarNameControlledList = new Set(dewarNameControlledList);	
};

/**
* Method executed when a change is made on the spreadSheet. It manages the process when the crystal form or the protein acronym are changed
*
* @method manageChange
* @param {Array} change The change made to the spreadSheet as an array of the form [row, column, prevValue, newValue]
* @param {String} source The kind of change. Can be "edit" or "autofill"
* @param {Integer} direction In case of the source being autofill, this parameter indicates the direction of it
*/
CSVContainerSpreadSheet.prototype.manageChange = function (change, source, direction){
	var rowIndex = change[0];
	var prevValue = change[3];

	switch (change[1]) { //Column Index

		/** If crystal form has changed */
		case this.crystalFormIndex : {					
			break;
		}

	    /** If acronym form has changed */
		case this.getColumnIndex("Protein Acronym") : {		
           
			break;
		}

		 /** If sample name form has changed */
		case this.getColumnIndex("Sample group") : {		
          
			break;
		}
	}
	
	$(".htInvalid").removeClass("htInvalid");	
};


CSVContainerSpreadSheet.prototype.getParcelColor = function(parcelName) {
	if (!this.parcelColorBackground[parcelName]){
		this.parcelColorBackground[parcelName] = this.cellColorBackground[_.size(this.parcelColorBackground)%this.cellColorBackground.length];
		/** add parcel name to get the container colors later on */
		this.parcelColorBackground[parcelName].name = parcelName;
	}	
	return this.parcelColorBackground[parcelName].color;
};

CSVContainerSpreadSheet.prototype.getContainerColor = function(parcelName, containerName) {	
	if (this.parcelColorBackground[parcelName]){
		var assignedColorIndex = _.findIndex(_.map(this.parcelColorBackground[parcelName].containers, "name"), function(o){return o == containerName;})
		if (assignedColorIndex == -1){
			for (var i = 0; i < this.parcelColorBackground[parcelName].containers.length; i++){
				if (!this.parcelColorBackground[parcelName].containers[i].name){
					this.parcelColorBackground[parcelName].containers[i].name = containerName;
					return this.parcelColorBackground[parcelName].containers[i].color;
				}
			}
		}
		else{
			return this.parcelColorBackground[parcelName].containers[assignedColorIndex].color;
		}
	}
	return "#FFFFFF";	
};

/**
 * Checks the containerType. It checks that it is not empty, not null and it is in the controlled list of values "containerTypeControlledList"
 * @method checkContainerType
 *  @param {String} containerType Type of container read from the CSV file
 * @return {Boolean} Returns true if container type is ok or false if container type is not valid
 */
CSVContainerSpreadSheet.prototype.isContainerTypeValid = function(containerType) {	
	if (containerType){		
		if ((containerType != undefined)||(value != "")){
			var foundContainerType = _.find(this.containerTypeControlledList, function(o){return o.name == containerType});
			if (foundContainerType){
					return true;
			}			
		}
	}
	return false;
};



/**
 * Checks the sample Position. It checks the containerType and checks that position of the sample is < capacity of the dewar
 * @method isSamplePositionValid
 * @param {String} containerType Type of container read from the CSV file
 * @param {String} samplePosition Position of the sample within the container
 * @return {Boolean} Returns true if container type is ok or false if container type is not valid
 */
CSVContainerSpreadSheet.prototype.isSamplePositionValid = function(containerType, samplePosition) {	
	/** Check that container puck is in  containerTypeControlledList */
	var containerType = _.find(this.containerTypeControlledList, function(o){return o.name == containerType});
	if (containerType == null){
		return false;
	}		
	
	if(containerType == null){
		return false;
	}	
	else{
		try{
			if(containerType.capacity < parseInt(samplePosition)){
				return false;	
			}
		}	
		catch(e){
			return false;
		}
	}
	return true;
};


/**
 * Checks the value. It checks that it is not empty and not null
 * @method isValueFilled
 *  @param {String} containerType Type of container read from the CSV file
 * @return {Boolean} Returns true if value is filled
 */
CSVContainerSpreadSheet.prototype.isValueFilled = function(value) {	
	if ((value == undefined)||(value == "")){					
			return false;		
	}
	return true;
};

/**
 * Checks the name of the parcel. It checks that parcel name does not exist within the shipment. It means in the list of dewarNameControlledList
 * @method isParcelNameValid
 *  @param {String} parcelName Name of the parcel read from CSV
 * @return {Boolean} Returns true if name of the parcel is ok
 */
CSVContainerSpreadSheet.prototype.isParcelNameValid = function(parcelName) {			
	if ((parcelName == undefined)||(parcelName == "")){					
			return false;		
	}
	if (this.dewarNameControlledList.has(parcelName)){
		return false;
	}
	return true;
};


/**
 * Checks the name of the sample. (ProteinId + sample name) should be unique for the whole proposal and not empty or null
 * @method isSampleNameValid
 *  @param {String} parcelName Name of the parcel read from CSV
 * @return {Boolean} Returns true if name of the parcel is ok
 */
CSVContainerSpreadSheet.prototype.isSampleNameValid = function(sampleName, proteinName) {			
	if ((sampleName == undefined)||(sampleName == "")){					
			return false;		
	}
	var protein = this.getProteinByAcronym(proteinName);
	if (protein){
		var conflicts = this.puckValidator.checkSampleNames([sampleName], [protein.proteinId], null, this.proposalSamples);
		if (conflicts){
			if (conflicts.length > 0){
				return false;
			}
			return true;
		}
		else{
			return true;
		}
	}
	else{
		return false;
	}
	
};

/**
 * Checks the name of the container.
 * @method isContainerNameValid
 *  @param {String} parcelName Name of the parcel read from CSV
 * @return {Boolean} Returns true if name of the container is ok
 */
CSVContainerSpreadSheet.prototype.isContainerNameValid = function(containerName) {
	if (this.containerNameControlledList.has(containerName)){
		return false;
	}
	return true;
};


CSVContainerSpreadSheet.prototype.getHeader = function() {	
    var _this = this;
	var header = [];

	var disabledRenderer = function(instance, td, row, col, prop, value, cellProperties){
		if (value != undefined){
			td.innerHTML = value;
		}
		td.style.background = '#DDD';
	}

	var mandatoryParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){				
		if (!_this.isValueFilled(value)){				
			td.className = 'custom-row-text-required';			
		}		
		td.innerHTML = value;		
	}

	var numericParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){						
		try{
			if ((value == undefined)||(value == "")){		
				td.innerHTML = value;				
			}
			else{				
				if (isNaN(value)){
					td.className = 'custom-row-text-required';			
					td.innerHTML = value;
				}
				else{
					td.innerHTML = parseFloat(value);				
				}
			}
		}	
		catch(e){
			td.className = 'custom-row-text-required';			
			td.innerHTML = value;									
		}		
		
	}


	var proteinParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){	
		if ((value == undefined)||(value == "")){					
			td.className = 'custom-row-text-required';			
			return;
		}
		
		var protein = _.find(_this.getAcronyms(), function(o){ return o==value;});		
		if (!protein){
			td.className = 'custom-row-text-required';			
		}		
		td.innerHTML = value;		
		
	}

	var sampleParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){	
		/** For testing purposes
		if (value != null){
			if (value.length < 8){						
				value =value + 	Math.random();
				instance.setDataAtCell(row, col, value);
			}
		} **/
		var proteinName = instance.getSourceDataAtCell(row, _this.PROTEINACRONYM_INDEX);				
		if (!_this.isSampleNameValid(value, proteinName)){					
			td.className = 'custom-row-text-required';			
		}
		
		td.innerHTML = value;		
				
	}
    /** Checking parcels name */
	var parcelDisplayCell = function(instance, td, row, col, prop, value, cellProperties){				
			if (!_this.isParcelNameValid(value)){
				td.className = 'custom-row-text-required';
			}	
			else{			
				td.style.background = 	_this.getParcelColor(value);
			}
			td.innerHTML = value;				
	}

    /** Checking containers name */
	var containerNameParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){						
			if (_this.containerNameControlledList.has(value)){
				td.className = 'custom-row-text-required';
			}
			else{			
				td.style.background = _this.getContainerColor(instance.getDataAtCell(row, col-1), value);
			}
			td.innerHTML = value;							
	}
	 
	 /** Checking containers type */
	 var containerTypeParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){		
		 	if (_this.isContainerTypeValid(value) == false){
				td.className = 'custom-row-text-required';
			 }					
			td.innerHTML = value;		
	}

	 var samplePositionParameterRenderer = function(instance, td, row, col, prop, value, cellProperties){			 		 
		 	var rowContainerType = instance.getSourceDataAtCell(row, _this.CONTAINERTYPE_INDEX);
			 if (!_this.isSamplePositionValid(rowContainerType, value)){
				 td.className = 'custom-row-text-required';
			 }				
			td.innerHTML = value;										
	}

	/*if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
        header = [
            // { text :'', id :'crystalId', column : {width : 100}},
            { text : 'Parcel  <br /> Name', 	id: 'parcel', column : {width : 80, renderer: parcelDisplayCell}},
			{ text : 'Container <br /> Name', 	id: 'containerCode', column : {width : 80, renderer: containerNameParameterRenderer}},
			{ text : 'Container <br />Type', 	id: 'containerType', column : {width : 80,
																				type: 'dropdown',
																				source : this._getContainerTypeControlledListNames(),
																				renderer: containerTypeParameterRenderer}},
			{ text : '#', 	id: 'position', column : {width : 20, renderer: samplePositionParameterRenderer}},
            { text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
                                                                                        width : 80,
                                                                                        type: 'dropdown',
																						renderer: proteinParameterRenderer,
                                                                                        source: this.getAcronyms()
                                                                                    }
            },
            { text :'Sample<br /> Name', id :'Sample Name', column : {
																		width : 120,
																	  	renderer: sampleParameterRenderer
			}},
            { text :'Pin <br />Barcode', id : 'Pin BarCode', column : {width : 60}},
            { text :'Comments', id :'Comments', column : {width : 200}}
            ];
	} else {*/
	 
        header = [
            // { text :'', id :'crystalId', column : {width : 100}}, 
            { text : 'Parcel  <br /> Name', 	id: 'parcel', column : {width : 80, renderer: parcelDisplayCell}}, 
			{ text : 'Container <br /> Name', 	id: 'containerCode', column : {width : 80, renderer: containerNameParameterRenderer}}, 
			{ text : 'Container <br />Type', 	id: 'containerType', column : {width : 80, 
																				type: 'dropdown',
																				source : this._getContainerTypeControlledListNames(),
																				renderer: containerTypeParameterRenderer}}, 
			{ text : '#', 	id: 'position', column : {width : 20, renderer: samplePositionParameterRenderer}},
            { text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
                                                                                        width : 80,
                                                                                        type: 'dropdown',
																						renderer: proteinParameterRenderer,
                                                                                        source: this.getAcronyms()
                                                                                    }
            }, 
            { text :'Sample<br /> Name', id :'Sample Name', column : {
																		width : 120,
																	  	renderer: sampleParameterRenderer	
			}}, 
            { text :'Pin <br />Barcode', id : 'Pin BarCode', column : {width : 60}},  
            { text :'Space <br />group',  id : 'Space Group', column : {
                                                                        width : 40,  
                                                                        type: 'dropdown',																																			    
																		source: _.concat([""], ExtISPyB.spaceGroups)
                                                                    }}, 
            { text :'a',  id :'a', column : {width : 25, renderer:numericParameterRenderer}}, 
			{ text :'b',  id :'b', column : {width :25, renderer:numericParameterRenderer}}, 
			{ text :'c',  id :'c', column : {width :25, renderer:numericParameterRenderer}}, 
			{ text :'&alpha;',  id :'alpha', column : {width : 25, renderer:numericParameterRenderer}}, 
			{ text :'&beta;',  id :'beta', column : {width : 25, renderer:numericParameterRenderer}}, 
			{ text :'&gamma;',  id :'gamma', column : {width :25, renderer:numericParameterRenderer }}, 
			
            { text :'Exp.<br /> Type', id : 'experimentKind', column : {
                                                                        width : 90,  
                                                                        type: 'dropdown',																		
                                                                        source: [ "", "MXPressE", "MXPressF", "MXPressO", "MXPressI", "MXPressE_SAD", "MXScore", "MXPressM", "MXPressP", "MXPressP_SAD" ]
                                                                    }
            }, 
           { text :'Aimed <br />Resolution', id :'Aimed Resolution',column : {width : 60, renderer:numericParameterRenderer}},
		   { text :'Required <br />Resolution', id :'Required Resolution',column : {width : 60, renderer:numericParameterRenderer}},
         
            { text :'Beam <br />Diameter', id :'Beam Diameter',column : {width : 60, renderer:numericParameterRenderer}}, 
            { text :'Number of<br /> positions', id :'Number Of positions', column : {width : 60, renderer:numericParameterRenderer}},
			{ text :'Aimed<br /> Multiplicity', id :'Aimed Multiplicity', column : {width : 60, renderer:numericParameterRenderer}}, 
            { text :'Aimed<br /> Completeness', id :'Aimed Completeness', column : {width : 80, renderer:numericParameterRenderer}},  
			{ text :'Forced <br /> SPG',  id :'forcedSpaceGroup', column : {
                                                                        width : 60,  
                                                                        type: 'dropdown',
																		source: _.concat([""], ExtISPyB.spaceGroups)
                                                                    }}, 
            { text :'Radiation<br /> Sensitivity', id :'Radiation Sensitivity', column : {width : 60, renderer:numericParameterRenderer}}, 

                     
			

            { text :'SMILES', id :'Smiles', column : {width : 60}}, 
			{ text :'Tot Rot. <br />Angle', id :'axisRange',column : {width : 60, renderer:numericParameterRenderer}},
			{ text :'Min Osc.<br />Angle', id :'minOscWidth',column : {width : 60, renderer:numericParameterRenderer}},
			{ text :'Observed <br />Resolution', id :'Observed Resolution',column : {width : 60, renderer:numericParameterRenderer}},
            { text :'Comments', id :'Comments', column : {width : 200}}
            ];
   /* }*/

    

    return header;
};
