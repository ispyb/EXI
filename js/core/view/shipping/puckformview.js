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

	this.capacityCombo = new ContainerTypeComboBox({label : "Type:", labelWidth : 100, width : 250, initDisabled : true});
	this.capacityCombo.onSelected.attach(function (sender, data) {
		var capacity = data.capacity;
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
																labelWidth : 100
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
        _this.returnToShipment();
        // _this.onRemoved.notify(containerId);
	};
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(this.containerId,this.containerId,this.containerId );
	
};

PuckFormView.prototype.returnToShipment = function(){
    location.href = "#/shipping/" + this.shippingId + "/main";
}

PuckFormView.prototype.save = function() {
	var _this = this;
	this.panel.setLoading("Saving Puck");

	var puck = this.containerSpreadSheet.getPuck();

	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'puck_name').getValue();
	puck.capacity = _this.capacityCombo.getSelectedCapacity();
	puck.containerType = _this.capacityCombo.getSelectedType();
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender, puck){
		_this.panel.setLoading(false);
		_this.load(_this.containerId, _this.shippingId);
	};
	
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.containerId, this.containerId, this.containerId, puck);
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
	var data = this.containerSpreadSheet.spreadSheet.getData();
	//Sets the appropiate number of rows according to the capacity
	if (data.length < capacity){
		for (var i = data.length + 1; i<= capacity; i++){
			data.push([i]);
		}
	}
	else{
		data = data.slice(0, capacity);
	}
	//Resets editCrystalForm column if exists
	// var columnIndex = _.findIndex(this.containerSpreadSheet.getHeader(),{id : "editCrystalForm"});
	// if (columnIndex >= 0){
	// 	var tableData = this.containerSpreadSheet.parseTableData();
	// 	for (var i = 0 ; i < tableData.length ; i++) {
	// 		this.containerSpreadSheet.setDataAtCell(tableData[i].location - 1,columnIndex,""); 
	// 	}
	// }
	
	//Changes the grid when changed from or to the type OTHER
	this.containerSpreadSheet.spreadSheet.loadData(data);
	if (currentType == "OTHER" || newType == "OTHER"){
		this.puck.containerType = newType;
		this.fillSamplesGrid(this.puck);
	}
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
				