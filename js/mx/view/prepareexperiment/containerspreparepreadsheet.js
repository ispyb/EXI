/**
* This class renders a grid containing container information
* @class ContainerPrepareSpreadSheet
* @constructor
*/
function ContainerPrepareSpreadSheet(args){
    this.id = BUI.id();

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
        fields:['shippingName', 'barCode', 'containerCode', 'containerType', 'sampleCount', 'beamlineName','sampleChangerLocation','dewarId','containerId','capacity'],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Loaded or to be Loaded on MxCube',
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
                header: 'ContainerId',
                dataIndex: 'containerId',
                hidden : true,
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
                               return record.data.containerType;
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
                header : 'Selected Beamline',
                dataIndex: 'beamlineName',
                type: 'dropdown',			        	 								
                flex: 1,
                source: EXI.credentialManager.getBeamlineNames()
            },
            {
                header: 'Sample Changer Location',
                dataIndex: 'sampleChangerLocation',
                flex: 1,
                type: 'text'
            }       
        ],
        viewConfig: {
            getRowClass: function(record, index, rowParams, store) {
                if (record.get('sampleChangerLocation') == "" || record.get('sampleChangerLocation') == " " || record.get('sampleChangerLocation') == null ) {
                    return "warning-row";
                }
                for (var i = 0 ; i < _this.dewars.length ; i++){
                    var dewar = _this.dewars[i];
                    if (record.get('dewarId') != dewar.dewarId && dewar.sampleCount > 0) {
                        if (record.get('sampleChangerLocation') == dewar.sampleChangerLocation){
                            return "puck-error";
                        }
                    }
                }
                if (_this.sampleChangerWidget){
                    if (record.get('sampleChangerLocation') > _this.sampleChangerWidget.sampleChangerCapacity) {
                        return "warning-row";
                    }
                    var puckToBeFilled = _this.sampleChangerWidget.findPuckById(_this.sampleChangerWidget.convertSampleChangerLocationToId(record.get('sampleChangerLocation')));
                    if (puckToBeFilled.capacity != record.get('capacity')){
                        return "warning-row";
                    }
                }
                return "";
            }
        },
        listeners: {
            itemclick: function(grid, record, item, index, e) {
                _this.onSelectRow.notify(record);             
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

    //arrowUp and arrowDown listeners. 
    //Needs the first column of row Index
    // this.panel.view.addElListener('keyup', function(event,row) {
    //     if (event.keyCode == 38 || event.keyCode == 40) { 
    //         _this.onSelectRow.notify(_this.panel.store.getAt(Number(row.cells[0].innerText)-1));
    //     }
    // });

    // this.panel.on('boxready', function() {
    //     for (var i = 0 ; i < _this.warningRows.length ; i++) {
    //         var containerId = _this.warningRows[i];
    //         _this.addClassToRow (containerId, "warning-row");
    //     }
    // });

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
        _this.load(processingContainers,sampleChangerWidget);
        _this.panel.setLoading(false);
        _this.onLoaded.notify(processingContainers);
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
ContainerPrepareSpreadSheet.prototype.load = function(dewars, sampleChangerWidget) {
    this.dewars = dewars;
    if (sampleChangerWidget){
        this.sampleChangerWidget = sampleChangerWidget;
    }
    var data = [];
    var preSelectedBeamline = null;
    if (typeof(Storage) != "undefined"){
        var preSelectedBeamline = sessionStorage.getItem("selectedBeamline");
    }
    // var emptyDewars = false;
    //Parse data
    for (dewar in dewars) {
        // if (dewars[dewar].sampleCount > 0){
        var beamlineName = dewars[dewar].beamlineName;
        if (preSelectedBeamline) {
            beamlineName = preSelectedBeamline;
        }
        var containerType = "Unipuck";
        if (dewars[dewar].capacity){
            if (dewars[dewar].capacity == 10) {
                containerType = "Spinepuck";
            }
        }
        data.push({
            shippingName : dewars[dewar].shippingName,
            barCode : dewars[dewar].barCode,
            containerCode : dewars[dewar].containerCode,
            containerType : containerType,
            sampleCount : dewars[dewar].sampleCount,
            beamlineName : beamlineName,
            sampleChangerLocation : dewars[dewar].sampleChangerLocation,
            dewarId : dewars[dewar].dewarId,
            containerId : dewars[dewar].containerId,
            capacity : dewars[dewar].capacity
        });
        // } else {
        //     emptyDewars = true;
        // }
    }

    // if (emptyDewars){
        // $.notify("Warning: Some of the dewars have no samples on them.", "warn");
    // }

    this.store.loadData(data);
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
    var recordsByContainerId = _.filter(_this.panel.store.data.items,function(o) {return o.data.containerId == containerId});

    for (var i = 0 ; i < recordsByContainerId.length ; i++) {
        var record = recordsByContainerId[i];
        if (record.get('containerId') == containerId) {
            var beamlineName = record.get('beamlineName');

            var onSuccess = function(sender, containers) {
                _this.loadProcessingDewars();
            };
            var onError = function(sender, error) {        
                EXI.setError("Ops, there was an error");
            };

            EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.dewar.updateSampleLocation([containerId], [beamlineName], [location]);
            return
        }
    }
};

/**
* Returns the row with the given containerId
*
* @method getRowByContainerId
* @param {Integer} containerId The container Id of the record to be returned
* @return The row with the given containerId
*/
ContainerPrepareSpreadSheet.prototype.getRowsByContainerId = function (containerId) {
    var recordsByContainerId = _.filter(this.panel.store.data.items,function(o) {return o.data.containerId == containerId});
    return recordsByContainerId;
};