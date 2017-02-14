/**
* This class renders a grid containing container information
* @class ContainerPrepareSpreadSheet
* @constructor
*/
function ContainerPrepareSpreadSheet(args){
    this.id = BUI.id();

    this.preselectedRowContainerId = null;

    this.height = 600;
    this.width = 600;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    this.onSelectRow = new Event(this);
    this.onLoaded = new Event(this);
    this.onBeamlineChanged = new Event(this);
    this.onUnloadAllButtonClicked = new Event(this);
};

/**
* Returns a panel containing the grid of containers
*
* @method getPanel
* @return A panel containing the grid of containers
*/
ContainerPrepareSpreadSheet.prototype.getPanel = function() {
    var _this = this;

    this.store = Ext.create('Ext.data.Store', {
        storeId:'spreadSheedStore',
        fields:['shippingName', 'shippingId', 'barCode', 'parcelName', 'containerCode', 'containerType', 'sampleCount', 'beamlineName','beamlineCombo','sampleChangerLocation','dewarId','containerId','capacity'],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Loaded or to be Loaded on MxCube',
        buttons: [
                            {
                                xtype: 'button',
                                text: '<div style="color: white">Unload all</div>',
                                width: 200,
                                color: '#FFFFFF',
                                scale: 'large',
                                style: {
                                    background: '#444444',
                                },
                                handler : function(){
                                    // EXI.getDataAdapter().proposal.dewar.updateSampleLocation(_.map(_this.containers,"containerId"), ["null"], [""]);

                                    var onSuccess = function (sender,c) {
                                        _this.onUnloadAllButtonClicked.notify();
                                        _this.loadProcessingDewars(_this.sampleChangerWidget);
                                    }
                                    EXI.getDataAdapter({onSuccess:onSuccess}).proposal.dewar.emptySampleLocation(_.map(_this.containers,"containerId"));
                                }
                            }
        ],
        store: this.store,
        cls : 'border-grid',
        height  : this.height,
        width  : this.width,
        flex    : 0.5,
        columns: [
            // {
            //     dataIndex: 'rowIndex',
            //     sortable : false,
            //     autoSizeColumn: true,
            //     // other config you need..
            //     renderer : function(value, metaData, record, rowIndex)
            //     {
            //         return rowIndex+1;
            //     }
            // },
            {
                header: 'Shipment',
                dataIndex: 'shippingName',
                type: 'text',
                flex: 1,
                readOnly: true
            },
             {
                header: 'DewarId',
                dataIndex: 'dewarId',
                type: 'text',
                flex: 1,
                hidden : true,
                readOnly: true
            },  
            {
                header: 'ShippingId',
                dataIndex: 'shippingId',
                type: 'text',
                flex: 1,
                hidden : true,
                readOnly: true
            },             
             {
                header: 'ContainerId',
                dataIndex: 'containerId',
                hidden : true,
                type: 'text',
                flex: 1,
                readOnly: true
            },   
            {
                header: 'Parcel',
                dataIndex: 'parcelName',
                type: 'text',
                flex: 1,
                readOnly: true
            },
             {
                header: 'Container',
                dataIndex: 'containerCode',
                type: 'text',
                flex: 1,
                readOnly: true,
                renderer : function(value, metaData, record, rowIndex){
                    
                    return record.data.containerCode +  " <span style='color:gray;font-size:10px; font-style:italic;'>(" + record.data.sampleCount +" samples)</span>";
                }
                
            },
            {
                header: 'Barcode',
                dataIndex: 'barCode',
                type: 'text',
                hidden : true,
                flex: 1,
                readOnly: true
            },
           
            {
                header: 'Container type',
                dataIndex: 'containerType',
                type: 'text',
                 flex: 0.75,
                readOnly: true,
                renderer : function(value, metaData, record, rowIndex){                    
                    switch(record.data.containerType) {
                            case "Unipuck":
                                return   "<kbd style='color:white;font-size:11px;background-color:blue;'>UNIPUCK</kbd>";                                
                             case "Spinepuck":
                                return "<kbd style='color:black;font-size:11px;background-color:#CCCCCC;'>SPINEPUCK</kbd>";  
                            default:
                               return "<kbd style='color:white;font-size:11px;background-color:#000000;'>" + record.data.containerType + "</kbd>";
                        }
                }
            },
            {
                header: 'Samples',
                dataIndex: 'sampleCount',
                type: 'text',
                flex: 0.6,
                hidden :true,
                readOnly: true
            },
            {
                header : 'Beamline',
                dataIndex: 'beamlineName',
                hidden : true,
                type: 'dropdown',			        	 								
                flex: 1,
                source: EXI.credentialManager.getBeamlineNames()
            },
             {
                header: 'Beamline',
                dataIndex: 'beamlineCombo',
                type: 'text',
                flex: 1,
                readOnly: true,
                renderer : function(value, metaData, record, rowIndex){
                    var beamlines = _.map(EXI.credentialManager.getBeamlinesByTechnique("MX"),"name");
                    beamlines = _.union(beamlines,[record.data.beamlineName]);
                    _.remove(beamlines, function (beamline) {return _.indexOf(['ID14-4', 'BM14U', 'ID30A-2'], beamline) !== -1});
                    var templateData = {
                                            beamlines   : beamlines,
                                            selected    : record.data.beamlineName,
                                            containerId : record.data.containerId,
                                            id          : _this.id
                                        }
                    var html = "";
                    dust.render("beamlines.combobox.template", templateData, function(err, out){
                        html = out;
                    });
                    return html;
                }
                
            },
            {
                header: 'Sample Changer Location',
                dataIndex: 'sampleChangerLocation',
                flex: 1,
                type: 'text',
                tdCls: 'scl-cell'
            }       
        ],
        viewConfig: {
            getRowClass: function(record, index, rowParams, store) {
                if (record.get('containerType') != "Unipuck" && record.get('containerType') != "Spinepuck"){
                    return "disabled-row";
                }
                if (record.get('sampleChangerLocation') == "" || record.get('sampleChangerLocation') == " " || record.get('sampleChangerLocation') == null ) {
                    return "warning-row";
                }
                for (var i = 0 ; i < _this.containers.length ; i++){
                    var dewar = _this.containers[i];
                    if (record.get('containerId') != dewar.containerId && dewar.beamlineLocation == record.get('beamlineName')) {
                        if (record.get('sampleChangerLocation') == dewar.sampleChangerLocation){
                            return "puck-error";
                        }
                    }
                }
                // if (_this.sampleChangerWidget){
                //     if (record.get('sampleChangerLocation') > _this.sampleChangerWidget.sampleChangerCapacity) {
                //         return "warning-row";
                //     }
                //     var puckToBeFilled = _this.sampleChangerWidget.findPuckById(_this.sampleChangerWidget.convertSampleChangerLocationToId(record.get('sampleChangerLocation')));
                //     if (puckToBeFilled.capacity != record.get('capacity')){
                //         return "warning-row";
                //     }
                // }
                return "";
            }
        },
        listeners: {
            itemclick: function(grid, record, item, index, e) {
                if (record.data.containerType == "Unipuck" || record.data.containerType == "Spinepuck"){
                    if (e.target.tagName != "SELECT"){
                        _this.onSelectRow.notify({record : record, item : item});          
                    }
                }
            }
           

        },
        margin  : 5,
        items   : [
            {
                html : "<div style='height:700px;' id='" + this.id +"'></div>",
                flex : 1,
                height : 400                              
            }
            
        ]
    });

    return this.panel;
};

/**
* Loads the processing dewars from the database
*
* @method loadProcessingDewars
* @return
*/
ContainerPrepareSpreadSheet.prototype.loadProcessingDewars = function (sampleChangerWidget) {
    var _this = this;

    this.panel.setLoading();
    var onSuccessProposal = function(sender, containers) {
        var processingContainers = _.filter(containers, function(e){return e.shippingStatus == "processing";});
        //Check if some of the containers have the old value Puck for containerType, in which case, we need to use the sample locations to specify the type
        var containersFromISPyB = _.filter(processingContainers,{"containerType":"Puck"});
        if (containersFromISPyB.length > 0) {
            var onSampleSuccess = function (sender, samples) {
                if (samples && samples.length > 0) {
                    _.map(samples,function (s) {s.location = parseInt(s.BLSample_location)});
                    var groupedByContainer = _.groupBy(samples,"Container_containerId");
                    _.forEach(groupedByContainer,function(smpls, containerId){
                                                                var type = "Spinepuck";
                                                                if (_.maxBy(smpls,"location") > 10) {
                                                                    type = "Unipuck";  
                                                                }
                                                                _.map(processingContainers,function (c) {
                                                                    if (c.containerId == containerId) {
                                                                        c.containerType = type;
                                                                        if (type == "Spinepuck") {
                                                                            c.capacity = 10;
                                                                        } else if (type == "Unipuck") {
                                                                            c.capacity = 16;
                                                                        }
                                                                    }
                                                                });
                                                            }
                    );
                }
                _this.load(processingContainers,sampleChangerWidget);
                _this.panel.setLoading(false);
                _this.onLoaded.notify(processingContainers);
            }
            EXI.getDataAdapter({onSuccess : onSampleSuccess}).mx.sample.getSamplesByContainerId(_.map(containersFromISPyB,"containerId"));
        } else {
            _this.load(processingContainers,sampleChangerWidget);
            _this.panel.setLoading(false);
            _this.onLoaded.notify(processingContainers);
        }
    };
    var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
        _this.panel.setLoading(false);
    };
    EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
}

/**
* Loads an array of dewars to the store
*
* @method load
* @param dewars
* @return
*/
ContainerPrepareSpreadSheet.prototype.load = function(containers, sampleChangerWidget) {
    var _this = this;
    this.containers = containers;
    if (sampleChangerWidget){
        this.sampleChangerWidget = sampleChangerWidget;
    }
    var data = [];
    var error = false;
    //Parse data
    for (var i = 0 ; i < containers.length ; i++) {
        var container = containers[i];
        if (container.containerId){
            var containerType = container.containerType;
            if (containerType == "Puck") {
                containerType = "Spinepuck";
                container.capacity = 10;
            }
            data.push({
                shippingName : container.shippingName,
                shippingId : container.shippingId,
                parcelName : container.containerCode,
                barCode : container.barCode,
                containerCode : container.containerCode,
                containerType : containerType,
                sampleCount : container.sampleCount,
                beamlineName : container.beamlineLocation,
                sampleChangerLocation : container.sampleChangerLocation,
                dewarId : container.dewarId,
                containerId : container.containerId,
                capacity : container.capacity
            });
        } else {
            error = true;
        }
    }

    if (error){
        $.notify("Error: error loading the containers", "error");
    }

    this.store.loadData(data);
    //Define listener for beamline combobox
    $('.beamlines-select').change(function(sender) {
        var beamline = $("#" + _this.id + "-" + sender.target.value + " option:selected").text();
        var containerId = sender.target.value;
        _this.updateBeamlineName(containerId,beamline);
        _this.onBeamlineChanged.notify(beamline);
    });
    //Check if any row should be selected
    if (this.preselectedRowContainerId) {
        var row = _.filter(this.panel.getStore().data.items,function (o) {return o.data.containerId == parseInt(_this.preselectedRowContainerId);});
        if (row && row.length > 0) {
            this.onSelectRow.notify({record : row[0]});
            this.preselectedRowContainerId = null;
        }
    }
};

/**
* Updates the sample changer location cell of the record with the corresponding container Id
*
* @method updateSampleChangerLocation
* @param {Integer} containerId The container Id of the record to be updated
* @param {Integer} location The new value for the sample changer location cell in the grid
* @return
*/
ContainerPrepareSpreadSheet.prototype.updateSampleChangerLocation = function (containerId, location) {
    var _this = this;
    var recordsByContainerId = this.getRowsByContainerId(containerId);

    for (var i = 0 ; i < recordsByContainerId.length ; i++) {
        var record = recordsByContainerId[i];
        if (record.get('containerId') == containerId) {
            var beamlineName = record.get('beamlineName');
            if (beamlineName) {
                var onSuccess = function(sender, containers) {
                    _this.loadProcessingDewars();
                };
                var onError = function(sender, error) {        
                    EXI.setError("Ops, there was an error");
                };

                EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.dewar.updateSampleLocation([containerId], [beamlineName], [location]);
            } else {
                $.notify("The beamline is not defined", "error");
            }
            return
        }
    }
};

ContainerPrepareSpreadSheet.prototype.updateBeamlineName = function (containerId, beamline) {
    var _this = this;

    var onSuccess = function(sender, containers) {
        _this.preselectedRowContainerId = containerId
        _this.loadProcessingDewars();
    };
    var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
    };

    EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.dewar.updateSampleLocation([containerId], [beamline], [""]);
};

/**
* Returns the row with the given containerId
*
* @method getRowsByContainerId
* @param {Integer} containerId The container Id of the record to be returned
* @return The rows with the given containerId
*/
ContainerPrepareSpreadSheet.prototype.getRowsByContainerId = function (containerId) {
    var recordsByContainerId = _.filter(this.panel.store.data.items,function(o) {return o.data.containerId == containerId});
    return recordsByContainerId;
};