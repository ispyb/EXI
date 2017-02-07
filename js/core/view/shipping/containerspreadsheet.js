function ContainerSpreadSheet(args){
	this.id = BUI.id();
	SpreadSheet.call(this, args);

    this.renderCrystalFormColumn = false;

    if (args != null) {
		if (args.renderCrystalFormColumn != null) {
			this.renderCrystalFormColumn = args.renderCrystalFormColumn;
		}
	}

    this.crystalInfoToIdMap = {};

	this.crystalFormIndex = -1;
	// this.unitCellIndex = -1;
	this.spaceGroupIndex = -1;
	
	this.onModified = new Event(this);

}

ContainerSpreadSheet.prototype.getPanel = SpreadSheet.prototype.getPanel;
ContainerSpreadSheet.prototype.setLoading = SpreadSheet.prototype.setLoading;
ContainerSpreadSheet.prototype.getAcronyms = SpreadSheet.prototype.getAcronyms;
ContainerSpreadSheet.prototype.getHeaderWidth = SpreadSheet.prototype.getHeaderWidth;
ContainerSpreadSheet.prototype.getHeaderId = SpreadSheet.prototype.getHeaderId;
ContainerSpreadSheet.prototype.getHeaderText = SpreadSheet.prototype.getHeaderText;
ContainerSpreadSheet.prototype.getColumns = SpreadSheet.prototype.getColumns;
ContainerSpreadSheet.prototype.parseTableData = SpreadSheet.prototype.parseTableData;
ContainerSpreadSheet.prototype.getData = SpreadSheet.prototype.getData;
ContainerSpreadSheet.prototype.loadData = SpreadSheet.prototype.loadData;
ContainerSpreadSheet.prototype.setDataAtCell = SpreadSheet.prototype.setDataAtCell;
ContainerSpreadSheet.prototype.getColumnIndex = SpreadSheet.prototype.getColumnIndex;
ContainerSpreadSheet.prototype.disableAll = SpreadSheet.prototype.disableAll;
ContainerSpreadSheet.prototype.setContainerType  = SpreadSheet.prototype.setContainerType;
ContainerSpreadSheet.prototype.updateNumberOfRows  = SpreadSheet.prototype.updateNumberOfRows;
ContainerSpreadSheet.prototype.emptyRow  = SpreadSheet.prototype.emptyRow;

ContainerSpreadSheet.prototype.load = function(puck){
	var _this = this;
	this.puck = puck;
	var container = document.getElementById(this.id + '_samples');
	this.crystalFormIndex = this.getColumnIndex('Crystal Form');
	// this.unitCellIndex = this.getColumnIndex('Unit cell');
	this.spaceGroupIndex = this.getColumnIndex("Space Group");
	var data = this.getSamplesData(puck);
    
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
		if (/*(col == _this.unitCellIndex) || */col == _this.spaceGroupIndex) {
			td.style.background = '#EEE';
		}
	  }

	  
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);
	  this.spreadSheet = new Handsontable(container, {
		  		afterCreateRow: function (index, numberOfRows) {
                    data.splice(index, numberOfRows);
                },
				beforeChange: function (changes, source) {
					lastChange = changes;
				},
				afterChange: function (changes, source) {
                    $(".htInvalid").removeClass("htInvalid");
					$(".edit-crystal-button").click(function(sender){
								var row = sender.target.id.split("-")[2];
								var crystal = _this.parseCrystalFormColumn(_this.getData()[row][_this.crystalFormIndex],row);
								_this.showEditForm(crystal,row);
							});
					if (source == "edit") {
						if (changes) {
							for (var i = 0 ; i < changes.length ; i++) {
								var change = changes[i];
								if (change[2] != change[3]) {
									_this.manageChange(change, source);
								}
							}
						}
					} else if (source == "autofill") {
						if (changes){
							/**Get the direction of the autofill and manage the change following that direction*/
							var direction = Math.sign(changes[0][0] - _this.spreadSheet.getSelected()[0]);
							if (direction == 1){
								for (var i = 0 ; i < changes.length ; i++) {
									var change = changes[i];
									if (change[2] != change[3]) {
										_this.manageChange(change, source, direction);
									}
								}
							} else {
								for (var i = changes.length - 1 ; i >= 0 ; i--) {
									var change = changes[i];
									if (change[2] != change[3]) {
										_this.manageChange(change, source, direction);
									}
								}
							}
						}
					}
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
};

/**
* Returns an array of arrays for each sample in the given container up to the container's capacity ordered according to the grid
*
* @method getSamplesData
* @param {Object} puck The container which's samples are parsed
*/
ContainerSpreadSheet.prototype.getSamplesData = function(puck) {
    var data = [];
    var samples = puck.sampleVOs;
    /** Sorting samples by location * */
    samples.sort(function(a,b){return Number(a.location) - Number(b.location);});
    function getSampleByLocation(samples, location){
        for (var i = 0; i < samples.length; i++) {
            if (samples[i].location == Number(location)){
                return samples[i];
            }
        }
    }

    function getValue(value){
        if (!value){return "";}
        return value;
    }
		
    for (var i = 0; i < puck.capacity; i++) {
        var sample = getSampleByLocation(samples, i + 1);
        if (sample!= null){
                var crystal = sample.crystalVO;
                var protein = crystal.proteinVO;
                var diffraction = sample.diffractionPlanVO;
                if (diffraction == null){
                    diffraction = {};
                }
                data.push(
                    [
                        // crystal.crystalId,
                        (i+1), 
                        protein.acronym, sample.name, this.getCrystalInfo(crystal), diffraction.experimentKind, sample.BLSample_code ,  getValue(diffraction["observedResolution"]),  diffraction.requiredResolution, diffraction.preferredBeamDiameter, 
                        diffraction.numberOfPositions, diffraction.radiationSensitivity, diffraction.requiredMultiplicity, diffraction.requiredCompleteness,
						// this.getUnitCellInfo(crystal),
						crystal.spaceGroup, sample.smiles, sample.comments
                    ]
                );
        }
        else{
            data.push([(i+1)]);
        }
    }
	return data;
};

ContainerSpreadSheet.prototype.getHeader = function() {
    var _this = this;
	var header = [];
	var disabledRenderer = function(instance, td, row, col, prop, value, cellProperties){
		if (value != undefined){
			td.innerHTML = value;
		}
		td.style.background = '#DDD';
	}
	var editCrystalFormRenderer = function(instance, td, row, col, prop, value, cellProperties){
		if (value != undefined){
			td.innerHTML = value;
		}
	}
    header = [
            // { text :'', id :'crystalId', column : {width : 100}}, 
            { text : '#', 	id: 'position', column : {width : 20}}, 
            { text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
                                                                                        width : 80,
                                                                                        type: 'dropdown',
                                                                                        source: this.getAcronyms()
                                                                                    }
            }, 
            { text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}}, 
            { text :'Crystal<br /> Form', id : 'Crystal Form',column : {
                                                                        width : 250,
                                                                        type: 'dropdown',
                                                                        source: function(query, process) {
                                                                            var colIndex = _this.getColumnIndex("Protein Acronym");
                                                                            var protein = EXI.proposalManager.getProteinByAcronym(this.instance.getDataAtCell(this.row,colIndex));
                                                                            if (protein.length > 0){
                                                                                process(_this.getCrystalInfoByProtein(protein[0]));
                                                                            } else {
                                                                                process([]);
                                                                            }
                                                                        }
                                                                    }
                                                                }, 
            { text :'Exp.<br /> Type', id : 'Experiment Type', column : {
                                                                        width : 80,  
                                                                        type: 'dropdown',
                                                                        source: [ "Default", "MXPressE", "MXPressO", "MXPressI", "MXPressE_SAD", "MXScore", "MXPressM" ]
                                                                    }
            }, 
            { text :'Pin <br />BarCode', id : 'Pin BarCode', column : {width : 60}},  
            { text :'Pre-observed <br />resolution', id : 'Pre-observed resolution', column : {width : 80}}, 
            { text :'Needed<br /> resolution',  id :'Needed resolution', column : {width : 60}}, 
            { text :'Pref. <br />Diameter', id :'Pref. Diameter',column : {width : 60}}, 
            { text :'Number of<br /> positions', id :'Number Of positions', column : {width : 80}}, 
            { text :'Radiation<br /> Sensitivity', id :'Radiation Sensitivity', column : {width : 80}}, 
            { text :'Required<br /> multiplicity', id :'Required multiplicity', column : {width : 60}}, 
            { text :'Required<br /> Completeness', id :'Required Completeness', column : {width : 80}}, 
            // { text :'Unit Cell', id :'Unit cell', column : {width : 150, renderer: disabledRenderer, editor : false, readOnly: true}}, 
            { text :'Space <br /> Group', id :'Space Group', column : {width : 55, renderer: disabledRenderer, editor : false, readOnly: true}}, 
            { text :'Smiles', id :'Smiles', column : {width : 140}}, 
            { text :'Comments', id :'Comments', column : {width : 200}}
            ];

    if (this.renderCrystalFormColumn) {
        header.push({ text :'Edit Crystal Form', id :'editCrystalForm', column : {width : 200, renderer: editCrystalFormRenderer, editor : false, readOnly: true}});
    }

    return header;
};


/**
* Returns a puck object with the corresponding samples from the grid
*
* @method getPuck
*/
ContainerSpreadSheet.prototype.getPuck = function() {
	var myPuck = JSON.parse(JSON.stringify(this.puck));
	var rows = this.parseTableData();
    
    var aux = [];
    
    function filterByLocation(samples){
        return _.filter(samples, function(b){return b.location == rows[i].location;} );
    }
	for (var i = 0; i < rows.length; i++) {
        var sample = {};
        var sampleByLocation = filterByLocation(myPuck.sampleVOs);
        if (sampleByLocation.length > 0){
            /** new sample */
		    sample = sampleByLocation[0];
        } 
        
		sample["name"] = rows[i]["Sample Name"];
		sample["BLSample_code"] = rows[i]["Pin BarCode"];
		sample["smiles"] = rows[i]["Smiles"];
		sample["location"]= rows[i]["location"];
		sample["comments"] = rows[i]["Comments"];
        var proteins = [];
		if (sample["crystalVO"] == null){
			sample["crystalVO"] = {};
			proteins = EXI.proposalManager.getProteinByAcronym(rows[i]["Protein Acronym"]);
			if (proteins != null){
				sample["crystalVO"]["proteinVO"] = proteins[0];
			}
		}
        else{
            proteins = EXI.proposalManager.getProteinByAcronym(rows[i]["Protein Acronym"]);
			if (proteins != null){
				sample["crystalVO"]["proteinVO"] = proteins[0];
			}
        }
		var crystal = this.parseCrystalFormColumn(rows[i]["Crystal Form"],i);
		sample["crystalVO"]["spaceGroup"] = (crystal.spaceGroup) ? crystal.spaceGroup : "";
		sample["crystalVO"]["cellA"] = crystal.cellA;
		sample["crystalVO"]["cellB"] = crystal.cellB;
		sample["crystalVO"]["cellC"] = crystal.cellC;
		sample["crystalVO"]["cellAlpha"] = crystal.cellAlpha;
		sample["crystalVO"]["cellBeta"] = crystal.cellBeta;
		sample["crystalVO"]["cellGamma"] = crystal.cellGamma;
		
		sample["diffractionPlanVO"] = {};
		sample["diffractionPlanVO"]["radiationSensitivity"]= Number(rows[i]["Radiation Sensitivity"]);
		sample["diffractionPlanVO"]["requiredCompleteness"]= Number(rows[i]["Required Completeness"]);
		sample["diffractionPlanVO"]["requiredMultiplicity"]= Number(rows[i]["Required multiplicity"]);
		sample["diffractionPlanVO"]["requiredResolution"]= Number(rows[i]["Needed resolution"]);
		sample["diffractionPlanVO"]["observedResolution"]= Number(rows[i]["Pre-observed resolution"]);
		sample["diffractionPlanVO"]["preferredBeamDiameter"]= Number(rows[i]["Pref. Diameter"]);
		sample["diffractionPlanVO"]["numberOfPositions"]= Number(rows[i]["Number Of positions"]);
		sample["diffractionPlanVO"]["experimentKind"]= rows[i]["Experiment Type"];
		aux.push(sample);
		
	}
    myPuck.sampleVOs = aux;

    
	return myPuck;
};

ContainerSpreadSheet.prototype.setRenderCrystalFormColumn = function(bool) {
	this.renderCrystalFormColumn = bool;
};

/**
* Returns an object containing the crystal information given the value at the crystal form column
*
* @method parseCrystalFormColumn
* @param {String} dataAtCrystalFormColumn The string containing the information with the space group and the cell values
* @param {Integer} row The corresponding row
*/
ContainerSpreadSheet.prototype.parseCrystalFormColumn = function (dataAtCrystalFormColumn,row) {
	var parsed = {
					spaceGroup 	: null,
					cellA		: null,
					cellB		: null,
					cellC		: null,
					cellAlpha	: null,
					cellBeta	: null,
					cellGamma	: null
				};
	if (dataAtCrystalFormColumn != "" && dataAtCrystalFormColumn != null){
		var proteins = EXI.proposalManager.getProteinByAcronym(this.spreadSheet.getDataAtCell(row,this.getColumnIndex("Protein Acronym")));
		if (proteins && proteins.length > 0) {
			parsed.proteinVO = proteins[0];
		}
		if (dataAtCrystalFormColumn == "NEW") {
			parsed.spaceGroup = "NEW";
			parsed.crystalId = "";
		} else {
			if (this.crystalInfoToIdMap[dataAtCrystalFormColumn]){
				parsed.crystalId = this.crystalInfoToIdMap[dataAtCrystalFormColumn];
			} else {
				this.getCrystalInfoByProtein(proteins[0]);
				parsed.crystalId = this.crystalInfoToIdMap[dataAtCrystalFormColumn];
			}
			var splitted = dataAtCrystalFormColumn.split("-");
			parsed.spaceGroup = splitted[0].trim();
			if (splitted.length > 1){
				var cells = (splitted[1] + "-" + splitted[2]).trim().replace(/[{()}]/g, '').replace(/\s+/g,"");;
				parsed.cellA = (cells.split("-")[0].split(",")[0] == "null")? null : cells.split("-")[0].split(",")[0];
				parsed.cellB = (cells.split("-")[0].split(",")[1] == "null")? null : cells.split("-")[0].split(",")[1];
				parsed.cellC = (cells.split("-")[0].split(",")[1] == "null")? null : cells.split("-")[0].split(",")[2];
				parsed.cellAlpha = (cells.split("-")[1].split(",")[0] == "null")? null : cells.split("-")[1].split(",")[0];
				parsed.cellBeta = (cells.split("-")[1].split(",")[1] == "null")? null : cells.split("-")[1].split(",")[1];
				parsed.cellGamma = (cells.split("-")[1].split(",")[2] == "null")? null : cells.split("-")[1].split(",")[2];
			} else {
				parsed.cellA = 0;
				parsed.cellB = 0;
				parsed.cellC = 0;
				parsed.cellAlpha = 0;
				parsed.cellBeta = 0;
				parsed.cellGamma = 0;
			}
		}
	}
	return parsed;
};

/**
* Returns an string of the form [spaceGroup - (cellA : cellB : cellC | cellAlpha : cellBeta : cellGamma)]
*
* @method getCrystalInfo
* @param {Object} crystal The crystal used to extract the values
*/
ContainerSpreadSheet.prototype.getCrystalInfo = function (crystal) {
    try {
        if (crystal.cellA == null) {
            return crystal.spaceGroup + " - undefined";
        } else if (crystal.cellA == 0 && crystal.cellB == 0 && crystal.cellC == 0 && crystal.cellAlpha == 0 && crystal.cellBeta == 0 && crystal.cellGamma == 0 ){
            return crystal.spaceGroup
        }
        return crystal.spaceGroup + " - (" + crystal.cellA + " , " + crystal.cellB + " , " + crystal.cellC + " - " + crystal.cellAlpha + " , " + crystal.cellBeta + " , " + crystal.cellGamma + ")";
    } catch (e) {
        return "";
    }
};

ContainerSpreadSheet.prototype.getUnitCellInfo = function (crystal) {
	var html = "";
	dust.render("shipping.edit.form.unit.cell.template", crystal, function(err,out){
		html = out;
	});
	return html;
};

ContainerSpreadSheet.prototype.showEditForm = function (crystal, row) {
	var _this = this;

	/** Check if other samples share this crystal form */

	var editCrystalForm = new EditCrystalFormView();

	editCrystalForm.onSaved.attach(function (sender, crystal) {
		var rows = _this.parseTableData();
		_this.updateCrystalGroup(row,crystal);
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].location-1 != row){
				if (_this.crystalInfoToIdMap[rows[i]["Crystal Form"]] == crystal.crystalId){
					_this.updateCrystalGroup(rows[i].location-1,crystal);
				}
			}
		}
		window.close();
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Crystal Form',
		height : 460,
		width : 600,
		modal : true,
		closable : false,
		layout : 'fit',
		items : [ editCrystalForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					editCrystalForm.save();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					if (crystal.spaceGroup == "NEW"){
						_this.resetCrystalGroup(row);
					}
					window.close();
				}
			} ]
	}).show();

	editCrystalForm.load(crystal);
};

ContainerSpreadSheet.prototype.addEditCrystalFormButton = function (row, column) {
	if (!column) {
		column = this.getColumnIndex("editCrystalForm");
	}
	var button = "<a id='edit-button-" + row + "' class='btn btn-xs edit-crystal-button'><span class='glyphicon glyphicon-edit'></span> Edit Crystal Form</a>";
	this.setDataAtCell(row,column,button);
};

ContainerSpreadSheet.prototype.updateCrystalGroup = function (row, crystal) {
    if (crystal) {
        this.setDataAtCell(row,this.crystalFormIndex,this.getCrystalInfo(crystal));
        // this.setDataAtCell(row,this.unitCellIndex,this.getUnitCellInfo(crystal));
        this.setDataAtCell(row,this.spaceGroupIndex,crystal.spaceGroup);
        // this.setDataAtCell(row,0,crystal.crystalId); //crystal Id column
        this.addEditCrystalFormButton(row);
    } else {
        this.resetCrystalGroup(row);
    }
};

ContainerSpreadSheet.prototype.resetCrystalGroup = function (row) {
	this.setDataAtCell(row,this.crystalFormIndex,"");
	// this.setDataAtCell(row,this.unitCellIndex,"");
	this.setDataAtCell(row,this.spaceGroupIndex,"");
	// this.setDataAtCell(row,0,"");
	this.setDataAtCell(row,this.getColumnIndex("editCrystalForm"),"");
};

ContainerSpreadSheet.prototype.disableAll = function () {
	this.spreadSheet.updateSettings({
					readOnly: true
				});
};

/**
* Method executed when a change is made on the spreadSheet. It manages the process when the crystal form or the protein acronym are changed
*
* @method manageChange
* @param {Array} change The change made to the spreadSheet as an array of the form [row, column, prevValue, newValue]
* @param {String} source The kind of change. Can be "edit" or "autofill"
* @param {Integer} direction In case of the source being autofill, this parameter indicates the direction of it
*/
ContainerSpreadSheet.prototype.manageChange = function (change, source, direction){
	switch (change[1]) { //Column Index
		case this.crystalFormIndex : {
			var parsed = this.parseCrystalFormColumn(change[3],change[0]); // parseCrystalFormColumn(dataAtCrystalFormColumn,row)
			if (parsed.spaceGroup != undefined){
				if (parsed.spaceGroup == "NEW"){
					this.showEditForm(parsed, change[0]);
				} else {
					if (this.isCrystalFormAvailable(parsed,this.getData()[change[0]][this.getColumnIndex("Protein Acronym")])){
						this.updateCrystalGroup(change[0],parsed);
					} else {
						this.resetCrystalGroup(change[0]);
					}
				}
			} else {
				this.resetCrystalGroup(change[0]);
			}
			break;
		}
		case this.getColumnIndex("Protein Acronym") : {
            if (change[3] == ""){
				this.emptyRow(change[0]);
            } else {
				/**Manage the sample name column */
				if (change[0] > 0){
					var colIdx = this.getColumnIndex("Sample Name");
					var currentName = this.spreadSheet.getDataAtCell(change[0],colIdx);
					if (currentName == undefined || currentName == "") {
						var nameSampleAbove = this.spreadSheet.getDataAtCell(change[0] - 1, colIdx);
						if (nameSampleAbove != null && nameSampleAbove != "") {
							var autoincremented = this.autoIncrement(nameSampleAbove, 1);
							if (autoincremented != "") {
								this.setDataAtCell(change[0],colIdx,autoincremented);
							}
						}
					}
				}
				/**Manage the crystal form column */
                var parsed = this.parseCrystalFormColumn(this.getData()[change[0]][this.crystalFormIndex],change[0]); // parseCrystalFormColumn(dataAtCrystalFormColumn,row)
                if (!this.isCrystalFormAvailable(parsed,change[3])){
                    this.resetCrystalGroup(change[0]);
                    var proteins = EXI.proposalManager.getProteinByAcronym(change[3]);
                    if (proteins && proteins.length > 0) {
                        var crystalsByProteinId = _.filter(EXI.proposalManager.getCrystals(),function(o) {return o.proteinVO.proteinId == proteins[0].proteinId;});
                        if (crystalsByProteinId && crystalsByProteinId.length > 0){
                            var crystal = _.maxBy(crystalsByProteinId,"crystalId");
                            this.updateCrystalGroup(change[0],crystal);
                        }
                    }
                }
            }
			break;
		}
		case this.getColumnIndex("Sample Name") : {
            if (source == "autofill" && change[3] != ""){
				var autoincremented = this.autoIncrement(this.spreadSheet.getDataAtCell(change[0] - direction, change[1]), direction);
				if (autoincremented != "") {
					this.setDataAtCell(change[0],change[1],autoincremented);
				}
            }
			break;
		}
	}
	if (change[1] != this.getColumnIndex("editCrystalForm")){
		this.onModified.notify(change);
	}
	$(".htInvalid").removeClass("htInvalid");
};

/**
* Returns an autoincremented string
*
* @method autoIncrement
* @param {String} value The string to be incremented
* @param {Integer} direction The direction on which the string is going to be incremented
*/
ContainerSpreadSheet.prototype.autoIncrement = function (value, direction) {
	var autoincremented = "";
	var regex = /(\d+)/g;
	var numbers = value.match(regex);
	if (numbers) {
		var lastNumber = numbers[numbers.length - 1];
		/**Check if there are any other characters after the last number */
		if (value.lastIndexOf(lastNumber) == value.length - lastNumber.length) {
			autoincremented = value.substring(0,value.length - lastNumber.length) + (parseInt(lastNumber) + direction);
		}
	}
	return autoincremented;
}

/**
* Returns true if the parseCrystalForm is available for the given proteinAcronym
*
* @method isCrystalFormAvailable
* @param {Object} parsedCrystalForm A parsed crystal form object
* @param {String} proteinAcronym The proteinAcronym
*/
ContainerSpreadSheet.prototype.isCrystalFormAvailable = function (parsedCrystalForm, proteinAcronym) {
	var crystalsBySpaceGroupAndAcronym = _.filter(_.filter(EXI.proposalManager.getCrystals(),{"spaceGroup":parsedCrystalForm.spaceGroup}),function(o){return o.proteinVO.acronym == proteinAcronym})
	if (crystalsBySpaceGroupAndAcronym.length > 0) {
        for (var i = 0 ; i < crystalsBySpaceGroupAndAcronym.length ; i++) {
            var crystal = crystalsBySpaceGroupAndAcronym[i];
            if (crystal.cellA == parsedCrystalForm.cellA && crystal.cellB == parsedCrystalForm.cellB && crystal.cellC == parsedCrystalForm.cellC && crystal.cellAlpha == parsedCrystalForm.cellAlpha && crystal.cellBeta == parsedCrystalForm.cellBeta && crystal.cellGamma == parsedCrystalForm.cellGamma) {
                return true;
            }
        }
    }
    return false;
};

/**
* Loads the crystal info to ud map and returns an array of cystal info given a protein
*
* @method getCrystalInfoByProtein
* @param {Object} protein The protein the crystals must be linked to
* @return {Array} Returns an array of strings with the crystal info to be loaded on the Crystal Form column
*/
ContainerSpreadSheet.prototype.getCrystalInfoByProtein = function (protein) {
	var src = [];
	var crystalsByProteinId = _.filter(EXI.proposalManager.getCrystals(),function(o) {return o.proteinVO.proteinId == protein.proteinId;});
	if (crystalsByProteinId) {
		for (var i = 0 ; i < crystalsByProteinId.length ; i++){
			var crystalInfo = this.getCrystalInfo(crystalsByProteinId[i]);
			this.crystalInfoToIdMap[crystalInfo] = crystalsByProteinId[i].crystalId;
			src.push(crystalInfo);
		}
	}
	return _.union(src,["NEW"]);
};