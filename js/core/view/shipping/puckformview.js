/**
* This class containes name, description, samples spreadsheet and puck loyout for a given puck 
*
* @class PuckForm
* @constructor
**/
function PuckFormView(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;
	this.unsavedChanges = false;
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

	
	var _this = this;
	
	this.containerSpreadSheet = new ContainerSpreadSheet({width : Ext.getBody().getWidth() - 100, height : 600});
	this.containerSpreadSheet.onModified.attach(function (sender, change) {
		_this.unsavedChanges = true;
	});

	this.capacityCombo = new ContainerTypeComboBox({label : "Type:", labelWidth : 100, width : 250, initDisabled : true});
	this.capacityCombo.onSelected.attach(function (sender, data) {
		var capacity = data.capacity;
		_this.unsavedChanges = true;
		_this.containerTypeChanged(capacity);
	});
	
	this.onRemoved = new Event(this);
	this.onSaved = new Event(this);
}

/** Loads a puck into the form **/
PuckFormView.prototype.load = function(containerId, shippingId, shippingStatus) {
	var _this = this;
    this.shippingId = shippingId;
    this.shippingStatus = shippingStatus;
    this.containerId = containerId;
    // this.containerSpreadSheet.setLoading(true);
	this.panel.setTitle("Shipment");

    var onSuccess = function(sender, puck){
        _this.puck = puck;
        if (puck != null){
            Ext.getCmp(_this.id + "puck_name").setValue(_this.puck.code);
			if (_this.puck.capacity){
            	_this.capacityCombo.setValue(_this.puck.capacity);
			} else {
				$.notify("ERROR: The capacity of the container is not defined.", "error");
			}
            Ext.getCmp(_this.id + "puck_beamline").setValue(_this.puck.beamlineLocation);
            Ext.getCmp(_this.id + "puck_sampleChangerLocation").setValue(_this.puck.sampleChangerLocation);
            Ext.getCmp(_this.id + "puck_status").setValue(_this.puck.containerStatus);                
        }

		_this.fillSamplesGrid(puck);

    };

    EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(this.containerId,this.containerId,this.containerId);

};

PuckFormView.prototype.fillSamplesGrid = function (puck) {
	var _this = this;
	this.containerSpreadSheet.setLoading(true);
	var onSuccess = function (sender, samples) {
		if (samples) {
			if (samples.length > 0) {
				_this.containerSpreadSheet.setRenderCrystalFormColumn(true);
			} else {
				_this.containerSpreadSheet.setRenderCrystalFormColumn(false);
			}
			_this.containerSpreadSheet.setContainerType(puck.containerType);
			_this.containerSpreadSheet.load(puck);
			if (_this.shippingStatus != "processing"){
				var withoutCollection = _.filter(samples,{DataCollectionGroup_dataCollectionGroupId : null});
				if (withoutCollection.length == samples.length) {
					Ext.getCmp(_this.id + "_save_button").enable();
					Ext.getCmp(_this.id + "_remove_button").enable();
					_this.capacityCombo.enable();
				}
			} else {
				_this.containerSpreadSheet.disableAll();
			}
			_this.containerSpreadSheet.setLoading(false);
			if (_this.containerSpreadSheet.renderCrystalFormColumn) {
				_this.setValuesForEditCrystalColumn();
			}
		}
	}

	EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(puck.containerId);
}

PuckFormView.prototype.getPanel = function() {
	var _this =this;

	this.panel = Ext.create('Ext.panel.Panel', {
		autoScroll 	: true,
		buttons : this.getToolBar(),
		items : [ 
		         {
							xtype : 'container',
							margin : '5 0 2 5',
							layout : 'hbox',
							items : [
										
										
								         {
								        	 xtype : 'container',
											margin : '12 0 2 0',
											layout : 'hbox',
											items : [ 
							         				   {
																xtype: 'requiredtextfield',
																id : this.id + 'puck_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '5 5 5 5',
																labelWidth : 100,
														},
														this.capacityCombo.getPanel(),
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_beamline',
																fieldLabel : 'Beamline',
																width : 250,
                                                                disabled : true,
																margin : '5 5 5 10',
																labelWidth : 100
														},
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_sampleChangerLocation',
																fieldLabel : '#Sample Changer',
																width : 300,
                                                                disabled : true,
																margin : '5 5 5 5',
																labelWidth : 150
														},                                                       
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_status',
																fieldLabel : 'Status',
																width : 250,
                                                                disabled : true,
																margin : '5 5 5 5',
																labelWidth : 100
														}
													]
								         },
                                         // this.puckLayout.getPanel()
							         ]
		         },
				 {
					 html : "<div class='container-fluid'><span style='font-size: 12px;color: #666;'>Special characters are not allowed for the sample name field</span></div>"
				 }
				 ,
		         this.containerSpreadSheet.getPanel(),
                
	         ] 
		} 
	);
	return this.panel;
};

PuckFormView.prototype.getToolBar = function() {
	var _this = this;
	return [
			{
			    text: 'Remove',
				id: this.id + "_remove_button",
			    width : 100,
			    height : 30,
				disabled : true,
			    cls : 'btn-red',
			    handler : function(){
			    	function showResult(result){
						if (result == "yes"){
							_this.removePuck();							
						}
			    	}
					  Ext.MessageBox.show({
				           title:'Remove',
				           msg: 'Removing a puck from this parcel will remove also its content. <br />Are you sure you want to continue?',
				           buttons: Ext.MessageBox.YESNO,
				           fn: showResult,
				           animateTarget: 'mb4',
				           icon: Ext.MessageBox.QUESTION
				       });
			    }
			},
	        "->",
	        {
	            text: 'Save',
                id: this.id + "_save_button",
	            width : 100,
	            height : 30,
				disabled : true,
	            handler : function(){
	            	_this.save();
	            }
	        },
			{
	            text: 'Return to shipment',
	            width : 200,
	            height : 30,
	            handler : function () {
                    _this.returnToShipment();
                }
	        }
	];
};

PuckFormView.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        location.href = "#/shipping/" + _this.shippingId + "/main";
        // _this.onRemoved.notify(containerId);
	};
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(this.containerId,this.containerId,this.containerId );
	
};

PuckFormView.prototype.returnToShipment = function(){
    /**Check if the container's name has been changed */
	if (this.puck.code != Ext.getCmp(this.id + 'puck_name').getValue()) {
		this.unsavedChanges = true;
	}
	if (this.unsavedChanges) {
		this.showReturnWarning();
	} else {
		location.href = "#/shipping/" + this.shippingId + "/main";
	}
}

/**
* Saves the container
*
* @method save
* @param {Boolean} returnToShipment True if you want to return to shipment after the save
*/
PuckFormView.prototype.save = function(returnToShipment) {
	var _this = this;

	var puck = this.containerSpreadSheet.getPuck();
	/** Check if all samples have name */
	if (puck.sampleVOs && puck.sampleVOs.length > 0) {
		var sampleNames = _.map(puck.sampleVOs,"name");
		if(sampleNames.indexOf(null) >= 0 || sampleNames.indexOf("") >= 0) {
			$.notify("There are samples without a Sample Name", "error");
			return;
		}
	}
	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'puck_name').getValue();
	puck.capacity = _this.capacityCombo.getSelectedCapacity();
	puck.containerType = _this.capacityCombo.getSelectedType();

	// Check if sample names have special characters
	var hasSpecialCharacter = false;
	var format = /[ ~`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	for (var i = 0 ; i < puck.sampleVOs.length ; i++) {
		if(format.test(puck.sampleVOs[i].name)) {
			hasSpecialCharacter = true
			break;
		}
	}

	if (!hasSpecialCharacter) {
		var onError = function(sender, error){
			_this.panel.setLoading(false);
			EXI.setError(error.responseText);
		};
		
		var onSuccess = function(sender, puck){
			_this.unsavedChanges = false;
			_this.panel.setLoading(false);
			if (returnToShipment){
				location.href = "#/shipping/" + _this.shippingId + "/main";
			} else {
				_this.load(_this.containerId, _this.shippingId);
			}
		};
		this.panel.setLoading("Saving Puck");
		EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.containerId, this.containerId, this.containerId, puck);
	} else {
		$.notify("There are special characters in some of the sample names","error");
	}
};

/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * 
 * We make the spreadsheet longer and the platelayout is rendered again
 */
PuckFormView.prototype.containerTypeChanged = function(capacity) {
	var currentType = this.capacityCombo.getTypeByCapacity(this.puck.capacity);
	var newType = this.capacityCombo.getTypeByCapacity(capacity);
	this.puck.capacity = capacity;
	this.containerSpreadSheet.setContainerType(newType);
	this.containerSpreadSheet.updateNumberOfRows(capacity);
};

/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * Updates the values for the edit crystal column
 */
PuckFormView.prototype.setValuesForEditCrystalColumn = function(capacity) {
	var rows = this.containerSpreadSheet.parseTableData();
	var columnIndex = this.containerSpreadSheet.getColumnIndex("editCrystalForm");
	for (var i = 0; i < rows.length; i++) {
		this.containerSpreadSheet.addEditCrystalFormButton(rows[i].location-1,columnIndex);
	}
	this.panel.doLayout();
};

PuckFormView.prototype.showReturnWarning = function() {
	var _this = this;
	var window = Ext.create('Ext.window.Window', {
		title: 'Container',
		width: 250,
		layout: 'fit',
		modal : true,
		items: [
					{
						html : '<div class="container-fluid" style="margin:10px;"><div class="row"><span style="font-size:14px;color: #666;">Do you want to save the changes to the container ' + _this.puck.code + '?</span></div></div>',
					}
		],
		buttons : [ {
						text : 'Yes',
						handler : function() {
							window.close();
							_this.save(true);
						}
					},{
						text : 'No',
						handler : function() {
							window.close();
							location.href = "#/shipping/" + _this.shippingId + "/main";
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
	});
	window.show();
}		