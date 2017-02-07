<div class="container-fluid" style="padding:0px;">
    <div class="panel with-nav-tabs panel-default" style="margin-bottom: 0px;">
        <div class="panel-heading clearfix">
            <div class="pull-left">
                <span id="{id}-label" style='font-size:15px;color:black;font-weight:700' >
                    Content (0 Parcels)
                </span>
                <button id="{id}-add-button" type="button" style="margin-left:15px;" class="btn btn-default disabled">
                    <span class="glyphicon glyphicon-plus-sign"></span> Add
                </button>
            </div>
            <div class="pull-right">
                <ul class="nav nav-tabs" id="{id}-tabs">
                    <li class="active"><a data-toggle="tab" href="#{id}-content">Content</a></li>
                    {!<li><a data-toggle="tab" href="##{id}-statistics">Statistics</a></li>!}       
                </ul>
            </div>
        </div>
        <div class="tab-content">
             <div id="{id}-content" class="tab-pane fade in active">
                
            </div>
            <div id="{id}-statistics" class="tab-pane fade">
            </div>
        </div>
    </div>
</div>