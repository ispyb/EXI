function OtherContainerForm(args) {
    this.id = BUI.id();
    var _this = this;

    this.width = 1500;
    this.height = 600;
    this.container = {};
	if (args != null) {
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

    this.containerSpreadSheet = new GenericContainerSpreadSheet({width : this.width - 50, height : this.height - 300});

    this.onSave = new Event(this);
    this.onCancel = new Event(this);
}

OtherContainerForm.prototype.load = function (container) {
    if (container) {
        this.container = container;
        Ext.getCmp(this.id + "container_name").setValue(container.code);
        if (container.samples) {
            this.container.capacity = container.samples.length;
        } else {
            this.container.capacity = 1;
        }
        this.containerSpreadSheet.load(this.container);
	    this.panel.doLayout();
    }
}

OtherContainerForm.prototype.getPanel = function() {
    this.panel = Ext.create('Ext.form.Panel', {
        // width : this.width - 10,
        // height : this.height,
//			cls : 'border-grid',
//			margin : 10,
        autoScroll 	: true,
        buttons : this.getButtons(),
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
																id : this.id + 'container_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '5 5 5 5',
																labelWidth : 100
														},
                                            ]
                                        }
                                        ]
                },
                    this.containerSpreadSheet.getPanel()
                ]
    });
	return this.panel;
};

OtherContainerForm.prototype.getButtons = function () {
    var _this = this;
    return [ {
                text : 'Save',
                id : this.id + "-save-button",
                handler : function() {
                    _this.save();
                }
            }, {
                text : 'Cancel',
                handler : function() {
                    _this.onCancel.notify();
                }
            } ]
}

OtherContainerForm.prototype.getContainer = function () {
    this.container.code = Ext.getCmp(this.id + "container_code").getValue();
    this.container.containerType = "OTHER";
    this.container.capacity = this.container.samples.length;    
    return this.container;
}

OtherContainerForm.prototype.save = function() {
	var _this = this;
	this.panel.setLoading("Saving Puck");

	var puck = this.containerSpreadSheet.getPuck();

	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'container_name').getValue();
	puck.capacity = this.container.samples.length;
	puck.containerType = "OTHER";
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender, puck){
		_this.panel.setLoading(false);
        _this.onSave.notify();
	};
    debugger
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.container.containerId, this.container.containerId, this.container.containerId, puck);
};