<div id="{id}-modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div id="{id}-form" style="padding:20px;">
            <div class="form-group row">
                <label class="col-md-2 col-form-label">Title:</label>
                <label class="col-md-8">{title}</label>
            </div>
            <div id="{id}-dates" class="form-group row">
                <label class="col-md-2"><b>Start date:</b></label>
                <div class="col-md-10">
                    <div class='input-group date' id="{id}-start-datepicker">
                        <input id="{id}-start-date" type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
                <label class="col-md-2"><b>End date:</b></label>
                <div class="col-md-10">
                    <div class='input-group date' id="{id}-end-datepicker">
                        <input id="{id}-end-date" type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">Proposals to exclude (comma separated):</label>
                <div class="col-md-10">
                   <input id="{id}-proposals" type='text' class="form-control" />
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
                                <label><input class="experiments-checkbox" type="checkbox" value="{.}"> {.}</label>
                            </div>
                        {/.}
                    {/chunkedKeys}
                </div>
            </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="{id}-close" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="{id}-download" type="button" class="btn btn-primary">Download</button>
        <button id="{id}-plot" type="button" class="btn btn-primary">Plot</button>
      </div>
    </div>
  </div>
</div>




