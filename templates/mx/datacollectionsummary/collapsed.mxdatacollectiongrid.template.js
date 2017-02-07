<div class="container-fluid">
   <div class="row">
      <div class="col-xs-6 col-md-1">
         #{.DataCollection_dataCollectionNumber} {.DataCollectionGroup_experimentType} 
         <br />
         {@formatDate date=DataCollectionGroup_startTime format="DD-MM-YYYY hh:mm:ss" /}
      </div>
      <div class="col-xs-6 col-md-2">
         <table class='table-sm table-condensed '>
            <thead>
               <tr>
                  <th  colspan=2 style='padding:0 15px 0 15px;'> </th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Protein</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.Protein_acronym}</td>
               </tr>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Prefix</td>
                  <td  style='padding:0 15px 0 15px;'><a href='#/mx/datacollection/datacollectionid/{.DataCollection_dataCollectionId}/main'>{.DataCollection_imagePrefix}</a></td>
               </tr>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Images</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.totalNumberOfImages}</td>
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
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.DataCollection_resolution} &#8491; ({.DataCollection_resolutionAtCorner} &#8491;)</td>
               </tr>
               <tr>
                  <td  style='padding:0 15px 0 15px;'>Wavelenth</td>
                  <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.DataCollection_wavelength} &#8491;</td>
               </tr>
            </tbody>
         </table>
      </div>
      <div class="col-xs-1 col-md-1"> 
         <a href="{.indicator}" data-lightbox='{.indicator}' data-title="#{.runNumber} {.folder}"> 
            <img alt="Image not found" class="img-responsive lazy"  src="{.indicator}" 
                 style='height:60px;width:60px'/>
         </a> 
      </div>
      <div class="col-xs-6 col-md-2">
         {#.onlineresults[0]}       
            {>"sm.completeness.autoproc.mxdatacollectiongrid.template"  /}
         {/.onlineresults[0]}                           
      </div>
      <div class="col-xs-12 col-md-2">
         {#.onlineresults[0]}       
         {>"unitcell.autoproc.mxdatacollectiongrid.template"  /}       
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
      
      
      
      
        
      
      
                
   </div>
</div>