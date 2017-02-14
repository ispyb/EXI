<div class="container-fluid" style="padding-left: 0px;padding-right: 0px;">
    <div class="panel with-nav-tabs panel-default" style="margin-bottom: 0px;">
        <div class="panel-heading clearfix">
            <div class="pull-right">
                <ul class="nav nav-tabs" id="myTabs">
                    <li class="active"><a data-toggle="tab" href="#information-{id}">Information</a></li>
                    <li><a data-toggle="tab" href="#transport-history-{id}">Transport history</a></li>            
                </ul>
            </div>
        </div>
        <div class="tab-content">
            <div id="information-{id}" class="tab-pane fade in active" style="padding:10px;">
                {>"shipping.form.information.template"  /}  
            </div>
            <div id="transport-history-{id}" class="tab-pane fade" style="padding:10px;">
            </div>
        </div>
    </div>
</div>