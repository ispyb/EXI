/**
 * Main class used for the west panel. Main purpose is the navigation
 */

function ListView(){
	this.width = 250;
	this.height = Ext.getBody().getHeight() - 215;

	/** Event is triggered when a element has been selected from the list **/
	this.onSelect = new Event();
}

ListView.prototype.getSorters = function(){
	return {};
};

ListView.prototype.getFilter = function(value){
	return null;
};

ListView.prototype.load = function(data){
	this.data = data;
	if (this.formatData != null){
		this.store.loadData(this.formatData(data));
	}
	else{
		this.store.loadData(data);
	}
};


ListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: this.title,  flex: 1, dataIndex: 'shippingId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

ListView.prototype.getFields = function(){
	return  [];
};

ListView.prototype.getPanel = function(){
	var _this =this;
	this.store = Ext.create('Ext.data.Store', {
	    fields:this.getFields(),
	    data : [],
	    sorters: this.sorters,
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json'
	        }
	    }
	});
	
	this.panel =  Ext.create('Ext.grid.Panel', {
	    store: this.store,
	    layout : 'fit',
	    columns: this.getColumns(),
	    width: this.width,
	    height : this.height,
	    multiSelect : true,
	    dockedItems: [{
	        xtype: 'toolbar',
	        dock: 'bottom',
	        cls : 'x-toolbar',
	        height : 42,
	        items: [
	            {
            xtype: 'textfield',
            name: 'searchField',
            hideLabel: true,
            width: 200,
            hidden : _this.getFilter() == null,
            emptyText : 'Search...',
            listeners : {
    			'change' : function(field, e) {
    						var value = field.getValue();
    						if (value != ""){
    							_this.store.filter(_this.getFilter(value));
    						}
    						else{
    							_this.store.clearFilter(true);
    							_this.load(_this.data);
    						}
    					} 
            		} 
	            }
	        ]
	    }],
	    viewConfig : {
	    	emptyText: 'No items to display',
	    	enableTextSelection : true,
	    	preserveScrollOnRefresh : true,
			stripeRows : true
		}
	});
	
    this.panel.on('selectionchange', function(view, elements){
    		var data = [];
    		for ( var index in elements) {
				data.push(elements[index].data);
			}
    		/** Trigger on select event **/
    		_this.onSelect.notify(data);
	    });
	return this.panel; 
};


