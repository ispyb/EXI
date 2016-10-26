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

    this.uncollapsedDataCollectionGrid = new UncollapsedDataCollectionGrid({
                                                                    mxDataCollectionGrid : this
                                                                });
    this.collapsedDataCollectionGrid = new CollapsedDataCollectionGrid({
                                                                    mxDataCollectionGrid : this
                                                                });
    this.platesDataCollectionGrid = new PlatesDataCollectionGrid({
                                                                        mxDataCollectionGrid : this
                                                                    });  
                                                                    
    this.activePanel = this.uncollapsedDataCollectionGrid;
}

/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
MXDataCollectionGrid.prototype.attachCallBackAfterRender = function() {
    
    var _this = this;
    
    var lazy = {
            bind: 'event',
            /** !!IMPORTANT this is the id of the parent node which contains the scroll **/
            appendScroll: document.getElementById(document.getElementById(_this.id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id),
            beforeLoad: function(element) {
                console.log('image "' + (element.data('src')) + '" is about to be loaded');                                
            },           
            onFinishedAll: function() {
                EXI.mainStatusBar.showReady();
            }
        };
        
    var timer1 = setTimeout(function() {  $('.img-responsive').lazy(lazy);}, 500);
    var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500); 
    
    var tabsEvents = function(grid) {
        
            this.grid = grid;
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href"); // activated tab
                /** Activate tab of data collections */
                if (target.startsWith("#dc")){
                    var onSuccess = function(sender, data){
                        var html = "";
                        
                        dust.render("datacollections.mxdatacollectiongrid.template", data, function(err, out) {                                                                                               
                            html = html + out;
                        });
                        $(target).html(html);
                    };
                    var onError = function(sender, data){
                        $(target).html("Error retrieving data");
                    };
                     /** Retrieve data collections */
                    var dataCollectionGroupId = target.slice(4);
                    EXI.getDataAdapter({onSuccess:onSuccess, onError:onError}).mx.dataCollection.getDataCollectionsByDataCollectionGroupId(dataCollectionGroupId);
                }
                
                if (target.startsWith("#re")){                    
                    var onSuccess2 = function(sender, data){                       
                        /** Parsing data */
                        var html = "";     
                        
                        dust.render("collapsed.autoprocintegrationgrid.template",  new AutoProcIntegrationGrid().parseData(data[0]), function(err, out) {
                                    html = html + out;
                        });
                        $(target).html(html);        
                    };                    
                    var dataCollectionId = target.slice(4);                    
                    EXI.getDataAdapter({onSuccess : onSuccess2}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);    
                }

                 if (target.startsWith("#sa")){                    
                        var dataCollectionId = target.slice(4);

                        var divName = "xtal1_samples_" + dataCollectionId;
                        // $("#xtal2_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: divName, zoomWindowHeight: 200, zoomWindowWidth:200, borderSize: 0, easing:true});
                        // $("#xtal3_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: divName, zoomWindowHeight: 200, zoomWindowWidth:200, borderSize: 0, easing:true});
                        // $("#xtal4_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: divName, zoomWindowHeight: 200, zoomWindowWidth:200, borderSize: 0, easing:true});

                        // $("#xtal1_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: 2});
                        // $("#xtal2_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: 2});
                        // $("#xtal3_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: 2});
                        // $("#xtal4_samples_" + dataCollectionId).elevateZoom({scrollZoom : true, zoomWindowPosition: 2});


                        // $(".elevatezoom").elevateZoom({scrollZoom : true, zoomWindowPosition: 2});
                        // Intense(document.querySelectorAll('.intense'));

                        var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
                        
                        if (dc){
                            if ($("#sample_puck_layout_" +dataCollectionId)){
                                
                                if (dc.Container_containerId){
                                    var container =_.filter(grid.dataCollectionGroup, {"Container_containerId":Number(dc.Container_containerId)});
                                    if(container){
                                    var dataCollectionIds = {};
                                        for (var i = 1 ; i <= container[0].Container_capacity ; i++) {
                                            var sampleByLocation = _.filter(container,{"BLSample_location":i.toString()});
                                            if (sampleByLocation.length > 0) {
                                                var ids = [];
                                                for (sample in sampleByLocation){
                                                    ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                                                }
                                                dataCollectionIds[i] = ids.toString();
                                            }
                                        }
                                    }

                                    var puck = new UniPuckWidget({mainRadius : 100, 
                                                                    enableMouseOver : false, 
                                                                    enableClick : false,
                                                                    dataCollectionIds : dataCollectionIds
                                                                });
                                    if (dc.Container_capacity == 10){
                                        puck = new SpinePuckWidget({mainRadius : 100, 
                                                                    enableMouseOver : false, 
                                                                    enableClick : false,
                                                                    dataCollectionIds : dataCollectionIds
                                                                });
                                    }
                                    $("#sample_puck_layout_" +dataCollectionId).html(puck.getPanel());
                                    
                                    var onSuccess = function(sender, samples){
                                        if (samples){
                                            puck.loadSamples(samples,dc.BLSample_location);
                                        }
                                    };
                                    
                                    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(dc.Container_containerId);
                                }
                            }
                        }
                   
                }
                
                if (target.startsWith("#wf")){                    
                    var dataCollectionId = target.slice(4);
                    var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
                    if (dc){
                        var html = "";
                        var items = (new WorkflowSectionDataCollection().parseWorkflow(dc));
                       
                        dust.render("workflows.mxdatacollectiongrid.template",  items, function(err, out) {
                                        html = html + out;
                        });
                        $(target).html(html);
                    }  
                }
            });
    };
    var timer3 = setTimeout(tabsEvents, 500, _this);
};


MXDataCollectionGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {  
        id: this.id,
        tbar: this.getToolBar(),
        
        items: [_this.activePanel.getPanel(dataCollectionGroup)]
        });

    this.panel.on('boxready', function() {
        _this.attachCallBackAfterRender();
    });

    return this.panel;
}


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
                    if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                        _this.platesDataCollectionGrid.reloadPlates(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()),true);
                    }
                    else {
                        _this.platesDataCollectionGrid.reloadPlates(_this.dataCollectionGroup,false);
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
                                _this.reloadPlates(_this.filterBy(field.getValue()));
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
    this.activePanel.store.loadData(dataCollections);
    this.attachCallBackAfterRender();
    this.panel.removeAll();

    this.panel.add(this.activePanel.getPanel(this.dataCollectionGroup));
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

MXDataCollectionGrid.prototype.load = function(dataCollectionGroup) {    
    this.dataCollectionGroup = dataCollectionGroup;
    this.dataCollectionGroup.reverse();
    this.activePanel.store.loadData(this.dataCollectionGroup);
};