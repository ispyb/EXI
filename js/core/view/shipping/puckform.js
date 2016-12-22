/**
* This class containes name, description, samples spreadsheet and puck loyout for a given puck 
*
* @class PuckForm
* @constructor
**/
function PuckForm(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;
	this.disableSave = false;
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.disableSave != null) {
			this.disableSave = args.disableSave;
		}
	}

	
	var _this = this;
	
	//this.puckLayout = new PuckPanel({width : 150, tbar : false});
	this.containerSpreadSheet = new ContainerSpreadSheet({width : 1300});
	
	/*this.containerSpreadSheet.onModified.attach(function(sender, puck){
		
	});*/
	
	this.onRemoved = new Event(this);
	this.onSaved = new Event(this);
}

/** Loads a puck into the form **/
PuckForm.prototype.load = function(puck, shippingId) {
	var _this = this;
	this.puck = puck;
    
	if (puck != null){
		Ext.getCmp(this.id + "puck_name").setValue(this.puck.code);
		this.capacityCombo.setValue(this.puck.capacity);
        Ext.getCmp(this.id + "puck_beamline").setValue(this.puck.beamlineLocation);
        Ext.getCmp(this.id + "puck_sampleChangerLocation").setValue(this.puck.sampleChangerLocation);
        Ext.getCmp(this.id + "puck_status").setValue(this.puck.containerStatus);                
	}	
	this.containerSpreadSheet.load(puck);
};

/*
PuckForm.prototype.loadPlateLayout = function(puck) {
	 try{
		 this.puckLayout.load(puck);
		 this.puckLayout.render(puck);
	  }
	  catch(e){
		  console.log(e);
	  }
};*/

PuckForm.prototype.getToolBar = function() {
	var _this = this;
	return [
	        
			{
			    text: 'Remove',
			    width : 100,
			    height : 30,
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
	            width : 100,
	            height : 30,
				disabled : this.disableSave,
	            handler : function(){
	            	_this.save();
	            }
	        }
	];
};

PuckForm.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        _this.onRemoved.notify(containerId);
	};
	var containerId = this.puck.containerId;
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(containerId,containerId,containerId );
	
};

PuckForm.prototype.save = function() {
	var _this = this;
	this.panel.setLoading("Saving Puck");

	var puck = this.containerSpreadSheet.getPuck();
	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'puck_name').getValue();
	puck.capacity = _this.capacityCombo.getValue();
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender, puck){
		_this.panel.setLoading(false);
		_this.load(puck);
		_this.onSaved.notify(puck);
	};
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.puck.containerId, this.puck.containerId, this.puck.containerId, puck);
};


/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * 
 * We make the spreadsheet longer and the platelayout is rendered again
 */
PuckForm.prototype.containerTypeChanged = function(capacity) {
	this.puck.capacity = capacity;
	var data = this.containerSpreadSheet.spreadSheet.getData();
	if (data.length < capacity){
		for (var i = data.length; i<= capacity; i++){
			data.push([i]);
		}
	}
	else{
		data = data.slice(0, capacity);
	}
	this.containerSpreadSheet.spreadSheet.loadData(data);
};


PuckForm.prototype.getPanel = function() {
	var _this =this;
	var capacityCombo = BIOSAXS_COMBOMANAGER.getComboPuckType({margin : '10 0 10 5', labelWidth : 100, width : 250});
	capacityCombo.on('select', function(capacityCombo, record){
		var capacity = record[0].data.value;
		_this.containerTypeChanged(capacity);
	});
	
	this.capacityCombo = capacityCombo;
	this.panel = Ext.create('Ext.panel.Panel', {
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
											layout : 'vbox',
											items : [ 
							         				   {
																xtype: 'requiredtextfield',
																id : this.id + 'puck_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '0 0 0 5',
																labelWidth : 100
														},
														this.capacityCombo,
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_beamline',
																fieldLabel : 'Beamline',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
																labelWidth : 100
														},
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_sampleChangerLocation',
																fieldLabel : '#Sample Changer',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
																labelWidth : 100
														},                                                       
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_status',
																fieldLabel : 'Status',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
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

