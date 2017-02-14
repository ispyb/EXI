<div id="{id}-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Send shipment to ESRF</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="{id}-modal-body" class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">Tracking #:</label>
            <input type="text" class="form-control" id="{id}-tracking-number">
          </div>
          <div class="form-group">
            <label for="recipient-name" class="form-control-label">Expected arrival date:</label>
            <div class='input-group date'>
                <input id='{id}-date' type='text' class="form-control" />
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="{id}-save" type="button" class="btn btn-primary" >Save</button>
      </div>
    </div>
  </div>
</div>