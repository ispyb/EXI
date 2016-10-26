function PrepareMainView() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];

	MainView.call(this);

    var _this = this;
    
    this.dewarListSelector = new DewarListSelectorGrid({height : 600});
    this.dewarListSelector.onSelect.attach(function(sender, dewar){                     
            if (dewar.shippingStatus == "processing"){
                _this.updateStatus(dewar.shippingId, "at_ESRF");
            } 
            if (dewar.shippingStatus != "processing"){
                _this.updateStatus(dewar.shippingId, "processing");
            }      
     });
     
    this.dewarListSelector.onSelectionChange.attach(function(sender, dewars){
    });
    
	this.containerListEditor = new ContainerPrepareSpreadSheet({height : 600});
}

PrepareMainView.prototype.updateStatus = function(shippingId, status) {
    var _this = this;
    _this.dewarListSelector.panel.setLoading("Updating shipment Status");
    var onStatusSuccess = function(sender, dewar) {     
        EXI.mainStatusBar.showReady("Processing update successfully");
        _this.dewarListSelector.panel.setLoading(false);
        _this.load();
    };
    var onError = function(data){
            EXI.setError(data);
    };
    
    EXI.getDataAdapter({onSuccess : onStatusSuccess, onError : onError}).proposal.shipping.updateStatus(shippingId,status);
};

PrepareMainView.prototype.getPanel = function() {
	this.panel =  Ext.create('Ext.panel.Panel', {
           layout : 'hbox',
            items : [
                        this.dewarListSelector.getPanel(), 
                        this.containerListEditor.getPanel()        
            ]
	});    
    return this.panel;
};

PrepareMainView.prototype.load = function() {
    var _this = this;
    _this.panel.setTitle("Prepare Experiment");
    _this.dewarListSelector.panel.setLoading();
    var onSuccessProposal = function(sender, containers) {        
        _this.containers = containers;
        
        _this.dewarListSelector.load(containers);
        _this.dewarListSelector.panel.setLoading(false);
        
        /** Selecting containers that are processing */
        _this.containerListEditor.load(_.filter(containers, function(e){return e.shippingStatus == "processing";}));
        
    };
     var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
        _this.dewarListSelector.panel.setLoading(false);
    };
    
    EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
};
