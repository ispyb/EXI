/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function MXDataCollectionGrid(args) {
    this.id = BUI.id();

    /** DATACOLLECTION, DATACOLLECTION_COLLAPSED, PLATES_VIEW */
    this.renderingType = 'DATACOLLECTION';

    this.uncollapsedDataCollectionGrid = new UncollapsedDataCollectionGrid();
    this.collapsedDataCollectionGrid = new CollapsedDataCollectionGrid();
    this.platesDataCollectionGrid = new PlatesDataCollectionGrid();  
                                                                    
    this.activePanel = this.uncollapsedDataCollectionGrid;
}

MXDataCollectionGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {  
        id: this.id,
        minHeight : 900,
        tbar: this.getToolBar(),        
        items: [_this.activePanel.getPanel(dataCollectionGroup)]
     });
   
    return this.panel;
};

MXDataCollectionGrid.prototype.getToolBar = function() {
    var _this = this;
    function onMenuClicked(widget){
        if (_this.activePanel != widget){
            _this.activePanel = widget;
            if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                _this.reloadData(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
            } else {
                _this.reloadData(_this.dataCollectionGroup);
            }
        }
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'Data Collection',
            handler: function(){
                _this.renderingType = "DATACOLLECTION";
                onMenuClicked(_this.uncollapsedDataCollectionGrid);
            }
        },{
            text: 'Summary',            
            handler: function(){
                _this.renderingType = "DATACOLLECTION_COLLAPSED";
                onMenuClicked(_this.collapsedDataCollectionGrid);
            }
        },{
            text: 'Plates',            
            handler: function(){
                _this.renderingType = "PLATES";
                
                if (_this.activePanel != _this.platesDataCollectionGrid){
                    _this.activePanel = _this.platesDataCollectionGrid;
                    _this.reloadData(_this.dataCollectionGroup);                 
                    if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                       _this.platesDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                    }
                }
            }
        }]
   });

    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
        items: [
           {
                text:'View',
                iconCls: 'bmenu',  // <-- icon
                menu : menu  // assign menu by instance
            },
            '->', 
            {
                xtype: 'textfield',
                id: this.id + "_search",
                width: 400,
                emptyText: 'enter search prefix, sample or protein',
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            _this.filter = field.getValue();

                            if (_this.renderingType == "PLATES"){     
                                if (Ext.getCmp(_this.id + "_search").getValue() != "") {                        
                                    _this.platesDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                                } else {
                                    Ext.getCmp(_this.id + "_found").setText("");
                                    _this.reloadData(_this.dataCollectionGroup);
                                }
                            } else {
                                _this.reloadData(_this.filterBy(field.getValue()));
                            }
                        }
                    }
                }
            },
            { xtype: 'tbtext', text: '', id: this.id + "_found" }
        ]
    });
};

MXDataCollectionGrid.prototype.reloadData = function(dataCollections) {
    this.panel.removeAll();
    this.panel.add(this.activePanel.getPanel(this.dataCollectionGroup));
    this.activePanel.load(dataCollections);
};

MXDataCollectionGrid.prototype.load = function(dataCollectionGroup) {    
    this.dataCollectionGroup = dataCollectionGroup;  
    this.activePanel.load(this.dataCollectionGroup);
};


/**
* Filters data by prefix, protein acronym or sample
*
* @method filterBy
* @return {String} searchTerm prefix, protein acronym or sample to be searched
*/
MXDataCollectionGrid.prototype.filterBy = function(searchTerm) {  
    var filtered = _.filter(this.dataCollectionGroup, function(dataCollection) {
        var params = ["DataCollection_imagePrefix", "Protein_acronym", "BLSample_name"];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (dataCollection[param]) {
                if (dataCollection[param].indexOf(searchTerm) != -1) {
                    return dataCollection;
                }
            }
        }
    });
    Ext.getCmp(this.id + "_found").setText(filtered.length + " items found");
    return filtered;
};

