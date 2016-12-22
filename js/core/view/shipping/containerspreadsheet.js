function ContainerSpreadSheet(args){
	this.id = BUI.id();
	this.height = 380;
	this.width = 500;
	this.containerType = "OTHER";
	this.renderCrystalFormColumn = false;
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
		if (args.renderCrystalFormColumn != null) {
			this.renderCrystalFormColumn = args.renderCrystalFormColumn;
		}
	}

	this.crystalInfoToIdMap = {};

	this.crystalFormIndex = -1;
	this.unitCellIndex = -1;
	this.spaceGroupIndex = -1;
	
	this.onModified = new Event(this);
}

ContainerSpreadSheet.prototype.getPanel = function(){
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

ContainerSpreadSheet.prototype.setLoading = function (bool) {
	this.panel.setLoading(bool);
}


ContainerSpreadSheet.prototype.getSamplesData = function(puck) {
	var samples = puck.sampleVOs;
	var data = [];
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
					[crystal.crystalId,(i+1), protein.acronym, sample.name, this.getCrystalInfo(crystal), diffraction.experimentKind, sample.code,  getValue(diffraction["observedResolution"]),  diffraction.requiredResolution, diffraction.preferredBeamDiameter, 
					 diffraction.numberOfPositions, diffraction.radiationSensitivity, diffraction.requiredMultiplicity, diffraction.requiredCompleteness,this.getUnitCellInfo(crystal),crystal.spaceGroup, sample.smiles, sample.comments
					 ]
				);
		}
		else{
			data.push([(i+1)]);
		}
	}
	return data;
};


// ContainerSpreadSheet.prototype.getSpaceGroups = function() {
// 	return ["P1","P2","P21","C2","P222","P2221","P21212","P212121","C222","C2221","F222","I222","I212121","P4","P41","P42","P43","P422","P4212","P4122","P41212","P4222","P42212","P4322","P43212",
//                 	"I4","I41","I422","I4122","P3","P31","P32","P31","P321","P3112","P3121","P3212","P3221","P6","P61","P65","P62","P64","P63","P622","P6122","P6522","P6222","P6422","P6322","R3","R32","P23","P213",
//                 	"P432",	"P4232","P4332","P4132","F23","F432","F4132","I23",	"I213","I432","I4132", "UNKNOWN"];
// };


ContainerSpreadSheet.prototype.getAcronyms = function() {
	var proteins = EXI.proposalManager.getProteins();
	var acronyms = [];
	for (var i = 0; i < proteins.length; i++) {
		acronyms.push(proteins[i].acronym);
	}
	return acronyms;
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
	  
	if (this.containerType != "OTHER"){
		header = [
				{ text :'', id :'crystalId', column : {width : 100}}, 
				{ text : '#', 	id: 'position', column : {width : 20}}, 
				{ text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
																							width : 60,
																							type: 'dropdown',
																							source: this.getAcronyms()
																						}
				}, 
				{ text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}}, 
				{ text :'Crystal<br /> Form', id : 'Crystal Form',column : {
																			width : 300,
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
				{ text :'Number Of<br /> positions', id :'Number Of positions', column : {width : 80}}, 
				{ text :'Radiation<br /> Sensitivity', id :'Radiation Sensitivity', column : {width : 80}}, 
				{ text :'Required<br /> multiplicity', id :'Required multiplicity', column : {width : 60}}, 
				{ text :'Required<br /> Completeness', id :'Required Completeness', column : {width : 80}}, 
				{ text :'Unit Cell', id :'Unit cell', column : {width : 150, renderer: disabledRenderer, editor : false, readOnly: true}}, 
				{ text :'Space <br /> Group', id :'Space Group', column : {width : 55, renderer: disabledRenderer, editor : false, readOnly: true}}, 
				{ text :'Smiles', id :'Required Completeness', column : {width : 45}}, 
				{ text :'Comments', id :'Comments', column : {width : 200}}
				];

		if (this.renderCrystalFormColumn) {
			header.push({ text :'Edit Crystal Form', id :'editCrystalForm', column : {width : 200, renderer: editCrystalFormRenderer, editor : false, readOnly: true}});
		}
	} else {
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
	}
	
	return header;
};

ContainerSpreadSheet.prototype.setRenderCrystalFormColumn = function(bool) {
	this.renderCrystalFormColumn = bool;
};

ContainerSpreadSheet.prototype.setContainerType = function(containerType) {
	this.containerType = containerType;
};

ContainerSpreadSheet.prototype.getHeaderWidth = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].column.with);
	}
	return text;
};

ContainerSpreadSheet.prototype.getHeaderId = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].id);
	}
	return text;
};

ContainerSpreadSheet.prototype.getHeaderText = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].text);
	}
	return text;
};


ContainerSpreadSheet.prototype.getColumns = function() {
	var columns = [];
	for (var i = 0; i < this.getHeader().length; i++) {
		columns.push(this.getHeader()[i].column);
	}
	return columns;
};


ContainerSpreadSheet.prototype.getPuck = function() {
	var myPuck = JSON.parse(JSON.stringify(this.puck));
	var rows = this.parseTableData();
    
	//myPuck.sampleVOs = [];
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
		sample["crystalVO"]["spaceGroup"] = crystal.spaceGroup;
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


ContainerSpreadSheet.prototype.parseTableData = function() {
	var parsed = [];
	var data = this.spreadSheet.getData();
	for (var j = 0; j < data.length; j++) {
		var row = {};
		row["location"] = j + 1;
			for (var k = 0; k < data[j].length; k++) {
				var key = this.getHeaderId()[k];
				var value = data[j][k];
				row[key] = value;
			}
			if (row["Protein Acronym"]){
				if (row["Protein Acronym"].length > 0){
					parsed.push(row);
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

ContainerSpreadSheet.prototype.load = function(puck){
	var _this = this;
	this.puck = puck;
	var container = document.getElementById(this.id + '_samples');
	this.crystalFormIndex = this.getColumnIndex('Crystal Form');
	this.unitCellIndex = this.getColumnIndex('Unit cell');
	this.spaceGroupIndex = this.getColumnIndex("Space Group");
    
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
	  this.spreadSheet = new Handsontable(container, {
				beforeChange: function (changes, source) {
					lastChange = changes;
					
				},
				afterChange: function (changes, source) {
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
									_this.manageChange(change);
								}
							}
						}
					} else if (source == "autofill") {
						if (changes){
							for (var i = 0 ; i < changes.length ; i++) {
								var change = changes[i];
								if (change[2] != change[3]) {
									_this.manageChange(change);
								}
							}
						}
					}
				},
				data: this.getSamplesData(puck),
			
				height : this.height,
				width : this.width,
				manualColumnResize: true,
				colWidths: this.getHeaderWidth(),
				colHeaders: this.getHeaderText(),
				stretchH: 'last',
				columns: this.getColumns(),
		});

	
	
};

ContainerSpreadSheet.prototype.getData = function () {
	return this.spreadSheet.getData();
}

ContainerSpreadSheet.prototype.loadData = function (data) {
	return this.spreadSheet.loadData(data);
}

ContainerSpreadSheet.prototype.setDataAtCell = function (rowIndex, columnIndex, value) {
	this.spreadSheet.setDataAtCell(rowIndex, columnIndex, value);
}

ContainerSpreadSheet.prototype.getColumnIndex = function (colId) {
	return _.findIndex(this.getHeader(),{id :colId});
}

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
	if (dataAtCrystalFormColumn != ""){
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
				if(splitted[1].indexOf("|") >= 0){
					var cells = splitted[1].trim().replace(/[{()}]/g, '').replace(/\s+/g,"");;
					parsed.cellA = (cells.split("|")[0].split(":")[0] == "null")? null : cells.split("|")[0].split(":")[0];
					parsed.cellB = (cells.split("|")[0].split(":")[1] == "null")? null : cells.split("|")[0].split(":")[1];
					parsed.cellC = (cells.split("|")[0].split(":")[1] == "null")? null : cells.split("|")[0].split(":")[2];
					parsed.cellAlpha = (cells.split("|")[1].split(":")[0] == "null")? null : cells.split("|")[1].split(":")[0];
					parsed.cellBeta = (cells.split("|")[1].split(":")[1] == "null")? null : cells.split("|")[1].split(":")[1];
					parsed.cellGamma = (cells.split("|")[1].split(":")[2] == "null")? null : cells.split("|")[1].split(":")[2];
				}
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
}

/**
* Returns an string of the form [spaceGroup - (cellA : cellB : cellC | cellAlpha : cellBeta : cellGamma)]
*
* @method getCrystalInfo
* @param {Object} crystal The crystal used to extract the values
*/
ContainerSpreadSheet.prototype.getCrystalInfo = function (crystal) {
	if (crystal.cellA == null) {
		return crystal.spaceGroup + " - undefined";
	} else if (crystal.cellA == 0 && crystal.cellB == 0 && crystal.cellC == 0 && crystal.cellAlpha == 0 && crystal.cellBeta == 0 && crystal.cellGamma == 0 ){
		return crystal.spaceGroup
	}
	return crystal.spaceGroup + " - (" + crystal.cellA + " : " + crystal.cellB + " : " + crystal.cellC + " | " + crystal.cellAlpha + " : " + crystal.cellBeta + " : " + crystal.cellGamma + ")";
}

ContainerSpreadSheet.prototype.getUnitCellInfo = function (crystal) {
	var html = "";
	dust.render("shipping.edit.form.unit.cell.template", crystal, function(err,out){
		html = out;
	});
	return html;
}

ContainerSpreadSheet.prototype.showEditForm = function (crystal, row) {
	var _this = this;
	var editCrystalForm = new EditCrystalFormView();

	editCrystalForm.onSaved.attach(function (sender, crystal) {
		_this.updateCrystalGroup(row,crystal);
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
}

ContainerSpreadSheet.prototype.addEditCrystalFormButton = function (row, column) {
	if (!column) {
		column = this.getColumnIndex("editCrystalForm");
	}
	var button = "<a id='edit-button-" + row + "' class='btn btn-xs edit-crystal-button'><span class='glyphicon glyphicon-edit'></span> Edit Crystal Form</a>";
	this.setDataAtCell(row,column,button);
}

ContainerSpreadSheet.prototype.updateCrystalGroup = function (row, crystal) {
	this.setDataAtCell(row,this.crystalFormIndex,this.getCrystalInfo(crystal));
	this.setDataAtCell(row,this.unitCellIndex,this.getUnitCellInfo(crystal));
	this.setDataAtCell(row,this.spaceGroupIndex,crystal.spaceGroup);
	this.setDataAtCell(row,0,crystal.crystalId); //crystal Id column
	this.addEditCrystalFormButton(row);
}

ContainerSpreadSheet.prototype.resetCrystalGroup = function (row) {
	this.setDataAtCell(row,this.crystalFormIndex,"");
	this.setDataAtCell(row,this.unitCellIndex,"");
	this.setDataAtCell(row,this.spaceGroupIndex,"");
	this.setDataAtCell(row,0,"");
	this.setDataAtCell(row,this.getColumnIndex("editCrystalForm"),"");
}

ContainerSpreadSheet.prototype.disableAll = function () {
	this.spreadSheet.updateSettings({
					readOnly: true
				});
}

/**
* Method executed when a change is made on the spreadSheet. It manages the process when the crystal form or the protein acronym are changed
*
* @method manageChange
* @param {Object} change The change made to the spreadSheet
*/
ContainerSpreadSheet.prototype.manageChange = function (change){
	var _this = this;
	switch (change[1]) {
		case this.crystalFormIndex : {
			var parsed = this.parseCrystalFormColumn(change[3],change[0]);
			if (parsed.spaceGroup != undefined){
				if (parsed.spaceGroup == "NEW"){
					this.showEditForm(parsed, change[0]);
				} else {
					var crystalsBySpaceGroupAndAcronym = _.filter(_.filter(EXI.proposalManager.getCrystals(),{"spaceGroup":parsed.spaceGroup}),function(o){return o.proteinVO.acronym == _this.getData()[change[0]][_this.getColumnIndex("Protein Acronym")]})
					if (crystalsBySpaceGroupAndAcronym.length > 0){
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
			this.resetCrystalGroup(change[0]);
			break;
		}
	}
}

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
}