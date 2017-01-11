function AddContainerForm(args) {
    this.id = BUI.id();
    var _this = this;

    this.width = 600;
    this.height = 200;
	this.showTitle = true;
    this.container = {};
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

    this.containerTypeComboBox = new ContainerTypeComboBox({extraOptions : [{"type":"STOCK SOLUTION"},{"type":"OTHER", "capacity":1}]});
    this.stockSolutionsGrid = new StockSolutionsGrid({width : this.width*0.95});

    this.containerTypeComboBox.onSelected.attach(function (sender,selection){
        _this.container = {};
        if (selection.type == "STOCK SOLUTION") {
            _this.addStockSolutionsList();
            Ext.getCmp(_this.id + "-save-button").disable();
        } else {
            if (_this.stockSolutionsGrid.panel){
                _this.panel.remove(_this.stockSolutionsGrid.panel);
            }
            Ext.getCmp(_this.id + "-save-button").enable();
        }
    });

    this.stockSolutionsGrid.onSelected.attach(function (sender, stockSolution) {
        _this.container = stockSolution;
        _this.container.containerType = "STOCK SOLUTION";
        Ext.getCmp(_this.id + "-save-button").enable();
    });

    this.onSave = new Event(this);
    this.onCancel = new Event(this);
}

AddContainerForm.prototype.getPanel = function(dewar) {
    this.panel = Ext.create('Ext.form.Panel', {
        width : this.width - 10,
        height : this.height,
//			cls : 'border-grid',
//			margin : 10,
        padding : 10,
        buttons : this.getButtons(),
        items : [ {
                        xtype : 'container',
                        margin : "2 2 2 2",
                        collapsible : false,
                        defaultType : 'textfield',
                        layout : 'anchor',
                        items : [ {
                            xtype : 'container',
                            margin : '5 0 5 5',
                            layout : 'vbox',
                            items : [ {
                                xtype : 'textfield',
                                fieldLabel : 'Name',
                                name : 'code',
                                id : this.id + 'container_code',
                                labelWidth : 200,
                                width : 500
                            }
                            ]
                        }, 
                        this.containerTypeComboBox.getPanel()
            ]
        } ]
    });
	return this.panel;
};

AddContainerForm.prototype.getButtons = function () {
    var _this = this;
    return [ {
                text : 'Save',
                id : this.id + "-save-button",
                handler : function() {
                    _this.onSave.notify(_this.getContainer());
                }
            }, {
                text : 'Cancel',
                handler : function() {
                    _this.onCancel.notify();
                }
            } ]
}

AddContainerForm.prototype.getContainer = function () {
    this.container.code = Ext.getCmp(this.id + "container_code").getValue();
    this.container.containerType = this.containerTypeComboBox.getSelectedType();
    this.container.capacity = this.containerTypeComboBox.getSelectedCapacity();    
    return this.container;
}

AddContainerForm.prototype.addStockSolutionsList = function () {
    var stockSolutions = _.filter(EXI.proposalManager.getStockSolutions(),{"boxId" : null});
    this.panel.insert(this.stockSolutionsGrid.getPanel());
    this.stockSolutionsGrid.load(stockSolutions);
}