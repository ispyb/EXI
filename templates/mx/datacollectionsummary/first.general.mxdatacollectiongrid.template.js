<table class="table">
   <tr>
      <td  >Workflow</td>
      <td class='column_parameter_value'>
         {@eq key=Workflow_status value="Success"}
         <div class='summary_datacollection_success'></div>
         {/eq}
         {@eq key=Workflow_status value="Failure"}
         <div class='summary_datacollection_failed'></div>
         {/eq}
         {.Workflow_workflowType}
      </td>
   </tr>
   <tr>
      <td>Protein</td>
      <td class='column_parameter_value'>{.Protein_acronym}</td>
   </tr>
   <tr>
      <td>Sample</td>
      <td class='column_parameter_value'>{.BLSample_name}</td>
   </tr>
   <tr>
      <td>Prefix</td>
      <td class='column_parameter_value'>{.DataCollection_imagePrefix}</td>
   </tr>
   <tr>
      <td>Images</td>
      <td class='column_parameter_value'>{.totalNumberOfImages}</td>
   </tr>
   <tr>
      <td>Transmission</td>
      <td class='column_parameter_value'>{@decimal key="transmission" decimals=1 /} %</td>
   </tr>
   <tr>
      <td>Flux start</td>
      <td class='column_parameter_value'>{.DataCollection_flux} ph/sec</td>
   </tr>
</table>

