<div class="container" style="margin-top: 0px;">
    <div class="row">
        <div class="col-lg-6 col-sm-6 col-12">                  
            <div class="input-group">
                <label class="input-group-btn"> 
                    <span class="btn btn-primary">
                        Browse&hellip;   <input type="file" id="{.id}"  style='display:none' name="files[]"  class="file"  disabled="true" />
                    </span>
                </label>               
                <input id='box_{.id}' type="text" class="form-control" readonly value=''>                               
                
            </div>    

            <span class="help-block">
                <span class="glyphicons glyphicons-question-sign"></span> Do you need help? Click
                {@eq key=siteName value="MAXIV"}
                    <a target='_blank' href='https://www.maxiv.lu.se/accelerators-beamlines/beamlines/biomax/user-access/how-to-prepare-sample-shipments-with-exi-at-max-iv/'>here.</a>
                {:else}
                    <a target='_blank' href='https://github.com/ispyb/EXI/wiki/Fill-shipment-from-CSV'>here.</a>
                {/eq}
                Examples can be found here:
                {@eq key=siteName value="MAXIV"}
                    <a target='_blank' href='../csv/example3_MAXIV.csv'>
                {:else}
                    <a target='_blank' href='../csv/example3.csv'>
                {/eq}
                example.csv</a>
            </span>
            
        </div>           
    </div>
</div>
      
