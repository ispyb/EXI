/**
* This class renders a grid that allows user to select the dewars from a list.
*
* @class DewarListSelectorGrid
* @constructor
*/
function DewarListSelectorGrid(args){
    this.height = 600;
    this.width = 1000;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    this.filterByDate = true;
    
    this.onSelect = new Event(this);
    this.onDeselect = new Event(this);
    this.onSelectionChange = new Event(this);
}


/**
* Loads a set if shipments
*
* @method load
* @param {Object} dewars Array of containers
*/
DewarListSelectorGrid.prototype.load = function(dewars){
    var _this = this;
    this.dewars = dewars;
    /** Filter by Dewars */ 
      
    var filtered = _.keyBy(dewars, "shippingId");
    var data = [];
    _(filtered).forEach(function(value) {
        if (_this.filterByDate){
            if (value.shippingStatus){
                if (value.shippingStatus.toUpperCase() == "PROCESSING"){
                    data.push(value);
                    return;
                }                        
            }       
        
            /** Filtering only future sessions */            
            if (value.sessionStartDate){
                if (moment().diff(moment(value.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'")) <= 0){
                    data.push(value);
                }
            }
            else{
                /** No session or not parseable */
                data.push(value);
            }
        }
        else{
                data.push(value);
        }
        
    });
        
    this.panel.setTitle(data.length + " shipments candidates for " + EXI.proposalManager.getProposals()[0].code + EXI.proposalManager.getProposals()[0].number);    
    this.store.loadData(data);

};

/**
* Return the number of containers and samples for a given dewar 
*
* @method getStatsByDewarId
* @param {Integer} dewarId DewarId
*/
DewarListSelectorGrid.prototype.getStatsByDewarId = function(shippingId){ 
    var _this = this;
    var containers = _.filter(this.dewars, function(e){return e.shippingId == shippingId;});
    var sampleCount = 0;
    _(containers).forEach(function(value) {
        sampleCount = sampleCount + value.sampleCount;
    });      
    return {
                samples     : sampleCount,
                dewars      : Object.keys(_.groupBy(containers, "dewarId")).length,
                containers   : containers.length
        
    };
};

DewarListSelectorGrid.prototype.getSelectedData = function() {
	var elements = this.panel.getSelectionModel().selected.items;
	var data = [];
	for (var i = 0; i < elements.length; i++) {
		data.push(elements[i].data);
	}
	return data;
};

DewarListSelectorGrid.prototype.getStore = function(){
    this.store = Ext.create('Ext.data.Store', {
        fields:['beamlineLocation', 'storageLocation','containerStatus','containerType','sessionStartDate','creationDate','beamLineOperator','shippingStatus','shippingName', 'barCode', 'beamlineName', 'dewarCode', 'dewarStatus', 'sampleChangerLocation', 'sampleCount', 'sessionStartDate', 'type']
    });
    return this.store;
};
DewarListSelectorGrid.prototype.getPanel = function(){
    var _this = this;
   
    this.tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                xtype       : 'checkboxfield',
                boxLabel    : 'Display only shipments scheduled for future sessions',
                checked     : this.filterByDate,
                listeners : {
                    change : function( cb, newValue, oldValue, eOpts ){
                        _this.filterByDate = newValue;
                        _this.load(_this.dewars);
                    }
                    
                }
            }
        ]
    });

    this.panel = Ext.create('Ext.grid.Panel', {
            title: 'Select dewars',
            store: this.getStore(),
            // cls : 'border-grid',           
            height : this.height, 
            width : this.width,  
            flex : 0.5, 
            tbar : this.tbar,                 
            margin : 5,
            columns: [ 
                {
                    text    : 'Shipment',
                    columns : [
                         { text: 'Name',  dataIndex: 'shippingName', flex : 1 },
                         { text: 'Status',  dataIndex: 'shippingStatus', flex: 1 },
                         { text: 'Created on',  dataIndex: 'creationDate', flex: 1,   hidden : true,
                            renderer : function(grid, a, record){
                                if (record.data.creationDate){
                                    return moment(record.data.creationDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },                     
                    ]                                         
                },
                {
                    text    : 'Experiment',
                    columns : [
                            { text: 'Start on',  dataIndex: 'sessionStartDate', flex: 2, 
                            renderer : function(grid, a, record){
                                if (record.data.sessionStartDate){
                                    return moment(record.data.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },
                            { text: 'beamline', dataIndex: 'beamlineName', flex: 1 },     
                            { text: 'Local contact',  dataIndex: 'beamLineOperator', flex: 2, hidden : true  }                 
                    ]                                         
                },              
                 {      
                        text: '#Dewars/#Parcels (#Samples)',     
                        flex: 1,
                        renderer : function(grid, e, record){
                            var stats =  _this.getStatsByDewarId(record.data.shippingId);
                            return stats.dewars + " / " + stats.containers + " (" +  stats.samples + ")";
                            
                        }
                },
                {
                    xtype: 'actioncolumn',
                    flex : 0.3,
                    items: [                               
                                 {
                                    icon: '../images/icon/add.png',
                                    handler: function (grid, rowIndex, colIndex) {
                                            grid.getSelectionModel().select(rowIndex);
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {
                                            return record.data.shippingStatus == "processing";
                                    }
                                 }                                                               
                    ]
                },
                  {
                    xtype: 'actioncolumn',
                     flex : 0.3,
                    items: [                              
                                 {
                                    icon: '../images/icon/ic_highlight_remove_black_48dp.png',
                                    handler: function (grid, rowIndex, colIndex) {                                        
                                            grid.getSelectionModel().select(rowIndex);                                            
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {                                            
                                            return record.data.shippingStatus != "processing";
                                    }
                                 }
                    ]
                }
            ],
             viewConfig : {
                stripeRows : true,
                getRowClass : function(record, rowIndex, rowParams, store){

                    if (record.data.shippingStatus == "processing"){
                         return "warning-grid-row";                       
                    }
                   
                }
	    	},
    });
    return this.panel;    
};
