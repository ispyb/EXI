/**
* This class containes name, description, samples spreadsheet and puck loyout for a given puck 
*
* @class PuckForm
* @constructor
**/
function CSVPuckFormView(args) {
	this.id = BUI.id();
	

	this.height = 500;
	this.width = 500;
	this.unsavedChanges = false;
	
	/** When getPanel it will load all the samples for this proposal */
	this.proposalSamples = [];

	/** dewars names that already exist on this shipment */
	this.dewarNameControlledList = [];
	this.containerNameControlledList = [];



	/**  csvpuckformview.template contains information panels which id are the stored in the next variables. This is done because we want to use notify based in the ID **/
	this.uniquenessParcelPanelId = this.id + "_uniquenessParcelPanelId";
    this.acceptedContainerListPanelId = this.id + "_acceptedContainerListPanelId";
	this.uniquenessContainerNamelPanelId = this.id + "_uniquenessContainerNamelPanelId";
	this.uniquenessSampleNamePanelId = this.id + "_uniquenessSampleNamePanelId";


	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

	
	var _this = this;
	
	 this.containerSpreadSheet = new CSVContainerSpreadSheet({
        width: Ext.getBody().getWidth() - 100,
        height: Ext.getBody().getHeight() - 500,
    });
	
	this.onRemoved = new Event(this);
	this.onSaved = new Event(this);
}

CSVPuckFormView.prototype.getToolBar = PuckFormView.prototype.getToolBar;
CSVPuckFormView.prototype.returnToShipment = PuckFormView.prototype.returnToShipment;
CSVPuckFormView.prototype.checkSampleNames = PuckFormView.prototype.checkSampleNames;
CSVPuckFormView.prototype.displaySpecialCharacterWarning = PuckFormView.prototype.displaySpecialCharacterWarning;
CSVPuckFormView.prototype.displayUniquenessWarning = PuckFormView.prototype.displayUniquenessWarning;
CSVPuckFormView.prototype.showReturnWarning = PuckFormView.prototype.showReturnWarning;
CSVPuckFormView.prototype.getSamplesFromProposal = PuckFormView.prototype.getSamplesFromProposal;



CSVPuckFormView.prototype.getToolBar = function() {
	var _this = this;
	return [
			{
			    text: 'Remove',
				id: this.id + "_remove_button",
			    width : 100,
			    height : 30,
				disabled : true,
			    cls : 'btn-red',
			    handler : function(){
			    	function showResult(result){
						if (result == "yes"){
							_this.removePuck();							
						}
			    	}
					  Ext.MessageBox.show({
				           title:'Remove',
				           msg: 'Removing a puck from this parcel will remove also its content. <br />Are you sure you want to continue?',
				           buttons: Ext.MessageBox.YESNO,
				           fn: showResult,
				           animateTarget: 'mb4',
				           icon: Ext.MessageBox.QUESTION
				       });
			    }
			},
	        "->",
	        {
	            text:'Add Protein',
	            //iconCls: 'icon-clear-group',
	            id: "add_protein_puck_item",
	            width : 150,
	            height : 30,
                /*scope: this,*/
                disabled : true,
                handler: function () {
                    _this.addProtein();
                }
	        },
	        {
	            text: 'Save',
                id: this.id + "_save_button",
	            width : 100,
	            height : 30,
				disabled : false,
	            handler : function(){
	            	_this.save();
	            }
	        },
			{
	            text: 'Return to shipment',
	            width : 200,
	            height : 30,
	            handler : function () {
                    _this.returnToShipment();
                }
	        }
	];
};

CSVPuckFormView.prototype.displayErrors = function(errors, panelId, message) {
	if (errors){
		if (errors.length > 0){			
			var rows = _.map(errors, function(o){ return Number(o.rowIndex)+1; });
			$("#" + panelId).notify("Rows " + rows + " " +  message, { position:"bottom" });
			$("#" + panelId).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
			return true;
		}
	}
};

CSVPuckFormView.prototype.addProtein = function(){
    var _this = this;
    var proteinEditForm = new ProteinEditForm({width : 600, height : 700});

    proteinEditForm.onSaved.attach(function (sender, protein) {
        _this.containerSpreadSheet.reloadAcronyms();
        //_this.save(false);
        window.close();
    });

    var window = Ext.create('Ext.window.Window', {
        title : 'Protein',
        height : 500,
        width : 700,
        padding : '10 10 10 10',
        modal : true,
        layout : 'fit',
        items : [ proteinEditForm.getPanel() ],
        buttons : [ {
                text : 'Save',
                handler : function() {
                    proteinEditForm.saveProtein();
                }
            }, {
                text : 'Cancel',
                handler : function() {
                    window.close();
                }
            } ]
    }).show();

    proteinEditForm.load();
};

/*
	this.uniquenessParcelPanelId = this.id + "_uniquenessParcelPanelId";
    this.acceptedContainerListPanelId = this.id + "_acceptedContainerListPanelId";
	this.uniquenessContainerNamelPanelId = this.id + "_uniquenessContainerNamelPanelId";
	this.uniquenessSampleNamePanelId = this.id + "_uniquenessSampleNamePanelId";
*/
CSVPuckFormView.prototype.save = function() {
    var _this = this;
    var parcels = this.containerSpreadSheet.getParcels();   

	if (!this.containerSpreadSheet.isDataValid()){	
		$.notify("Sorry. Your data contain errors!", "error");
		var errors = (this.containerSpreadSheet.getErrors());
		if (this.displayErrors(errors.INCORRECT_PARCEL_NAME, this.uniquenessParcelPanelId, " contain parcel names that are not unique within the proposal")){
			return;
		}
		if (this.displayErrors(errors.INCORRECT_CONTAINER_NAME, this.uniquenessContainerNamelPanelId, "")){
			return;
		}
		if (this.displayErrors(errors.INCORRECT_CONTAINER_TYPE, this.acceptedContainerListPanelId, "")){
			return;
		}	
		if (this.displayErrors(errors.INCORRECT_SAMPLE_POSITION, this.uniquenessSampleNamePanelId, "")){
			return;
		}	
		if (this.displayErrors(errors.INCORRECT_SAMPLE_NAME, this.uniquenessSampleNamePanelId, "")){
			return;
		}			
	}

    var onError = function(sender, error, mesg){
			_this.panel.setLoading(false);                        
			EXI.setError(error.responseText);
			$.notify(error.responseText, "error");
		};
		
		var onSuccess = function(sender, puck){
			_this.panel.setLoading(false); 
			_this.returnToShipment();         
	};
	this.panel.setLoading("Saving CSV");
		
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.addDewarsToShipment(this.shippingId, parcels);

};


CSVPuckFormView.prototype.getWarningPanelsHTML = function() {	
	/** Warning HTML */
	var html = "";
	var showOnlyUnipuckMessageValue = false;
	if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
	    showOnlyUnipuckMessageValue = true;
    }
	dust.render("csvpuckformview.template", 
					{
								uniquenessParcelPanelId			: this.uniquenessParcelPanelId,
								acceptedContainerListPanelId 	: this.acceptedContainerListPanelId,
								uniquenessContainerNamelPanelId : this.uniquenessContainerNamelPanelId,
								uniquenessSampleNamePanelId 	: this.uniquenessSampleNamePanelId,
								showOnlyUnipuckMessage          : showOnlyUnipuckMessageValue
					}, 
					function(err, out) {						
                    	html = out;
    				}
	);
	return html;
};

CSVPuckFormView.prototype.getPanel = function() {
	/** Get Samples from Proposal */
	this.getSamplesFromProposal();

	this.panel = Ext.create('Ext.panel.Panel', {
		autoScroll : true,				
		icon : this.icon,
        layout : 'fit',
        padding: 10,
		border : 0,
		items :[this.getContainer()]
		});
    var _this = this;
    this.panel.on('boxready', function() {
        if (EXI.credentialManager.isUserAllowedAddProtein()){
            Ext.getCmp('add_protein_puck_item').enable();
        } else {
            Ext.getCmp('add_protein_puck_item').disable();
        }
        if (_this.onBoxReady){
            _this.onBoxReady();
        }
    });
    
	return this.panel;
};

CSVPuckFormView.prototype.getContainer = function() {
    var html = "";
    var siteName = "";
    if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
        siteName = "MAXIV";
    }

    dust.render("csvimportmainview.template", {
        id: "file_" + this.id,
        siteName: siteName
    }, function(err, out) {
        html = out;
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        autoScroll: true,
        buttons : this.getToolBar(),
        layout: 'vbox',
        items: [
            {
                html: html,
                height: 60,
                margin : 10
            },
			{
				html : this.getWarningPanelsHTML()
			},
            this.containerSpreadSheet.getPanel(),

        ]
    });

    return this.panel;

};

/**
* This converts the content of a CSV file and split up into lines and columns
*
* @method csvToArray
* @return {Array} Array of arrays that represents rows and columns of the CSV 
*/
CSVPuckFormView.prototype.csvToArray = function(csvContent) {    
    if (csvContent){
        var allTextLines = csvContent.split(/\r\n|\n/);
        if (allTextLines){
            if (allTextLines.length > 0){
                var lines = [];
                for (var i=0; i<allTextLines.length -1; i++) {					
					if (!allTextLines[i].trim().startsWith("#")){
                    	var line = allTextLines[i].split(',');                                        
                    	lines.push(line);
					}
                }
                return lines;        
            }
        }
    }
};

CSVPuckFormView.prototype.setFileUploadListeners = function() {
	var _this = this;
	function handleFileSelect(evt) {            
		var files = evt.target.files; // FileList object            
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {              
				var reader = new FileReader();
				reader.onload = (function(f) {					 
					$("#box_file_" + _this.id).val(f.name);					 
					$("#box_info_" + _this.id).html(f.size/1024 + " KB");
								
				return function(e) {                                        
					_this.containerSpreadSheet.loadData(_this.csvToArray(e.target.result));
															
				};
			})(f);
				// Read in the image file as a data URL.
			reader.readAsText(f);
		}
	}

	/** Add listener to change */
	document.getElementById("file_" + _this.id).addEventListener('change', handleFileSelect, false);
	/** Make button active */
	document.getElementById("file_" + _this.id).disabled = false;

};


CSVPuckFormView.prototype.load = function(shippingId) {
    var _this = this;
    this.panel.setTitle("Import CSV");
    this.shippingId = shippingId;

    //var data = JSON.parse("[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]");
    this.containerSpreadSheet.loadData([[]]);

    function attachListeners() {
        _this.setFileUploadListeners();
    };
    var timer = setTimeout(attachListeners, 1000);

	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipment = shipment;
			_this.dewarNameControlledList = _.map(_this.shipment.dewarVOs, 'code');	

			for(var i = 0; i < shipment.dewarVOs.length; i++){				
				_this.containerNameControlledList = _this.containerNameControlledList.concat(_.map(shipment.dewarVOs[i].containerVOs, 'code'));				
			}		
			/** Setting controlled list of values into spreadSheet object */			
			_this.containerSpreadSheet.setContainerNameControlledList(_this.containerNameControlledList);
			_this.containerSpreadSheet.setDewarNameControlledList(_this.dewarNameControlledList);
			_this.panel.setLoading(false);
		};
		var onError = function(sender, error){			
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.getShipment(shippingId);
    }	


};




