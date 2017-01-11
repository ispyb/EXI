<div style="padding:10px;">
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

        <div class="col-md-10">
            <div class="col-md-3" style="padding:0px">
                <div class="form-group row" style="margin:5px">
                    <label class="col-md-3 col-form-label" style="font-weight:100;"><b>To:</b></label>
                    <label class="col-md-8">{shipment.sendingLabContactVO.cardName}</label>
                </div>
                <div class="form-group row" style="margin:5px">
                    <label class="col-md-3 col-form-label" style="font-weight:100;"><b>From:</b></label>
                    <label class="col-md-8">{shipment.returnLabContactVO.cardName}</label>
                </div>
            </div>

            <div class="col-md-8" style="padding:0px">
                <label class="col-md-2 col-form-label " style="font-weight:100;"><b>Comments:</b></label>
                <textarea  class="col-md-10" rows="3" disabled>{shipment.comments}</textarea >
            </div>

            <div class="form-group col-md-1" style="margin:0px">
                <button id="{id}-edit-button" class="btn btn-primary btn-lg" style="margin-right:10px;height:50px;" disabled>Edit</button>
            </div>
        </div>
    </div>
</div>