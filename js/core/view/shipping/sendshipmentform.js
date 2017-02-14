function SendShipmentForm(args) {
    this.id = BUI.id();

    this.onSend = new Event(this);
}

SendShipmentForm.prototype.show = function(){
    var _this = this;
    
    var html = "";
    dust.render("send.shipment.form.template", {id : this.id, shipment : this.shipment}, function(err,out){
        html = out;
    });

    $("body").append(html);
    
    $("#" + this.id + "-modal").modal();
    $("#" + this.id + "-modal").on('hidden.bs.modal', function(){
        $(this).remove();
    });

    $("#" + this.id + "-save").unbind('click').click(function(sender){
        _this.save();
    });

    var today = new Date();
    $("#" + this.id + "-date").datetimepicker({
        defaultDate: today,
        format: "DD-MM-YYYY",
    });

};

SendShipmentForm.prototype.load = function (shipment) {
    this.shipment = shipment;
}

SendShipmentForm.prototype.save = function(){
    var _this = this;
    var trackingNumber = $("#" + this.id + "-tracking-number").val();
    var date = moment($("#" + this.id + "-date").val(),"DD-MM-YYYY");

    if (trackingNumber != "" && date.toDate() != "Invalid date") {
        for (var i = 0 ; i < this.shipment.dewarVOs.length ; i++) {
            this.shipment.dewarVOs[i].trackingNumberToSynchrotron = trackingNumber;
        }
        this.shipment.deliveryAgentShippingDate = moment().toDate();
        this.shipment.deliveryAgentDeliveryDate = date.toDate();
        this.shipment.shippingStatus = "sent to ESRF";
        var onSuccess = function (sender) {
            _this.onSend.notify();
            $("#" + _this.id + "-modal").modal('hide');
        }
        EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.saveShipment(this.shipment);
    } else {
        $("#" + this.id + "-modal-body").notify("Fill the required fields.",{ className : "error"});
    }
}