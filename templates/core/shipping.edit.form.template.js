<div style="padding:20px;">
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Name:</label>
        <div class="col-md-10">
            <input id="{id}-name" class="form-control" type="text" value="{shipment.shippingName}">
            {@eq key="{.showRegEx}" value="true"}
            <span>The name needs to have the following format {.proposal}-YYYYMMDD-[something]</span>
            {/eq}
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Session:</label>
        <div class="col-md-10">
            <select id="{id}-date" class="form-control">
                <option> </option>
                {#sessions}
                <option value={.sessionId} {@eq key="{.date}" value="{startDate}"}{@eq key="{.beamLineName}" value="{beamlineName}"}selected{/eq}{/eq}>{.formattedDate}, {.beamLineName}</option>
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
        <label class="col-md-2 col-form-label">From:</label>
        <div class="col-md-10">
            <select id="{id}-to" class="form-control">
                {#from}
                <option value={.labContactId} {@eq key="{.cardName}" value="{shipment.sendingLabContactVO.cardName}"}selected{/eq}>{.cardName}</option>
                {/from}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Return address:</label>
        <div class="col-md-10">
            <select id="{id}-from" class="form-control">
                {#to}
                <option value={.labContactId} {@eq key="{.cardName}" value="{shipment.returnLabContactVO.cardName}"}selected{/eq}>{.cardName}</option>
                {/to}
            </select>
        </div>
    </div>
</div>

{@eq key="{.showRegEx}" value="true"}
<script>
    var pattern = "^{.proposal}-(19|20)\\d\\d(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])-[a-zA-Z-]*";
    var validate_name = function(name){
        alert("Validate " +name);
        var is_name_valid = false;
        alert("patter is " +pattern);
        if(name.match(pattern) != null){
            is_name_valid = true;
        }
        return is_name_valid;
    };

    $("#{id}-name").on("focusout", function(){
        var input_val = $(this).val();
        alert(input_val);
        var is_success = validate_name(input_val);
        if(!is_success){
            $("#{id}-name").focus();
            alert("Error in the name!");
        }
    });
</script>
{/eq}
