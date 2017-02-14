<div class="form-group row" style="margin:0px">
    <div class="col-md-2" style="padding:0px">
        <table class="table small-padding-rows borderless" style="margin:0px">
            <tr>
                <td class='column_parameter_value'>Name:</td>
                <td>{shipment.shippingName}</td>
            </tr>
            <tr>
                <td class='column_parameter_value'>Beamline:</td>
                <td>{.beamlineName}</td>
            </tr>
            <tr>
                <td class='column_parameter_value'>Date:</td>
                <td>{.startDate}</td>
            </tr>
        </table> 
    </div>

    <div class="col-md-2" style="padding:0px">
        <div class="form-group row" style="margin:5px">
            <label class="col-md-3 col-form-label" ><b>From:</b></label>
            <label class="col-md-9" style="font-weight: normal">{shipment.sendingLabContactVO.cardName}</label>
        </div>
        <div class="form-group row" style="margin:5px">
            <label class="col-md-3 col-form-label" ><b>Return address:</b></label>
            <label class="col-md-9" style="font-weight: normal">{?shipment.returnLabContactVO}
                                        {shipment.returnLabContactVO.cardName}
                                    {:else}
                                        NO RETURN
                                    {/shipment.returnLabContactVO}
            </label>
        </div>
    </div>

    <div class="col-md-2" style="padding:0px">
        {?shipment.returnLabContactVO}
            <table class="table small-padding-rows borderless" style="margin:0px">
                <tr>
                    <td colspan="2" class='column_parameter_value'>Return details</td>
                </tr>
                <tr>
                    <td class='column_parameter_value'>Courier company:</td>
                    <td>{shipment.returnLabContactVO.defaultCourrierCompany}</td>
                </tr>
                <tr>
                    <td class='column_parameter_value'>Courier account:</td>
                    <td>{shipment.returnLabContactVO.courierAccount}</td>
                </tr>
                <tr>
                    <td class='column_parameter_value'>Billing reference:</td>
                    <td>{shipment.returnLabContactVO.billingReference}</td>
                </tr>
            </table>
        {/shipment.returnLabContactVO}
    </div>

    <div class="col-md-2" style="padding:0px">
        <div class="form-group row" style="margin:5px">
            <a id="{id}-send-button" class="btn btn-md disabled">
                <span class="glyphicon glyphicon-plane"></span> Send shipment to ESRF
            </a>
        </div>
        <div class="form-group row" style="margin:5px">
            <a id="{id}-remove-button" class="btn btn-md disabled">
                <span class="glyphicon glyphicon-remove" style="color:red"></span> Remove shipment
            </a>
        </div>
    </div>

    <div class="col-md-3" style="padding:0px">
        <div class="form-group row" style="margin:5px">
            <label class="col-md-3 col-form-label " ><b>Comments:</b></label>
            <textarea  class="col-md-9" rows="4" disabled>{shipment.comments}</textarea >
        </div>
    </div>

    <div class="col-md-1 pull-right" style="padding:0px">
        <button id="{id}-edit-button" class="btn btn-primary btn-lg" style="margin-left:10px;height:90px;" disabled>Edit</button>
    </div>
</div>