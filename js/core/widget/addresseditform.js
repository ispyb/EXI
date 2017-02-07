function AddressEditForm (args) {
    this.id = BUI.id();
    this.height = 450;
	this.width = 740;
    this.padding = 10


	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

    this.onSaved = new Event(this);
}

AddressEditForm.prototype.load = function(address) {
    this.address = {};
    if (address) {
        this.address = address;
    }
    this.address.id = this.id;

	var html = "";
	dust.render("address.edit.form.template", this.address, function(err, out){
		html = out;
	});
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

AddressEditForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
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

AddressEditForm.prototype.save = function() {
    var _this = this;
	var address = this.getAddress();
    var onSuccess = function (sender,addressSaved) {
        _this.onSaved.notify(address);
    }
    
    EXI.getDataAdapter({onSuccess : onSuccess}).proposal.labcontacts.saveLabContact(address);
};

AddressEditForm.prototype.getAddress = function () {
    var address = {};
    address = this.address;
    if (!address.labContactId){
        address.labContactId = null;
    }
    if (!address.personVO) {
        address.personVO = {};
        address.personVO.personId = null;
    }
    if (!address.personVO.laboratoryVO){
        address.personVO.laboratoryVO = {};
        address.personVO.laboratoryVO.laboratoryId = null;
    }
    address.personVO.emailAddress = $("#" + this.id + "-emailAddress").val();
    address.personVO.familyName = $("#" + this.id + "-familyName").val();
    address.personVO.givenName = $("#" + this.id + "-givenName").val();
    address.personVO.phoneNumber = $("#" + this.id + "-phoneNumber").val();
    address.personVO.faxNumber = $("#" + this.id + "-faxNumber").val();
    address.personVO.laboratoryVO.name = $("#" + this.id + "-labName").val();
    address.personVO.laboratoryVO.address = $("#" + this.id + "-labAddress").val();
    address.cardName = $("#" + this.id + "-cardName").val();
    address.courierAccount = $("#" + this.id + "-courierAccount").val();
    address.defaultCourrierCompany = $("#" + this.id + "-defaultCourrierCompany").val();
    address.dewarAvgCustomsValue = $("#" + this.id + "-dewarAvgCustomsValue").val();
    address.dewarAvgTransportValue = $("#" + this.id + "-dewarAvgTransportValue").val();
    address.billingReference = $("#" + this.id + "-billingReference").val();
    address.labName = $("#" + this.id + "-labName").val();
    address.labAddress = $("#" + this.id + "-labAddress").val();
    
    return address;
}