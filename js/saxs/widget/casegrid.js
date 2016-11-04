/**
 * A shipment may contains one or more cases where stock solutions and sample plates are stored
 * 
 * @height
 * @btnEditVisible
 * @btnRemoveVisible
 * 
 * #onEditButtonClicked
 * #onAddButtonClicked
 * #onRemoveButtonClicked
 * #onDuplicateButtonClicked
 */
function CaseGrid(args) {

	this.height = 100;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}

CaseGrid.prototype._getHTMLTable = function(items) {
	var html = "<table style='font-size:14px;color:gray;'>";
	
	for (var i = 0; i < items.length; i++) {
		html = html + "<tr>";
		html = html + "<td>";
		html = html + items[i].key;
		html = html + "</td>";
		html = html + "<td style='font-weight:bold;color:black;'>";
		html = html + items[i].value;
		html = html + "</td>";
		html = html + "</tr>";
	}
	return html + "</table>";
	
	
};

CaseGrid.prototype._getHTMLButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="btn" style="font-size:9px;width:90px; height:40px" class="btn-component" value="' + value +'" >';
};

CaseGrid.prototype._getUnpackStockSolutionButton = function(stockSolutionId, value) {
	return '<input id="' + stockSolutionId +'"type="button" name="stockSolution" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};

CaseGrid.prototype._getRemoveContainerButton = function(stockSolutionId, value) {
	return '<input id="' + stockSolutionId +'"type="button" name="puck" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};

CaseGrid.prototype._getEditPuckButton = function(type, id, value) {
	return '<input id="' + type + "_" + id +'"type="button" name="edit" style="font-size:9px;width:90px; height:40px" class="btn-component-puck-edit" value="' + value +'" >';
};

CaseGrid.prototype._getPrintParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="printLabels" style="font-size:9px;width:90px; height:40px" class="btn-component-print-parcel" value="' + value +'" >';
};

CaseGrid.prototype._getEditParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="editParcel" style="font-size:9px;width:90px; height:40px" class="btn-component-edit-parcel" value="' + value +'" >';
};

CaseGrid.prototype._getRemoveParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="removeParcel" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};


CaseGrid.prototype._getComponentRowHTML = function(icon, type, code, capacity, id) {
	var html = "";
	html = html + "<tr  class='tr-component'>";
	

	html = html + "<td>";
	html = html +  this._getEditPuckButton(type, Number(id), "Edit");
	html = html + "</td>";

	/*
	html = html + "<td>";
	html = html + "<img style='cursor:pointer;' name='edit' id='" + type +"_" + id +"' src=\'" + icon + "' />";
	html = html + "</td>";
	*/
	html = html + "<td>";
	html = html +  type;
	html = html + "</td>";
	
	html = html + "<td>";
	html = html +  code;
	html = html + "</td>";

	
	html = html + "<td>";
	html = html +  capacity;
	html = html + "</td>";

	


	if (type == "Stock Solution"){
		html = html + "<td>";
		html = html +  this._getUnpackStockSolutionButton(Number(id), "Unpack");
		html = html + "</td>";
	}
	
	if (type == "Puck"){
		html = html + "<td>";
		html = html +  this._getRemoveContainerButton(Number(id), "Remove");
		html = html + "</td>";
	}

	
	
	html = html + "</tr>";
	return html;
};

CaseGrid.prototype._getComponentHTML = function(dewarId, items) {
	var html = "";
	if (items.length > 0){
		html = "<table  class='table-component'><tr><th class='th-component'></th><th class='th-component'>Type</th><th class='th-component'>Code</th><th class='th-component'>Capacity</th><th></th></tr>";
		for (var i = 0; i < items.length; i++) {
			var icon = '../images/BasketView_24x24_01.png';
			
			if (items[i].type == "Puck"){
					html = html + this._getComponentRowHTML(icon, items[i].type,  items[i].code,  items[i].sampleCount + "/"+ items[i].capacity,  items[i].id);
			}
			
			if (items[i].type == "Stock Solution"){
				icon = '../images/SampleHolderView_24x24_01.png';
				html = html + this._getComponentRowHTML(icon, items[i].type,  items[i].code,  items[i].capacity, items[i].id);
			}
			
		}
		html = html + "</table>";
	}
	else{
		html = html + "<br /><br /><span class='parcel-empty-msg'>This parcel is empty</span>";
	}
	
	
	/** Adding buttons **/
	if (items.length == 0){
		html =  this._getHTMLButton(dewarId, "Add Solution") + this._getHTMLButton(dewarId, "Add Puck") + html;
	}

	if (items.length > 0){
		if (items[0].type == "Puck"){
			html =  this._getHTMLButton(dewarId, "Add Puck") + html;
		}
		else{
			html =  this._getHTMLButton(dewarId, "Add Solution")+ html;
		}
	}
	return '<div  class="header-component-table" >Components</div><div  style="margin:0px 0px 0px 0px !important;width:610px;">' + html + '</div>';
};


CaseGrid.prototype._getParcelHTML = function(dewar) {
	var html = "<table  class='table-component'><tr><th class='th-component'>Code</th><th class='th-component'>Status</th><th class='th-component'>Store Location</th><th class='th-component'>Comments</th></tr>";

	var storageLocation = dewar["Dewar_storageLocation"];
	var dewarCode = dewar["Dewar_code"];
	var status = dewar["Dewar_status"];
	var comments = dewar["Dewar_comments"];

	if (dewarCode == null){
		dewarCode = "<span style='color:orange'>Not set</span>";
	}

	if (status == null){
		status = "<span style='color:orange'>Unknown</span>";
	}

	if (storageLocation == null){
		storageLocation = "<span style='color:orange'>Not set</span>";
	}

	if (comments == null){
		comments = "";
	}

	html = html + "<tr class='tr-component'><td>" + dewarCode + "</td><td>" + status + "</td><td>" + storageLocation + "</td><td>" + comments + "</td></tr></table>"
	/** Adding buttons **/
	html =  this._getEditParcelButton(dewar["Dewar_dewarId"], "Edit") +  this._getPrintParcelButton(dewar["Dewar_dewarId"], "Print Labels") + this._getRemoveParcelButton(dewar["Dewar_dewarId"], "Remove") + html;
	return '<div  class="header-component-table" >Parcel</div><div  style="margin:0px 0px 0px 0px !important;width:610px;">' + html + '</div>';
};



CaseGrid.prototype._getColumns = function() {
	var _this = this;


	var columns = [
		{
			header : 'General',
			dataIndex : 'type',
			name : 'type',
			type : 'string',
			flex : 0.5,
			
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				return _this._getParcelHTML(deserialized[0]);
			}
		},
		{
			header : 'Content',
			dataIndex : 'Dewar_comments',
			name : 'type',
			type : 'string',
			flex : 0.5,
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				var dewarId = deserialized[0].Dewar_dewarId;
				var items = [];
				
				if (deserialized != null){
					if (deserialized.length > 0){
						for (var i = 0; i < deserialized.length; i++) {
							if (deserialized[i].Container_containerType == "Puck"){
								var code = "";
								if (deserialized[i].Container_code != null){
									code = deserialized[i].Container_code;
								}

								items.push({
								    type 	: deserialized[i].Container_containerType,
								    code 	: code,
								    capacity 	: deserialized[i].Container_capacity,
								    sampleCount : deserialized[i].sampleCount,
								    id 		: deserialized[i].Container_containerId,
								 
								});
								
							}
						}
					}
				}
				
				/** Stock Solutions **/
				var stockSolutions = EXI.proposalManager.getStockSolutionsByDewarId(dewarId);
                if(stockSolutions){
                    for (var i = 0; i < stockSolutions.length; i++) {                        
                            items.push({
                                    type 	: "Stock Solution",
                                            code 	: stockSolutions[i].name,
                                        capacity :	stockSolutions[i].volume + "ml",
                                        sampleCount :	"",
                                        id : 	stockSolutions[i].stockSolutionId                            
                            });                            
                    }
                }
				/** Rendering on HTML **/
				return _this._getComponentHTML(dewarId, items);
			}
		}
		/*{
			header : 'Comments',
			dataIndex : 'Dewar_comments',
			name : 'type',
			type : 'string',
			flex : 1,
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				return deserialized[0].Dewar_comments;
			}
		},*/
	];
	return columns;
};

CaseGrid.prototype._getTopButtons = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	/** ADD BUTTON **/
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
	

	return actions;
};


CaseGrid.prototype.groupBy = function(array , f ){
	  var groups = {};
	  array.forEach( function( o )
	  {
	    var group = JSON.stringify( f(o) );
	    groups[group] = groups[group] || [];
	    groups[group].push( o );  
	  });
	  
	  return Object.keys(groups).map( function( group ){
		  return groups[group]; 
	  });
	};

CaseGrid.prototype.load = function(shipment) {
	var _this = this;
	
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;
	
	if (this.dewars.length > 0){
		function onSuccess(sender, containers){
			var dewars = (_this.groupBy(containers, function(item){
				  return [item.Dewar_dewarId];
			}));
			var data = [];
			for (var i = 0; i < dewars.length; i++) {
				data.push({serialized : JSON.stringify(dewars[i])})
			}
			_this.store.loadData(data);
		}
		
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getDewarsByShipmentId(shipment.shippingId);
	}
};


CaseGrid.prototype.edit = function(dewar) {
	var _this = this;
	var caseForm = new CaseForm();
	
	var window = Ext.create('Ext.window.Window', {
	    title: 'Parcel',
	    height: 360,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	caseForm.getPanel(dewar)
	    ],
	    buttons : [ {
						text : 'Save',
						handler : function() {
							var adapter = new DataAdapter();
							_this.panel.setLoading();
							var dewar = caseForm.getDewar();
							var onSuccess = (function(sender, shipment) {
								_this.load(shipment);
								window.close();
								_this.panel.setLoading(false);
							});
							dewar["sessionId"] = dewar.firstExperimentId;
							dewar["shippingId"] = _this.shipment.shippingId;
							EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
	});
	window.show();
	
};

CaseGrid.prototype._getStoreFields = function() {
	return [ {
		name : 'serialized',
		type : 'string'
	}
	];
};

CaseGrid.prototype.getDewarById = function(dewarId) {
	var _this = this;
	for (var i = 0; i < _this.dewars.length; i++) {
		if (_this.dewars[i].dewarId == dewarId){
			return _this.dewars[i];
		}
	}
};

CaseGrid.prototype.saveStockSolution = function(stockSolution) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(){
		var onSuccess2 = function(){
			_this.panel.setLoading(false);
			_this.load(_this.shipment);
		};
		EXI.getDataAdapter({onSuccess : onSuccess2}).proposal.proposal.update();
	}
	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.stockSolution.saveStockSolution(stockSolution);
};



CaseGrid.prototype.addPuckToDewar = function(dewarId) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(){
		_this.load(_this.shipment);
		_this.panel.setLoading(false);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addPuck(this.shipment.shippingId, Number(dewarId));
	
};

CaseGrid.prototype.removePuck = function(puckId) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.load(_this.shipment);
		_this.panel.setLoading(false);
	};
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(_this.shipment.shippingId,puckId,puckId );
	
};

/** Open a window with the stock solutions **/
CaseGrid.prototype.openStockSolutionWindow = function(dewarId) {
	var _this = this;
	var stockSolutionGrid = new StockSolutionGrid({
		btnAddVisible : false,
		btnEditVisible : false,
		btnRemoveVisible : false,
		btnAddExisting : false,
		isPackedVisible : false,
		multiselect : true
	});

	var window = Ext.create('Ext.window.Window', {
		height : 400,
		width : 700,
		items : [ stockSolutionGrid.getPanel() ],
		buttons : [ {
			text : 'Pack',
			handler : function() {
				window.close();
				stockSolutionGrid.selectedStockSolutions[0]["boxId"] = dewarId;
				_this.saveStockSolution(stockSolutionGrid.selectedStockSolutions[0]);
				
			}
		}, {
			text : 'Cancel',
			handler : function() {
				window.close();
			}
		} ]

	}).show();

	stockSolutionGrid.load(EXI.proposalManager.getUnpackedStockSolutions());
};

CaseGrid.prototype.getPanel = function() {
	var _this = this;

	/** Store **/
	this.store = Ext.create('Ext.data.Store', {
		fields : this._getStoreFields(),
		data : [],
		autoload : true
	});

	
	this.panel = Ext.create('Ext.grid.Panel', {
		style : {
			padding : 15
		},
		cls : 'border-grid',
		height : 800,
		deferEmptyText: false,
	    	emptyText: 'No data',
		store : this.store,
		columns : this._getColumns(),
		disableSelection : true,
		viewConfig : {
			stripeRows : true,
				enableTextSelection : true,
				preserveScrollOnRefresh : true,
				stripeRows : true,
				rowLines : true,
				listeners : {
					celldblclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
						_this.edit(_this.getDewarById(JSON.parse(record.data.serialized)[0].Dewar_dewarId));
					},
					cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

							if (e.target.name == 'printLabels') {
								var dewarId = e.target.id.trim();
								var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(_this.shipment.shippingId, dewarId);
								console.log(dewarId);
								location.href = url;
								return;
							}
							if (e.target.name == 'removeParcel') {
								BUI.showWarning("Not implemented yet");
								return;
							}
							if (e.target.name == 'editParcel') {
								_this.edit(_this.getDewarById(parseInt(e.target.id.trim())));
								return;
							}
							if (e.target.name == 'edit') {
								/** Edit stock solution **/
								if (e.target.id.indexOf("Stock Solution") != -1){
									var stockSolutionId = e.target.id.split("_")[1];
									location.hash = "/stocksolution/" + stockSolutionId +"/main";
								}
								
								if (e.target.id.indexOf("Puck") != -1){
									var containerId = e.target.id.split("_")[1];
									//location.hash = "/puck/" + containerId +"/main";
									var puckForm = new PuckForm({
										width : Ext.getBody().getWidth() - 150
									});

									puckForm.onSaved.attach(function(sender, puck){
										_this.load(_this.shipment);
										window.close();
									});
									var window = Ext.create('Ext.window.Window', {
										    title: 'Edit Puck',
										    height: 700,
										    width: Ext.getBody().getWidth() - 100,
										    modal : true,
										    resizable : true,
										    layout: 'fit',
										    items: puckForm.getPanel()
										}).show();

									if (containerId != null){
										var onSuccess = function(sender, puck){
											puckForm.load(puck);
										};
										EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(containerId,containerId,containerId);
									}

								}
								
							}
							
							
							if (e.target.defaultValue == 'Add Solution') {
								_this.openStockSolutionWindow(e.target.id);
							}
							
							if (e.target.defaultValue == 'Add Puck') {
								_this.addPuckToDewar(e.target.id);
							}
							

							if (e.target.defaultValue == 'Unpack') {
								if (e.target.name == "stockSolution"){
									var stockSolution = EXI.proposalManager.getStockSolutionById(e.target.id);
									stockSolution.boxId = null;
									_this.saveStockSolution(stockSolution);
								}
							}
							
							if (e.target.defaultValue == 'Remove') {
								var puckId = Number(e.target.id);
								if (e.target.name == "puck"){
									function showResult(result){
											if (result == "yes"){
												_this.removePuck(puckId);
											}
									}
									  Ext.MessageBox.show({
								           title:'Save Changes?',
								           msg: 'Removing a puck from this parcel will remove also its content. <br />Are you sure you want to continue?',
								           buttons: Ext.MessageBox.YESNOCANCEL,
								           fn: showResult,
								           animateTarget: 'mb4',
								           icon: Ext.MessageBox.QUESTION
								       });
									  
								}
							}
					}
				}
		},
		selModel : {
			mode : 'SINGLE'
		}
	});

	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		items : _this._getTopButtons(),
		cls : 'exi-top-bar'
	});

	return this.panel;
};
