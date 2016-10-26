function PreviewPanelView (args) {
    this.width = 400;
    this.onEmptyButtonClicked = new Event(this);
}

PreviewPanelView.prototype.getPanel = function () {
    var _this = this;

    this.infoPanel = Ext.create('Ext.panel.Panel', {
        cls     : 'border-grid',
        width : this.width/2,
        height : 50,
        items : []
    });

    this.instructionsButton = Ext.create('Ext.Button', {
        text: '',
        width: this.width/2,
        height: 50,
        scale: 'large',
        // disabled : true,
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
        cls     : 'border-grid',
        title: 'Selected Puck',
        width : this.width,
        height : 265,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        margin : 5,
        width : this.width,
        height : 315,
        items : [this.previewPanel,infoContainer]
    });

    return this.panel;

}

PreviewPanelView.prototype.loadPuck = function (puckContainer, data, fromRow, isEmpty) {
    this.clean();
    this.previewPanel.add(puckContainer.getPanel());
    var html = "";
	dust.render("puck.info.prepare.template", data, function(err, out){
		html = out;
	});
    this.infoPanel.removeAll();
    this.infoPanel.add({
                            html : html,
                            margin:6
                    });
    if (fromRow) {
        this.instructionsButton.setText("Click on sample<br/>changer to load");
    } else {
        if (!isEmpty) {
            this.instructionsButton.setText("EMPTY");
        }
    }
}

PreviewPanelView.prototype.clean = function () {
    this.previewPanel.removeAll();
    this.infoPanel.removeAll();
    this.instructionsButton.setText("");
}

PreviewPanelView.prototype.setEmptyButton = function () {
    this.instructionsButton.setText("EMPTY");
}