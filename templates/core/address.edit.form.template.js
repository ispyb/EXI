<div class="container-fluid" style="padding:10px;">
    <div class="form-group row">
        <label class="col-md-1"><b>Name:</b></label>
        <div class="col-md-5">
            <input id="{id}-givenName" class="form-control" type="text" value="{personVO.givenName}">
        </div>
        <label class="col-md-1"><b>Surname:</b></label>
        <div class="col-md-5">
            <input id="{id}-familyName" class="form-control" type="text" value="{personVO.familyName}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Email:</b></label>
        <div class="col-md-3">
            <input id="{id}-emailAddress" class="form-control" type="text" value="{personVO.emailAddress}">
        </div>
        <label class="col-md-1"><b>Phone:</b></label>
        <div class="col-md-3">
            <input id="{id}-phoneNumber" class="form-control" type="text" value="{personVO.phoneNumber}">
        </div>
        <label class="col-md-1"><b>Fax:</b></label>
        <div class="col-md-3">
            <input id="{id}-faxNumber" class="form-control" type="text" value="{personVO.faxNumber}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Card Name:</b></label>
        <div class="col-md-11">
            <input id="{id}-cardName" class="form-control" type="text" value="{cardName}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Courier Account:</b></label>
        <div class="col-md-5">
            <input id="{id}-courierAccount" class="form-control" type="text" value="{courierAccount}">
        </div>
        <label class="col-md-1"><b>Courier Company:</b></label>
        <div class="col-md-5">
            <input id="{id}-defaultCourrierCompany" class="form-control" type="text" value="{defaultCourrierCompany}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Avg Customs Value:</b></label>
        <div class="col-md-3">
            <input id="{id}-dewarAvgCustomsValue" class="form-control" type="text" value="{dewarAvgCustomsValue}">
        </div>
        <label class="col-md-1"><b>Avg Transport Value:</b></label>
        <div class="col-md-3">
            <input id="{id}-dewarAvgTransportValue" class="form-control" type="text" value="{dewarAvgTransportValue}">
        </div>
        <label class="col-md-1"><b>Billing Reference:</b></label>
        <div class="col-md-3">
            <input id="{id}-billingReference" class="form-control" type="text" value="{billingReference}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Lab Name:</b></label>
        <div class="col-md-11">
            <input id="{id}-labName" class="form-control" type="text" value="{personVO.laboratoryVO.name}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-1"><b>Lab Address:</b></label>
        <div class="col-md-11">
            <textarea id="{id}-labAddress" class="form-control" rows="3">{personVO.laboratoryVO.address}</textarea>
        </div>
    </div>
</div>