<div id="{id}-form" style="padding:20px;">
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Title:</label>
        <label class="col-md-8">{title}</label>
    </div>
    <div class="form-group row">
        <label class="col-md-2"><b>Start:</b></label>
        <div class="col-md-4">
            <input id="{id}-startDate" class="form-control" type="date">
        </div>
        <label class="col-md-2"><b>End:</b></label>
        <div class="col-md-4">
            <input id="{id}-endDate" class="form-control" type="date">
        </div>
    </div>
    <div class="form-group row">
        {#chunkedKeys}
            {#.}
                <div class="col-md-4">
                    <label><input class="scattering-checkbox" type="checkbox" value="{.}"> {.}</label>
                </div>
            {/.}
        {/chunkedKeys}
    </div>
</div>