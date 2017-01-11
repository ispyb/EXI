function EditCrystalFormView (args) {
    this.id = BUI.id();

    this.width = 600;
    this.height = 500;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

	this.onSaved = new Event(this);
};

EditCrystalFormView.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					padding : this.padding,
					width : this.width,
				}]
	});

	return this.panel;
};

EditCrystalFormView.prototype.load = function(crystal) {
	var _this = this;
	this.crystal = crystal;
	if (crystal.crystalId != null){
		if (crystal.crystalId != "") {
			var onSuccess = function (sender, crystalById) {
				_this.crystal = crystalById;
				_this.render();
			}
			EXI.getDataAdapter({onSuccess:onSuccess}).mx.crystal.getCrystalById(crystal.crystalId);
		} else {
			this.render();
		}
	} else {
		$('#' + this.id).hide().html("<div id='" + this.id + "-error' style='margin:30px;'><h4>There was an error loading the crystal</h4></div>").fadeIn('fast');
		this.panel.doLayout();
	}
}

EditCrystalFormView.prototype.render = function () {
	var _this = this;
    this.crystal.spaceGroups = ExtISPyB.spaceGroups;
	this.crystal.id = this.id;
    var html = "";
	
    dust.render("crystal.edit.form.template", this.crystal, function(err, out){
		html = out;
	});
	
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();

	$('#' + this.id + "-space-group").on('change', function() {
		_this.setCellValuesBySpaceGroup(this.value);	
	});

	this.setCellValuesBySpaceGroup($('#' + this.id + "-space-group").val());

};

EditCrystalFormView.prototype.save = function () {
	var _this = this;
    var crystal = {
                    spaceGroup  :   $("#" + this.id + "-space-group").val(),
                    cellA       :   $("#" + this.id + "-cellA").val(),
                    cellB       :   $("#" + this.id + "-cellB").val(),
                    cellC       :   $("#" + this.id + "-cellC").val(),
                    cellAlpha   :   $("#" + this.id + "-cellAlpha").val(),
                    cellBeta    :   $("#" + this.id + "-cellBeta").val(),
                    cellGamma   :   $("#" + this.id + "-cellGamma").val(),
					name		: 	$("#" + this.id + "-name").val(),
					comments	:	$("#" + this.id + "-comments").val()
                };

	if (crystal.cellA != "" && crystal.cellB != "" && crystal.cellC != "") {
		this.panel.setLoading();
		var onSaved = function (sender, newCrystal) {
			EXI.proposalManager.get(true);
			_this.onSaved.notify(newCrystal);
			_this.panel.setLoading(false);
		}
		
		EXI.getDataAdapter({onSuccess : onSaved}).mx.crystal.save(this.crystal.proteinVO.proteinId, this.crystal.crystalId, 
																	crystal.name, crystal.spaceGroup, crystal.cellA, crystal.cellB, crystal.cellC, 
																	crystal.cellAlpha, crystal.cellBeta, crystal.cellGamma, crystal.comments);
	} else {
		$("#" + this.id + "-cellsABC").notify("The values A, B and C must be filled",{className:"error"});
	}
};

EditCrystalFormView.prototype.setCellValuesBySpaceGroup = function (spaceGroup) {
	var _this = this;
	var onSuccess = function (sender, geometryClass) {
		var alpha = "";
		var beta = "";
		var gamma = "";
		if (geometryClass && geometryClass.length > 0 && geometryClass[0].geometryClassnameVO){
			switch (geometryClass[0].geometryClassnameVO.geometryClassname){
				case "Primitive triclinic":
											break;
				case "Primitive monoclinic":
											alpha = 90;    
											gamma = 90;
											break;
				case "Centred monoclinic":
											alpha = 90;
											gamma = 90;
											break;
				case "Primitive orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "C-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "F-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;    
				case "Primitive tetragonal":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred tetragonal":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "Primitive trigonal":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Primitive hexagonal":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Rhombohedral":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Primitive cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "F-centred cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;                                                                
			}
			_this.manageCellValueUpdate("#" + _this.id + "-cellAlpha", alpha);
			_this.manageCellValueUpdate("#" + _this.id + "-cellBeta", beta);
			_this.manageCellValueUpdate("#" + _this.id + "-cellGamma", gamma);
		}
	}
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.crystal.getGeometryclassBySpacegroup(spaceGroup);
}

EditCrystalFormView.prototype.manageCellValueUpdate = function (id, value) {
	if (value != "") {
		$(id).prop('disabled', true);
		$(id).val(value);
	} else {
		$(id).prop('disabled', false);
	}
}