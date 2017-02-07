<div class="container-fluid" style="padding:10px;">
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Name:</b></label>
        <label class="col-md-3" style="font-weight: normal">{personVO.givenName}</label>
        <label class="col-md-1"><b>Surname:</b></label>
        <label class="col-md-3" style="font-weight: normal">{personVO.familyName}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Email:</b></label>
        <label class="col-md-3" style="font-weight: normal">{personVO.emailAddress}</label>
        <label class="col-md-1"><b>Phone:</b></label>
        <label class="col-md-3" style="font-weight: normal">{personVO.phoneNumber}</label>
        <label class="col-md-1"><b>Fax:</b></label>
        <label class="col-md-3" style="font-weight: normal">{personVO.faxNumber}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Card Name:</b></label>
        <label class="col-md-6" style="font-weight: normal">{cardName}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Courier Account:</b></label>
        <label class="col-md-3" style="font-weight: normal">{courierAccount}</label>
        <label class="col-md-1"><b>Courier Company:</b></label>
        <label class="col-md-3" style="font-weight: normal">{defaultCourrierCompany}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Avg Customs Value:</b></label>
        <label class="col-md-3" style="font-weight: normal">{dewarAvgCustomsValue}</label>
        <label class="col-md-1"><b>Avg Transport Value:</b></label>
        <label class="col-md-3" style="font-weight: normal">{dewarAvgTransportValue}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Billing Reference:</b></label>
        <label class="col-md-6" style="font-weight: normal">{billingReference}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Lab Name:</b></label>
        <label class="col-md-6" style="font-weight: normal">{personVO.laboratoryVO.name}</label>
    </div>
    <div class="form-group row" style="margin:0px">
        <label class="col-md-1"><b>Lab Address:</b></label>
        <textarea  class="col-md-3" style="overflow:hidden;" rows="3" disabled>{personVO.laboratoryVO.address}</textarea >
    </div>
</div>