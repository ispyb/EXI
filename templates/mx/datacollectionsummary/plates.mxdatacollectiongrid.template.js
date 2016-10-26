<div class="container-fluid">
   <div class="row">
   {?containerIds}
    {#containerIds}
        <div class="col-xs-6 col-md-{@math key="12" method="divide" operand="{$len}" style="padding:3cm"/}">
            <div id="puck-panel-{.}">
                There were no containers found
            </div>
            <div id="puck-panel-{.}-info">
                
            </div>
        </div>
    {/containerIds}
    {:else}
        <p><b>There were no containers found</b></p>
    {/containerIds}
   </div>
</div>