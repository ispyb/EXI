
/**
* This is a grid for parcels
*
* @class ParcelGrid
* @constructor
*/
function ParcelGrid(args) {
	this.id = BUI.id();
	this.height = 110;
	this.width = 100;
	this.padding = 10;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.padding != null) {
			this.padding = args.padding;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	this.shipment = null;
	this.dewars = {};
	this.parcelPanels = {};
	this.samples = [];
	this.withoutCollection = [];
	this.fedexCode = "fedexCode" ;

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}

/** This disable the Export PDF view button */
ParcelGrid.prototype.disableExportButton = function() {
	$("#" + this.id + "-export").removeClass("disabled");
	$("#" + this.id + "-export").unbind('click').click(function(sender){
			/** Do nothing */
	});
};

ParcelGrid.prototype.disableImportFromCSVButton = function() {
	$("#" + this.id + "-import").addClass("disabled");
	$("#" + this.id + "-import").unbind('click').click(function(sender){			
	});
};

ParcelGrid.prototype.enableImportFromCSVButton = function() {
	var _this = this;
	/** Only for managers */
	//if (EXI.credentialManager.getCredentials()[0].isManager()){
		$("#" + this.id + "-import").removeClass("disabled");
		$("#" + this.id + "-import").bind('click').click(function(sender){			
			window.open('#/shipping/' + _this.shipment.shippingId +'/import/csv', '_blank');
		});
	//}
};




ParcelGrid.prototype.getReimbursementContentHTML = function(currentReimbursedDewars, maxReimbursedDewars ) {
	if ((maxReimbursedDewars && maxReimbursedDewars > 0 ) || (currentReimbursedDewars && currentReimbursedDewars > 0 ))	{
		if (maxReimbursedDewars > currentReimbursedDewars - 1 ){
			return "<span id='" + this.reimbursementId +"' style='color:green'>" 
				+ "("+ currentReimbursedDewars +" reimbursed selected out of " + maxReimbursedDewars +" allowed.) </span>"
		} else {				
			return "<span id='" + this.reimbursementId +"' style='color:red'>" 
				+ "("+ currentReimbursedDewars +" reimbursed selected out of " + maxReimbursedDewars +" allowed! Please modify.) </span>"
		}
	}
	return "";
};

ParcelGrid.prototype.refreshReimbursementContentHTML = function(currentReimbursedDewars, maxReimbursedDewars ) {	
	$("#" + this.reimbursementId).html(this.getReimbursementContentHTML(currentReimbursedDewars, maxReimbursedDewars));
};

ParcelGrid.prototype.displayContentLabel = function(dewars,nSamples,nMeasured, currentReimbursedDewars, maxReimbursedDewars ) {	
	$("#" + this.id + "-label").html("Content (" + dewars.length + " Parcels " + this.getReimbursementContentHTML(currentReimbursedDewars, maxReimbursedDewars) + " - " + nSamples + " Samples - " + nMeasured + " Measured )");
};

ParcelGrid.prototype.getAuthorizedReimbursedDewars = function(sessions) {
	if (sessions){
		if (sessions.length > 0){
			return sessions[0].nbReimbDewars;
		} 
	};
	return 0;
};

ParcelGrid.prototype.getCurrentReimbursedDewars = function(dewars) {
	return _.filter(dewars, function(o){ return o.isReimbursed == true}).length;	
};


ParcelGrid.prototype.load = function(shipment,hasExportedData,samples,withoutCollection) {
	var _this = this;
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;
	this.hasExportedData = hasExportedData;
	var nSamples = 0;
	var nMeasured = 0;
	this.maxReimbursedDewars = 0;
	this.currentReimbursedDewars = 0;

	if (samples) {
		nSamples = samples.length;
		nMeasured = nSamples - withoutCollection.length;
		this.samples = _.groupBy(samples,"Dewar_dewarId");
		this.withoutCollection = _.groupBy(withoutCollection,"Dewar_dewarId");
	}

    if (shipment){
		this.maxReimbursedDewars = this.getAuthorizedReimbursedDewars(this.shipment.sessions);
		this.currentReimbursedDewars = this.getCurrentReimbursedDewars(this.dewars);
	}

	this.dewars.sort(function(a, b) {
		return a.dewarId - b.dewarId;
	});

	this.displayContentLabel(this.dewars, nSamples, nMeasured, this.currentReimbursedDewars, this.maxReimbursedDewars);
	//$("#" + this.id + "-label").html("Content (" + this.dewars.length + " Parcels - " + nSamples + " Samples - " + nMeasured + " Measured)");
	$("#" + this.id + "-add-button").removeClass("disabled");
	$("#" + this.id + "-add-button").unbind('click').click(function(sender){
		_this.edit();
	});
	if (nSamples > 0) {
		$("#" + this.id + "-export").removeClass("disabled");
		$("#" + this.id + "-export").unbind('click').click(function(sender){
			var exportForm = new ExportPDFForm();
			exportForm.load(_this.shipment);
			exportForm.show();
		});
	}


	this.fillTab("content", this.dewars);

	this.attachCallBackAfterRender();

	/** Disable import from csv button */		
		if (_this.shipment){
			if (_this.shipment.shippingStatus){
				if (_this.shipment.shippingStatus == "processing"){					
					_this.disableImportFromCSVButton();
				}
				else{
					_this.enableImportFromCSVButton();
				}
			}
		}
		
};

ParcelGrid.prototype.fillTab = function (tabName, dewars) {
	var _this = this;
	$("#" + tabName + "-" + this.id).html("");
	this.parcelPanels[tabName] = Ext.create('Ext.panel.Panel', {															
															autoScroll	:true,
															autoHeight 	:true,
															maxHeight	: this.height,
															renderTo	: tabName + "-" + this.id
														});

	function onSaved(sender, dewar) {
			_this.panel.setLoading();
			dewar["sessionId"] = dewar.firstExperimentId;
			dewar["shippingId"] = _this.shipment.shippingId;
			var onSuccess = function(sender, shipment) {				
				_this.panel.setLoading(false);							
				_this.refreshReimbursementContentHTML( _this.getCurrentReimbursedDewars(shipment.dewarVOs), _this.getAuthorizedReimbursedDewars(shipment.sessions));
				_this.currentReimbursedDewars = _this.getCurrentReimbursedDewars(shipment.dewarVOs);
				_this.panel.doLayout();	
			};
			EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
    }

    function onRemoved(sender, dewar) {
        _this.panel.setLoading();

        var onRemoveSuccess = function (sender, shipment) {
            _this.panel.setLoading(false);
            _this.load(shipment);
            _this.panel.doLayout();
        };

        var onError = function(sender,error) {
            EXI.setError(error.responseText);
        };

	    EXI.getDataAdapter({onSuccess : onRemoveSuccess, onError : onError}).proposal.dewar.removeDewar(_this.shipment.shippingId, dewar.dewarId );
    }

    for ( var i in dewars) {
		var parcelPanel = new ParcelPanel({
			height : 110,
			width : this.panel.getWidth()*0.9,
			shippingId : this.shipment.shippingId,
			shippingStatus : this.shipment.shippingStatus,
			index : Number(i)+1,
			currentTab : tabName
		});
		this.parcelPanels[tabName].insert(parcelPanel.getPanel());
		parcelPanel.load(this.dewars[i],this.shipment,this.samples[this.dewars[i].dewarId],this.withoutCollection[this.dewars[i].dewarId]);
		parcelPanel.onSavedClick.attach(onSaved);
		parcelPanel.onRemovedClick.attach(onRemoved);
	}
	this.parcelPanels[tabName].doLayout();
	this.panel.doLayout();
}

ParcelGrid.prototype.edit = function(dewar) {
	var _this = this;
	var caseForm = new CaseForm();
	var window = Ext.create('Ext.window.Window', {
		title : 'Parcel',
		height : 450,
		width : 600,
		modal : true,
		layout : 'fit',
		items : [ caseForm.getPanel(dewar) ],
		listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null) {
					_this.render(_this.puck);
				}
			}
		},
		buttons : [ {
			text : 'Save',
			handler : function() {
				var adapter = new DataAdapter();
				_this.panel.setLoading();
				var dewar = caseForm.getDewar();
				var onSuccess = function(sender, shipment) {
					_this.load(shipment);
					_this.panel.setLoading(false);
					window.close();
				};
				var onError = function(sender, error) {
                	_this.panel.setLoading(false);
                    // cannot be saved, an error occurred
                    BUI.showError(error.responseText);
                    return;
                };
				dewar["sessionId"] = dewar.firstExperimentId;
				dewar["shippingId"] = _this.shipment.shippingId;
				EXI.getDataAdapter({
					onSuccess : onSuccess,
					onError : onError
				}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
			}
		}, {
			text : 'Cancel',
			handler : function() {
				window.close();
			}
		}]
	});
	window.show();
};

ParcelGrid.prototype.getPanel = function() {

	var html = "";

	dust.render("parcel.grid.template",{id : this.id},function (err,out){
		html = out;
	})

	this.panel =  Ext.create('Ext.panel.Panel', {
		layout : 'fit',
		// cls	: 'overflowed',
		items : {
					// cls	: 'border-grid',
					html : '<div id="' + this.id + '">' + html + '</div>',
					// width : this.width,
					autoScroll:false,
					autoHeight :true,
					// maxHeight: this.height,
					padding : this.padding
				}
	});

	return this.panel;
};

ParcelGrid.prototype.attachCallBackAfterRender = function () {

	var _this = this;
	var tabsEvents = function(grid) {
		this.grid = grid;
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var target = $(e.target).attr("href");
			if (target.startsWith("#co")){
				_this.fillTab("content",_this.dewars);
			}
			if (target.startsWith("#st")){
				_this.fillTab("statistics",_this.dewars);
			}
			_this.panel.doLayout();
		});
    };
    var timer3 = setTimeout(tabsEvents, 500, this);
}
