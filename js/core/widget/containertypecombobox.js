function ContainerTypeComboBox(args) {
    this.id = BUI.id();

    this.label = "Choose Container Type:";
    this.labelWidth = 200;
    this.width = 500;
    this.initDisabled = false;

    this.data = [
                    {"type":"SPINE", "capacity":10},
                    {"type":"UNIPUCK", "capacity":16},
                    {"type":"PLATE", "capacity":96}
                ]

    if (args) {
        if (args.label) {
            this.label = args.label;
        }
        if (args.labelWidth) {
            this.labelWidth = args.labelWidth;
        }
        if (args.width) {
            this.width = args.width;
        }
        if (args.extraOptions != null) {
            this.data = _.union(this.data, args.extraOptions);
        }
        if (args.initDisabled != null){
            this.initDisabled = args.initDisabled;
        }
    }
    this.onSelected = new Event(this);
}

ContainerTypeComboBox.prototype.getPanel = function () {
    var _this = this;

    var types = Ext.create('Ext.data.Store', {
        fields: ['type','capacity'],
        data : this.data
    });

    this.panel = Ext.create('Ext.form.ComboBox', {
        layout:'fit',
        margin : '5 0 5 5',
        fieldLabel: this.label,
        store: types,
        labelStyle: 'padding:5px',
        labelWidth : this.labelWidth,
        displayField: 'type',
        value:'SPINE',
        width: this.width,
        disabled : this.initDisabled
    });

    this.panel.on('select', function(capacityCombo, record){
		_this.onSelected.notify(record[0].data);
	});

	return this.panel;
};

ContainerTypeComboBox.prototype.getValue = function () {
    return this.panel.getValue();
};


ContainerTypeComboBox.prototype.getSelectedType = function () {
    var type = this.panel.getValue();
    if (type == "UNIPUCK") {
        type = "Unipuck";
    }
    else if (type == "SPINE") {
        type = "Spinepuck";
    }
	return type;
};

ContainerTypeComboBox.prototype.getSelectedCapacity = function () {
	return _.filter(this.data,{"type" : this.getValue()})[0]["capacity"];
};

ContainerTypeComboBox.prototype.getTypeByCapacity = function (capacity) {
    return _.filter(this.data,{"capacity" : capacity})[0]["type"];
};

ContainerTypeComboBox.prototype.setValue = function (capacity) {
    var type = this.getTypeByCapacity(capacity);
    this.panel.setValue(type);
};

ContainerTypeComboBox.prototype.enable = function () {
    this.panel.enable();
}