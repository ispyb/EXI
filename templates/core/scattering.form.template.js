<div id="{id}-form" style="padding:20px;">
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Title:</label>
        <label class="col-md-8">{title}</label>
    </div>
    <div id="{id}-dates" class="form-group row">
        <label class="col-md-2"><b>Date:</b></label>
        <div class="col-md-10">
            <div class='input-group date' id="{id}-datepicker">
                <input id="{id}-date" type='text' class="form-control" />
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Type:</label>
        <div class="col-md-10">
            <select id="{id}-type" class="form-control">
                {#types}
                <option value={.value}>{.display}</option>
                {/types}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Beamline:</label>
        <div class="col-md-10">
            <select id="{id}-beamline" class="form-control">
                <option></option>
                {#beamlines}
                <option value={.name}>{.name}</option>
                {/beamlines}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <div id="{id}-checkox-div" class="container-fluid scattering-plot-checkboxes">
            {#chunkedKeys}
                {#.}
                    <div class="col-md-4">
                        <label><input class="scattering-checkbox" type="checkbox" value="{.}"> {.}</label>
                    </div>
                {/.}
            {/chunkedKeys}
        </div>
    </div>
</div>