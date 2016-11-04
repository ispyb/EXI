
/**
* This is a form  for parcels. It includes all items includes in a parcel. Include pucks
*
* @class ParcelPanelTest
* @constructor
*/
function ParcelPanelTest(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;

	this.isSaveButtonHidden = false;
	this.isHidden = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onSavedClick = new Event(this);
}

/**
* It inserts a panel into the this.panel with the template parcelformsummary
*
* @method addHeaderPanel
*/
ParcelPanelTest.prototype.addHeaderPanel = function() {
	var html = "No information";
	dust.render("parcel.header.shipping.template", this.dewar, function(err, out){
		html = out;
    });
    
	this.panel.add(0,
				{
					xtype 	: 'container',
					width	: this.width - 50,
					border : 1,
					padding : 1,
					items 	: [	{html : html}
					]
				}
	);
};

ParcelPanelTest.prototype.render = function() {
    var _this = this;

	var dewar = this.dewar;
	this.panel.removeAll();
	this.addHeaderPanel();
	
	if (dewar != null){
		if (dewar.containerVOs != null){

            var pucksPanel = Ext.create('Ext.panel.Panel', {
                layout      : 'hbox',
                cls 		: "border-grid",
                margin 		: 10,
                width       : this.width - 50,
                height       : 250,
                autoScroll : true,
                items       : []
            });

            this.panel.add(pucksPanel);
			/** Sorting container by id **/
			dewar.containerVOs.sort(function(a, b){return a.containerId - b.containerId;});
            var puckPanelsMap = {};
            var containerIds = [];
            
			for (var i = 0; i< dewar.containerVOs.length; i++){
				var container = dewar.containerVOs[i];
                var puckPanel = new PuckParcelPanel({width : 200, radius : 80, containerId : container.containerId, capacity : container.capacity, code : container.code});
                puckPanel.onPuckRemoved.attach(function (sender, containerId) {
                    _.remove(_this.dewar.containerVOs, {containerId: containerId});
                    _this.load(_this.dewar);
                });
                puckPanel.onPuckSaved.attach(function (sender, puck) {
                    _.remove(_this.dewar.containerVOs, {containerId: puck.containerId});
                    _this.dewar.containerVOs.push(puck);
                    _this.load(_this.dewar);
                });
                puckPanelsMap[container.containerId] = puckPanel;
                containerIds.push(container.containerId);
                pucksPanel.insert(puckPanel.getPanel());
			}
            
            if (!_.isEmpty(puckPanelsMap)) {
                
                var onSuccess = function (sender, samples) {
                    if (samples) {
                        var samplesMap = {};
                        for (var i = 0 ; i < samples.length ; i++) {
                            var sample = samples[i];
                            if (samplesMap[sample.Container_containerId]){
                                samplesMap[sample.Container_containerId].push(sample);
                            } else {
                                samplesMap[sample.Container_containerId] = [sample];
                            }
                        }
                        _.each(samplesMap, function(samples, containerId) {
                            puckPanelsMap[containerId].load(samples);
                        });
                    }
                }

                EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerIds);
            }
		}
	}
};

ParcelPanelTest.prototype.load = function(dewar) {
	this.dewar = dewar;
	try {
		/** Rendering pucks **/
		this.render();
	}
	catch(e){
		console.log(e);
	}
};

/**
* It inserts a new puck into the dewar and reloads the widget
*
* @method addPuckToDewar
*/
ParcelPanelTest.prototype.addPuckToDewar = function() {
	var _this = this;
	var onSuccess = function(sender, puck){
		_this.dewar.containerVOs.push(puck);
		_this.load(_this.dewar);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addPuck(this.dewar.dewarId, this.dewar.dewarId);
};

/**
* It displays a window with a case form
*
* @method showCaseForm
*/
ParcelPanelTest.prototype.showCaseForm = function() {
	var _this = this;
	/** Opens a window with the cas form **/
	var caseForm = new CaseForm();
	var window = Ext.create('Ext.window.Window', {
	    title: 'Parcel',
	    height: 450,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	caseForm.getPanel(_this.dewar)
	    ],
	    listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null){
						_this.render(_this.puck);
				}
			}
	    },
	    buttons : [ {
						text : 'Save',
						handler : function() {
							_this.onSavedClick.notify(caseForm.getDewar());
                            _this.render();
							window.close();
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

ParcelPanelTest.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	
	
	actions.push(this.code);
	actions.push(this.status);
	actions.push(this.storageCondition);
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/edit.png',
		text : 'Edit',
		disabled : false,
		handler : function(widget, event) {
					_this.showCaseForm();
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/print.png',
		text : 'Print Labels',
		disabled : false,
		handler : function(widget, event) {
			var dewarId = _this.dewar.dewarId;
			var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(dewarId, dewarId);
			location.href = url;
			return;
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add puck',
		disabled : false,
		handler : function(widget, event) {
			_this.addPuckToDewar();
		}
	}));
	
	return actions;
};


ParcelPanelTest.prototype.getPanel = function() {
	var _this = this;

	this.panel = Ext.create('Ext.panel.Panel', {
		cls 		: "border-grid",
		margin 		: 10,
		height 		: this.height,
		width 		: this.width,
		autoScroll	: false,
		items 		: [],
	});

    this.panel.addDocked({
		id 		: _this.id + 'tbar',
		height 	: 45,
		xtype 	: 'toolbar',
		items 	: _this._getTopButtons(),
		cls 	: 'exi-top-bar'
	});

	return this.panel;
};
