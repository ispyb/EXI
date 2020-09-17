<table>
   <tr>
      <td>
         <div id="{.uniquenessParcelPanelId}" class="alert alert-info" style="margin-bottom: 1px;  line-height:20px;  padding:0px 5px 0px 10px;display:inline-block;margin:5px;" role="alert">            
            Parcel Name should be unique for the whole shipment 
         </div>
      </td>
      <td>
         <div id="{.acceptedContainerListPanelId}" class="alert alert-info" style="margin-bottom: 1px;height: 20px;  line-height:20px;  padding:0px 5px 0px 10px;display:inline-block;margin:5px;" role="alert">
         {@eq key=showOnlyUnipuckMessage value="true" type="boolean"}
            Accepted values for container type are: SPINEpuck, Unipuck
         {:else}
            Only Unipuck container type at MAX IV
         {/eq}
         </div>
      </td>
      <td>
         <div id="{.uniquenessContainerNamelPanelId}" class="alert alert-info" style="margin-bottom: 1px;height: 20px;  line-height:20px;  padding:0px 5px 0px 10px;display:inline-block;margin:5px;" role="alert">            
            Container name should be unique for this shipment
         </div>
      </td>
      <td>
         <div id="{.uniquenessSampleNamePanelId}" class="alert alert-info" style="margin-bottom: 1px;height: 20px;  line-height:20px;  padding:0px 5px 0px 10px;display:inline-block;margin:5px;" role="alert">            
            Protein + sample name should be unique for the whole proposal
         </div>
      </td>
   </tr>
    <tr style='height:35px;'>
      <td>
       
      </td>
      <td>
       
      </td>
      <td>
       
      </td>
      <td>
       
      </td>
   </tr>
</table>