<div id="{id}-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title" id="{id}-title"></h4>
      </div>
      <div class="modal-body">
        <div id="{id}-plot" style="margin:20px">
          <div class="container-fluid">
            <div class="row" style='height:600px;'>
                  <div class="col-xs-12 col-md-12" id="__mr_{.DataCollection_dataCollectionGroupId}">
                          <img style='display:block;margin-left: auto;margin-right: auto;height:150px;width:150px;'src='../images/loading-animation.gif' />                                           
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="{id}-close" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>