
 
<div class="container-fluid">
   <div class="row">
      <div class="col-xs-6 col-md-1">
         #{.DataCollection_dataCollectionNumber} {.DataCollectionGroup_experimentType} 
         <br />
         {@formatDate date=DataCollectionGroup_startTime format="YYYY-MM-DD HH:mm:ss" /}
      </div>
      <div class="col-xs-6 col-md-1">
         <table class='table-sm table-condensed '>
            <tbody>
               <tr>
                  <td >Protein</td>
                  <td  class='column_parameter_value'>{.Protein_acronym}</td>
               </tr>
               <tr>
                  <td >Prefix</td>
                  <td ><a href='#/mx/datacollection/datacollectionid/{.DataCollection_dataCollectionId}/main'>{.DataCollection_imagePrefix}</a></td>
               </tr>
               <tr>
                  <td >Images</td>
                  <td  class='column_parameter_value'>{.totalNumberOfImages}</td>
               </tr>
            </tbody>
         </table>
      </div>
      <div class="col-xs-6 col-md-2">
         <table class='table-sm table-condensed'>
            <thead>
               <tr>
                  <th  colspan=2 style='padding:0 15px 0 15px;'></th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Type</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.DataCollectionGroup_experimentType}</td>
               </tr>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Res. (corner)</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{@decimal key="DataCollection_resolution" decimals=2}{/decimal} &#8491; ({@decimal key="DataCollection_resolutionAtCorner" decimals=2}{/decimal} &#8491;)</td>
               </tr>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Wavelength</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{@decimal key="DataCollection_wavelength" decimals=4}{/decimal} &#8491;</td>
               </tr>
            </tbody>
         </table>
      </div>
      <div class="col-xs-1 col-md-1">
        <a href="{.indicator}" data-lightbox='{.indicator}' data-title="#{.runNumber} {.folder}"> 
                <img alt="Image not found" class="lazy"  src="{.indicator}" style='height:60px;width:60px;margin-right:10px;'/>
        </a>
        {@gt key=resultsCount   value="0"}
                <a id="{.DataCollection_dataCollectionId}-download-results-anchor" class="btn btn-xs">
                        <span id="{.DataCollection_dataCollectionId}-download-results" class="glyphicon glyphicon-download download-results"></span>
                </a>
        {/gt}
      </div>
      <div class="col-xs-6 col-md-2">
         {#.onlineresults[0]}       
            {>"sm.completeness.autoproc.mxdatacollectiongrid.summary.template"  /}
         {:else}
             {#.screeningresults[0]}
             {>"sm.characterisation.result.mxdatacollectiongrid.template"  /}
             {/.screeningresults[0]}
         {/.onlineresults[0]}                           
      </div>
      <div class="col-xs-12 col-md-2">
         {#.onlineresults[0]}       
         {>"unitcell.autoproc.mxdatacollectiongrid.template"  /}       
         {:else}
         {#.indexingresults[0]}
         {>"unitcell.characterisation.mxdatacollectiongrid.template"  /}
         {/.indexingresults[0]}
         {/.onlineresults[0]}                           
      </div>
      <div class="col-sm-2 col-md-1 " style='margin: 0 10px 10px 0;'>
         {#.autoprocessing}
         {@gt key=items.length value=0}  
         {#.}
         <table class='table-sm table-condensed'>
            {#.items}
            <tr>
               {@eq key=status value="Success"}
               <td> <span style='color:green;' class="glyphicon glyphicon-ok"></span></td>
               <td>{.name} </td>
               {/eq}
               {@ne key=status value="Success"} 
               <td> <span style='color:red;' class="glyphicon glyphicon-remove"></span></td>
               <td>{.name} </td>
               {/ne}
            </tr>
            {/.items}
         </table>
         {/.} 
         {/gt}
         {/.autoprocessing}
      </div>
      <div class="col-sm-2 col-md-1 " style='margin: 0 10px 10px 0;'>
         {#.screening}
         {@gt key=items.length value=0}  
         {#.}
         <table class='table-sm table-condensed'>
            {#.items}
            <tr>
               {@eq key=status value="Success"}
               <td> <span style='color:green;' class="glyphicon glyphicon-ok"></span></td>
               <td>{.name} </td>
               {/eq}
               {@ne key=status value="Success"} 
               <td> <span style='color:red;' class="glyphicon glyphicon-remove"></span></td>
               <td>{.name} </td>
               {/ne}
            </tr>
            {/.items}
         </table>
         {/.} 
         {/gt}
         {/.screening}
      </div>
      <div class="col-xs-6 col-md-1">
        {@gt key=resultsCount   value="0"}
                <a href='#/autoprocintegration/datacollection/{.DataCollection_dataCollectionId}/main' target="_blank" class="btn btn-xs">
                        <span id="{.DataCollection_dataCollectionId}-autoproc-link" class="glyphicon glyphicon-eye-open autoproc-link"> Autoprocessing</span>
                </a>
        {/gt}
      </div>
      <div class="col-md-1">
        {@gt key=hasPhasing   value="0"}
                <a href='#/mx/datacollectiongroup/{DataCollectionGroup_dataCollectionGroupId}/step/SAD/main' target="_blank" class="btn btn-xs" >
                        <span id="{.DataCollection_dataCollectionId}-phasing-link" class="glyphicon glyphicon-eye-open"> SAD</span>
                </a>
        {/gt}
        {@gt key=hasMR   value="0"}
                <a href='#/mx/datacollectiongroup/{DataCollectionGroup_dataCollectionGroupId}/step/MR/main' target="_blank" class="btn btn-xs" >
                        <span id="{.DataCollection_dataCollectionId}-phasing-link" class="glyphicon glyphicon-eye-open"> MR</span>
                </a>
        {/gt}
      </div>
   </div>
</div>