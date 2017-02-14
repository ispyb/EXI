<div class="form-group row" style="margin:0px">
    <div class="col-md-2" style="padding:0px">
        <div class="form-group row" style="margin:5px">
            <label class="col-md-7 col-form-label" ><b>Creation date:</b></label>
            <label class="col-md-5" style="font-weight: normal">{@formatDate date=shipment.creationDate format="DD-MM-YYYY" /}</label>
        </div>
        <div class="form-group row" style="margin:5px">
            <label class="col-md-7 col-form-label" ><b>Sending date:</b></label>
            <label class="col-md-5" style="font-weight: normal">{@formatDate date=shipment.dateOfShippingToUser format="DD-MM-YYYY" /}</label>
        </div>
        <div class="form-group row" style="margin:5px">
            <label class="col-md-7 col-form-label" ><b>Expected arrival date:</b></label>
            <label class="col-md-5" style="font-weight: normal">{@formatDate date=shipment.deliveryAgentDeliveryDate format="DD-MM-YYYY" /}</label>
        </div>
        <div class="form-group row" style="margin:5px">
            <label class="col-md-7 col-form-label" ><b>Return date:</b></label>
            <label class="col-md-5" style="font-weight: normal"></label>
        </div>
    </div>
    <div class="col-md-3 pull-right" style="padding:0px">
        <label class="col-md-4 col-form-label">Select Dewars:</label>
        <div class="col-md-8">
            <select id="{id}-dewars" multiple="multiple">
                {#shipment.dewarVOs}
                    <option value="{.dewarId}" selected>{.code}</option>
                {/shipment.dewarVOs}
            </select>
        </div>
    </div>
</div>
<div class="form-group row" style="margin:0px">
    <div id="{id}-tracking-grid" class="col-md-12" style="padding:0px">
    </div>
</div>