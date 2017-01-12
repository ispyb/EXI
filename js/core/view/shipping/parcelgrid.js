
/**
* This is a grid for parcels
*
* @class ParcelGrid
* @constructor
*/
function ParcelGrid(args) {
	this.id = BUI.id();
	this.height = 100;
	this.width = 100;
	this.padding = 0;
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

	this.shipment = "";
	this.dewars = {};

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}

ParcelGrid.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	return (Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
};

ParcelGrid.prototype.load = function(shipment) {
	var _this = this;
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;


	this.panel.removeAll();

	this.dewars.sort(function(a, b) {
		return a.dewarId - b.dewarId;
	});

    function onSaved(sender, dewar) {
			_this.panel.setLoading();
			dewar["sessionId"] = dewar.firstExperimentId;
			dewar["shippingId"] = _this.shipment.shippingId;
			
			var onSuccess = function(sender, shipment) {				
				_this.panel.setLoading(false);
			};			
			EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
    }

	Ext.getCmp(this.id + "-label").setText("Content (" + this.dewars.length + " Parcels)");
	for ( var i in this.dewars) {
		var parcelPanel = new ParcelPanel({
			height : 90,
			width : this.width - 60,
			shippingId : this.shipment.shippingId,
			shippingStatus : this.shipment.shippingStatus,
			index : Number(i)+1
		});
		this.panel.insert(parcelPanel.getPanel());
		parcelPanel.load(this.dewars[i]);
		parcelPanel.onSavedClick.attach(onSaved);
	}
};

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
				dewar["sessionId"] = dewar.firstExperimentId;
				dewar["shippingId"] = _this.shipment.shippingId;
				EXI.getDataAdapter({
					onSuccess : onSuccess
				}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
			}
		}, {
			text : 'Cancel',
			handler : function() {
				window.close();
			}
		} ]
	});
	window.show();

};

ParcelGrid.prototype.getPanel = function() {
	var _this = this;
	
	this.panel = Ext.create('Ext.panel.Panel', {
		cls : 'border-grid',
		width : this.width,
		autoScroll:true,
        autoHeight :true,
        maxHeight: this.height,
		padding : this.padding
	});

	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		items : [
					{
						xtype : 'label',
						text : 'Content (0 Parcels)',
						id : this.id + "-label"
					},
					_this._getTopButtons()
				],
		cls : 'exi-top-bar'
	});

	return this.panel;
};
