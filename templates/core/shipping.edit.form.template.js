<div style="padding:20px;">
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Name:</label>
        <div class="col-md-10">
            <input id="{id}-name" class="form-control" type="text" value="{shipment.shippingName}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Session:</label>
        <div class="col-md-10">
            <select id="{id}-date" class="form-control">
                <option> </option>
                {#sessions}
                <option value={.sessionId} {@eq key="{.date}" value="{startDate}"}{@eq key="{.beamLineName}" value="{beamlineName}"}selected{/eq}{/eq}>{.beamLineName}, {.date}</option>
                {/sessions}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Comments:</label>
        <div class="col-md-10">
            <textarea id="{id}-comments" class="form-control" rows="3">{shipment.comments}</textarea>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">To:</label>
        <div class="col-md-10">
            <select id="{id}-to" class="form-control">
                {#to}
                <option value={.labContactId} {@eq key="{.cardName}" value="{shipment.sendingLabContactVO.cardName}"}selected{/eq}>{.cardName}</option>
                {/to}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">From:</label>
        <div class="col-md-10">
            <select id="{id}-from" class="form-control">
                {#from}
                <option value={.labContactId} {@eq key="{.cardName}" value="{shipment.returnLabContactVO.cardName}"}selected{/eq}>{.cardName}</option>
                {/from}
            </select>
        </div>
    </div>
</div>