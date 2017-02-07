/**
 * Edit the information of a buffer
 * 
 * #onRemoveAdditive
 */
function AddressForm(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;


	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
}

AddressForm.prototype.getAddress = function() {
	if (this.address == null) {
		this.address = {};
	}
	this.address["billingReference"] = Ext.getCmp(this.id + "billingReference").getValue();
	this.address["cardName"] = Ext.getCmp(this.id + "cardName").getValue();
	this.address["courierAccount"] = Ext.getCmp(this.id + "courierAccount").getValue();
	this.address["defaultCourrierCompany"] = Ext.getCmp(this.id + "courrierCompany").getValue();
	this.address["dewarAvgCustomsValue"] = Ext.getCmp(this.id + "dewarAvgCustomsValue").getValue();
	this.address["dewarAvgTransportValue"] = Ext.getCmp(this.id + "dewarAvgTransportValue").getValue();

	if (this.address.personVO == null) {
		this.address.personVO = {};
	}
	else{
		
	}

	this.address.personVO["emailAddress"] = Ext.getCmp(this.id + "emailAddress").getValue();
	this.address.personVO["familyName"] = Ext.getCmp(this.id + "familyName").getValue();
	this.address.personVO["givenName"] = Ext.getCmp(this.id + "name").getValue();
	this.address.personVO["faxNumber"] = Ext.getCmp(this.id + "faxNumber").getValue();
	this.address.personVO["phoneNumber"] = Ext.getCmp(this.id + "phoneNumber").getValue();
	return this.address;
};

AddressForm.prototype.load = function(address) {
	this.address = address;
	
	var html = "";
	dust.render("address.form.template", address, function(err, out){
		html = out;
	});
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

AddressForm.prototype.getPanel = function() {
	var _this = this;

	this.panel = Ext.create("Ext.panel.Panel",{
		cls : "border-grid",
		title : 'Shipping Address Card',
		buttons : this.getToolBar(),
		icon : '../images/icon/ic_email_black_24dp.png',
		items :	[{
					// cls	: 'border-grid',
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
};

AddressForm.prototype.getToolBar = function() {
	var _this = this;
	return [ {
		text : 'Edit',
		hidden : _this.isSaveButtonHidden,
		width : 100,
		handler : function() {
			_this.edit();

		} } ];
};

AddressForm.prototype.edit = function(dewar) {
	var _this = this;
	var addressEditForm = new AddressEditForm();
	
	addressEditForm.onSaved.attach(function (sender, address) {
		window.close();
		_this.load(address);
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Shipping Address Card',
		height: 550,
		width: 750,
		modal : true,
		layout : 'fit',
		items : [ addressEditForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					addressEditForm.save();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					window.close();
				}
			} ]
	}).show();

	addressEditForm.load(this.address);
};
