/**
* This class renders a panel with a puck widget and some information tabs
*
* @class PreviewPanelView
* @constructor
*/
function PreviewPanelView (args) {
    this.width = 400;
    this.height = 265;

    if (args) {
        if (args.width) {
            this.width = args.width;
        }
        if (args.height) {
            this.height = args.height;
        }
    }

    this.puckData = {
                puckType : 1,
                mainRadius : this.height*0.4,
                x : this.width/2 - this.height*0.4,
                y : 10,
                enableMouseOver : true
            };

    this.onEmptyButtonClicked = new Event(this);
};

/**
* Returns an Ext.panel.Panel containing a puck widget, an info tab and a button.
*
* @method getPanel
* @return An Ext.panel.Panel containing a puck widget, an info tab and a button.
*/
PreviewPanelView.prototype.getPanel = function () {
    var _this = this;

    this.infoPanel = Ext.create('Ext.panel.Panel', {
        // cls     : 'border-grid',
        width : this.width/2,
        height : 50,
        border :2,
        items : []
    });

    this.instructionsButton = Ext.create('Ext.Button', {
        text: '',
        width: this.width/2,
        height: 50,
        scale: 'large',
        style: {
            background: '#444444'
        },
        listeners: {
            click: function(button) {
                if (button.text == "EMPTY") {
                    _this.onEmptyButtonClicked.notify();
                }
            }
        }
    });

    var infoContainer = Ext.create('Ext.panel.Panel', {
        layout : 'hbox',
        width : this.width,
        height : 50,
        items : [this.infoPanel,this.instructionsButton]
    });

    this.previewPanel = Ext.create('Ext.panel.Panel', {
        // cls     : 'border-grid',
        // title: 'Selected Puck',
        width : this.width,
        height : this.height,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        margin : 5,
        cls : 'border-grid',
        width : this.width,
        height : this.height + 50,
        items : [this.previewPanel, infoContainer]
    });

    return this.panel;
};

/**
* Loads a puck to the preview panel and some information about the puck to the info tab. It also sets the text of the button.
*
* @method loadPuck
* @param puckContainer The puck widget container to be loaded
* @param {Object} data The data to be displayed on the info tab
* @param {String} instructionsButtonText The text to be set on the button
* @return
*/
PreviewPanelView.prototype.load = function (containerId, capacity, data, instructionsButtonText) {
    this.clean();
    
    var html = "";
	dust.render("info.grid.template", data, function(err, out){
		html = out;
	});
    this.infoPanel.removeAll();
    this.infoPanel.add({
                            html    : html,
                            margin  : 6
                    });

    this.instructionsButton.setText(instructionsButtonText);
    this.puckData.containerId = containerId;
    if (capacity == 10){
        this.puckData.puckType = 2;
    } else {
        this.puckData.puckType = 1;
    }

    var puckContainer = new PuckWidgetContainer(this.puckData);
    this.previewPanel.add(puckContainer.getPanel());

    function onSuccess (sender, samples) {
        
        if (samples.length > 0) {
            puckContainer.puckWidget.loadSamples(samples);
        }
    }

    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerId);

};

/**
* Takes care of cleaning the panel
*
* @method clean
* @return
*/
PreviewPanelView.prototype.clean = function () {
    this.previewPanel.removeAll();
    this.infoPanel.removeAll();
    this.instructionsButton.setText("");
};