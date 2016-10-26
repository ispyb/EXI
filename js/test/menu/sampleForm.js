
function SampleForm(id) {
	this.id = id;
}

SampleForm.prototype.load = function(sample) {
	this.sample = sample;

	if (sample != null) {
		Ext.getCmp("sampleName" + this.id).setValue(sample.sampleName);
		// Ext.getCmp(this.id + "proteinAcronym").setValue(sample.proteinAcronym);
		// Ext.getCmp(this.id + "code").setValue(sample.code);
		// Ext.getCmp(this.id + "sampleLocation").setValue(sample.sampleLocation);
	}
};

SampleForm.prototype.getSamplePanel = function() {
	this.samplePanel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		margin : '10',
		items : [ {
				padding : 10,
				xtype : 'container',
				layout : 'hbox',
				border : false,
				items : [ {
					xtype: 'displayfield',
					id : "sampleName" + this.id,
					fieldLabel: 'Sample Name',
					name: 'sampleName'
				} ] }
		] });
	return this.samplePanel;
};


SampleForm.prototype.getPanel = function() {
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		title : 'Sample Card',
		cls : "border-grid",
		items : [  
		           this.getSamplePanel() 
		           ] });
	return this.panel;
};

