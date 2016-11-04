/**
* Renders a panel that contains a puck widget and two buttons
*
* @class PuckParcelPanel
* @constructor
*/
function PuckParcelPanel(args) {
	this.radius = 200;
    this.width = 220;
    this.containerId = 0;
    this.code = "";
    this.data = {puckType : "Unipuck", 
                mainRadius : this.radius - 5, 
                xMargin : this.width/2 - this.radius + 2.5, 
                yMargin : 2.5, 
                enableMouseOver : true
    };

	if (args != null) {
        if (args.width != null) {
			this.width = args.width;
		}
		if (args.radius != null) {
			this.radius = args.radius;
            this.data.mainRadius = this.radius - 5;
            this.data.xMargin = this.width/2 - this.radius + 2.5;
		}
        if (args.containerId != null) {
			this.containerId = args.containerId;
		}
        if (args.code != null) {
			this.code = args.code;
		}
        if (args.capacity != null) {
			if (args.capacity != 16) {
                this.data.puckType = "Spinepuck";
            }
		}
	}

    this.onPuckRemoved = new Event(this);
    this.onPuckSaved = new Event(this);
	
};

/**
* Returns the panel containing the puck and the buttons
*
* @class load
* @return The panel containing the puck and the buttons
*/
PuckParcelPanel.prototype.getPanel = function () {

    this.puck = new PuckWidgetContainer(this.data);

    this.puckPanel = Ext.create('Ext.panel.Panel', {
        width : this.width,
        height : 2*this.radius,
        items : [this.puck.getPanel()]
	});

    this.panel = Ext.create('Ext.panel.Panel', {
        width : this.width,
        height : 2*this.radius + 70,
        items : [{
                    html : this.getCodeHeader(),
                    margin : 5,
                    x : this.data.xMargin
                },
                this.puckPanel,
                this.getButtons()]
	});

    return this.panel;
};

/**
* Loads the puck with the given samples
*
* @class load
* @return
*/
PuckParcelPanel.prototype.load = function (samples) {
    this.puck = new PuckWidgetContainer(this.data);
    this.puckPanel.removeAll();
    this.puckPanel.add(this.puck.getPanel());
    
    this.puck.loadSamples(samples);
    this.containerId = this.puck.puckWidget.containerId;
};

/**
* Returns a panel with the buttons
*
* @class getCodeHeader
* @return The html of the code header
*/
PuckParcelPanel.prototype.getCodeHeader = function () {
    var templateData = {info : [{
                                    text : 'Code:',
                                    value : this.code
                                }]
    }
    var html = "";
    dust.render("info.grid.template", templateData, function(err, out){
		html = out;
	});
    return html;
};


/**
* Returns a panel with the buttons
*
* @class getButtons
* @return A panel with the buttons
*/
PuckParcelPanel.prototype.getButtons = function () {
    var _this = this;

    this.buttons = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'center'
        },
        width : this.width,
        height : 40,
        items : [
                {
                xtype: 'button',
                margin : 5,
                icon : '../images/icon/edit.png',
                handler : function(widget, e) {
                    var puckForm = new PuckForm({
                        width : Ext.getBody().getWidth() - 150
                    });

                    puckForm.onRemoved.attach(function(sender, containerId){
                        _this.onPuckRemoved.notify(containerId);
                        window.close();
                    });
                    puckForm.onSaved.attach(function(sender, puck){
                        _this.onPuckSaved.notify(puck);
                        window.close();
                    });
                    var window = Ext.create('Ext.window.Window', {
                            title: 'Edit Puck',
                            height: 700,
                            width: Ext.getBody().getWidth() - 100,
                            modal : true,
                            resizable : true,
                            layout: 'fit',
                            items: puckForm.getPanel()
                    }).show();

                    if (_this.containerId != null){
                        var onSuccess = function(sender, puck){
                            puckForm.load(puck);
                        };
                        EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(_this.containerId,_this.containerId,_this.containerId);
                    }
                }
            },{
                xtype: 'button',
                margin : 5,
                cls:'btn-remove',
                icon : '../images/icon/ic_highlight_remove_black_24dp.png',
                handler: function(){
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
            }
        ]
	});

    return this.buttons;
};

/**
* Removes the puck from the database
*
* @class removePuck
* @return 
*/
PuckParcelPanel.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        _this.onPuckRemoved.notify(_this.containerId);
	};
	var containerId = this.containerId;
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(containerId,containerId,containerId );
	
};