function UploaderWidget(url){
	this.id = BUI.id();

	this.url = url;
	if (url == null){
		 Ext.Msg.alert('Error', 'Please, set an url');
	}
	
	
	this.onUploaded = new Event(this);
}

UploaderWidget.prototype.getFileName = function(){
	var filePath =  Ext.getCmp(this.id).value;
	return filePath.split("\\")[filePath.split("\\").length - 1];
};

UploaderWidget.prototype.getForm = function(){
	var _this = this;
	return Ext.create('Ext.form.Panel', {
	    width: 400,
	    bodyPadding: 20,
	    border : 0,
	    frame: true,
	    items: [{
	        xtype: 'filefield',
	        name: 'file',
	        id : this.id,
	        fieldLabel: 'File',
	        labelWidth: 50,
	        msgTarget: 'side',
	        allowBlank: false,
	        anchor: '100%',
	        buttonText: 'Browse...'
	    },
	    {
			xtype : 'hiddenfield',
			id : _this.id + 'fileName',
			name : 'fileName',
			value : '' }
	    ],

	    buttons: [{
	        text: 'Upload',
	        handler: function() {
	            var form = this.up('form').getForm();
	            if(form.isValid()){
	            	Ext.getCmp(_this.id + "fileName").setValue(_this.getFileName());
	                form.submit({
	                    url: _this.url,
	                    waitMsg: 'Uploading your file...',
	                    success: function(fp, o) {
//	                        Ext.Msg.alert('Success', 'Your file has been uploaded.');
	                    	
	                    	_this.window.close();
	                    	_this.onUploaded.notify();
	                    },
	                    failure : function(fp, o) {
//	                    	Ext.Msg.alert('Failure', 'Processed file "' + o.result.file + '" on the server');
	                    	_this.window.close();
	                    	_this.onUploaded.notify();
	                    } });
	            }
	        }
	    }]
	});
	
	
};



UploaderWidget.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'ISPyB File Uploader Manager',
	    height: 200,
	    modal : true,
	    icon : '../images/icon/upload.svg',
	    width: 600,
	    layout: 'fit',
	    items: this.getForm()
	});
	this.window.show();
	
	
};