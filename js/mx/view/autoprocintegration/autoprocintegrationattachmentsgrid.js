function AutoProcIntegrationAttachmentGrid(args) {
	this.id = BUI.id();	
	this.maxHeight = 300;
}

AutoProcIntegrationAttachmentGrid.prototype.load = function(data) {
    if (data){
		data.sort(function(a, b) {
			var textA = a.fileName.toUpperCase();
			var textB = b.fileName.toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
		this.store.loadData(data);
    }
};

AutoProcIntegrationAttachmentGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : ["fileName"]
	});
    	
	this.panel = Ext.create('Ext.grid.Panel', {
		id : this.id,
		title : 'Auto-Processing Files',
		store : this.store,
		cls : 'border-grid',
		margin : 5,
		overflow :'auto',
        height : 500,
		columns : [ 		
					// {
                    //     text : '',
                    //     dataIndex : 'actions',
                    //     flex : 1,
                    //     renderer : function(grid, opt, val, val2, val3){
                    //         var url = EXI.getDataAdapter().mx.autoproc.getDownloadAttachmentUrl(val.data.autoProcProgramAttachmentId);
                    //         return '<a href="'+ url + '"><span class="glyphicon glyphicon-eye-open" style="margin:5px;"></span></a><a href="'+ url + '"><span class="glyphicon glyphicon-download" style="margin:5px;"></span></a>';				
                    //     }
                    // },
                    {
                        text : 'fileName',
                        dataIndex : 'fileName',
                        flex : 10,
						renderer : function(grid, opt, val, val2, val3){
                            var url = EXI.getDataAdapter().mx.autoproc.getDownloadAttachmentUrl(val.data.autoProcProgramAttachmentId);
                            return '<a href="'+ url + '"><span class="glyphicon glyphicon-download" style="margin-right:10px;"></span></a><a href="' + url + '" target="_blank">' + val.data.fileName + '</a>';				
                        }
                    }
		],
		flex : 1,
		viewConfig : {
			stripeRows : true
		}
	});

	return this.panel;
};

AutoProcIntegrationAttachmentGrid.prototype.hide = function(bool) {
	if (bool){
		Ext.getCmp(this.id).hide();
	} else {
		Ext.getCmp(this.id).show();
	}
}