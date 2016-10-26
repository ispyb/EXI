function TestContainer() {
	this.container = Ext.create('Ext.container.Container', {
		layout: {
			type: 'hbox'
		},
		width: 400,
		border: 1,
		style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
		items: []
	});
}

TestContainer.prototype.getPanel = function () {
	return this.container;
}

TestContainer.prototype.add = function (item) {
	this.container.add(item);
}