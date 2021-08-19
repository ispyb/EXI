<div class="form-group row" style="margin:0px">
   <div class="col-md-3" style="padding:0px">
      <table class="table">
         <tr>
            <td>Name</td>
            <td class='column_parameter_value'>{shipment.shippingName}</td>
         </tr>
         <tr>
            <td>Beamline</td>
            <td class='column_parameter_value'>{beamlineName}</td>
         </tr>
      </table>
   </div>
   <div class="col-md-2" style="margin-left:10px">
      <table class="table">
         <tr>
            <td>Date</td>
            <td class='column_parameter_value'>{startDate}</td>
         </tr>
         <tr>
            <td>Status</td>
            <td class='column_parameter_value'><kbd style='background-color:#207a7a;'>{.shipment.shippingStatus}</kbd></td>
         </tr>
      </table>
   </div>
    <div class="col-md-2" >
        <a id="{id}-send-button" class="btn btn-md enabled">
                <span class="glyphicon glyphicon-plane"></span>
                <button class="btn btn-primary btn-md" style="margin-left:10px;height:40px;" >{statusButtonLabel}</button>
        </a>
        {@eq key=hidePrintLabelWarning value="false" type="boolean" }
            <div class=" alert-warning" style="font-size:12px; margin-left:40px; width:200;">
                <strong><span class="glyphicon glyphicon-alert"></span> </strong><span  style="margin-left:10px">One of your labels is not printed</span>
            </div>
             
        {/eq}   
   </div>

   <div class="col-md-3" style="margin-left:10px">
      <div class="form-group row" style="margin:5px">
         <label class="col-md-3 col-form-label " ><b>Comments:</b></label>
         <textarea  class="col-md-9 disabled" rows="2" >{shipment.comments}</textarea >
      </div>
   </div>
   <div class="col-md-1" style="padding:0px">
      <div class="form-group row" style="margin:5px">
         <button id="{id}-edit-button" class="btn btn-primary btn-md disabled" style="margin-left:10px;height:40px;">Edit</button>
      </div>
   </div>
   <div class="col-md-1" style="padding:0px">
         <div class="form-group row" style="margin:5px">
            <button id="{id}-delete-button" class="btn btn-primary btn-md disabled" style="margin-left:10px;height:40px;">Delete</button>
         </div>
      </div>
</div>


<div class="form-group row">


   <div class="col-md-12" >
    {@gt key=nbReimbDewars value=0}
        <div class="alert alert-warning">
             According to the A-form, you are allowed to have <strong> {.nbReimbDewars}  parcels reimbursed by the ESRF</strong>. Please use the Reimburse button to select/unselect the parcels to be reimbursed. 
        </div>
    {/gt}
    </div>
</div>

<div class="form-group row">
   <div class="col-md-3" >
      <table class="table">
         <tr>
            <td>From</td>
            <td class='column_parameter_value'>{.shipment.sendingLabContactVO.cardName}</td>
         </tr>
         <tr>
            <td>Return address</td>
            <td class='column_parameter_value'>
                {?shipment.returnLabContactVO} 
                    {shipment.returnLabContactVO.cardName}
                {:else}
                    NO RETURN
                {/shipment.returnLabContactVO}            
            </td>
         </tr>
      </table>
   </div>

   <div class="col-md-2" style="margin-left:10px">
      <table class="table">
         <tr>
         <tr>
            <td>Courier company</td>
            <td class='column_parameter_value'>{.shipment.returnLabContactVO.defaultCourrierCompany}</td>
         </tr>
            <td>Billing Reference</td>
            <td class='column_parameter_value'>{.shipment.returnLabContactVO.billingReference}</td>
         </tr>
      </table> 
   </div>
 
   <div class="col-md-6" style="margin-left:10px">  
      <table class="table">
         <tr>
            <td>Allowed Reimb. parcels</td>
            <td class='column_parameter_value'>{.nbReimbDewars}</td>
         </tr>
         <tr>
            <td>Fedex Reference</td>
            <td class='column_parameter_value'>
                {?fedexCode} 
                    <kbd style="background-color:#207a7a;">{.fedexCode}</kbd>
                {/fedexCode} 
            </td>
         </tr>
      </table>
   </div>


</div>

{@ne key=warningProcessingLabel value=""}
<div class="form-group row">
   <div class="col-md-12" >
    <div class="alert alert-warning">
        {warningProcessingLabel}
    </div>
   </div>
</div>
{/ne}

{!

   <table class="table small-padding-rows borderless" style="margin:0px">
      <tr>
         <td class='column_parameter_value'>Name:</td>
         <td>{shipment.shippingName}</td>
      </tr>
      <tr>
         <td class='column_parameter_value'>Beamline:</td>
         <td>{.beamlineName}</td>
      </tr>
      <tr>
         <td class='column_parameter_value'>Date:</td>
         <td>{.startDate}</td>
      </tr>
      <tr>
         <td class='column_parameter_value'>Status:</td>
         <td><kbd style='background-color:#207a7a;'>{.shipment.shippingStatus}</kbd></td>
      </tr>
      <tr>
         <td class='column_parameter_value'>Reimb. parcels:</td>
         <td>{.nbReimbDewars}</td>
      </tr>
   </table>
</div>
<div class="col-md-2" style="padding:0px">
   <div class="form-group row" style="margin:5px">
      <a id="{id}-send-button" class="btn btn-md enabled">
      <span class="glyphicon glyphicon-plane"></span> Send shipment to ESRF
      </a>
   </div>
  
</div>
<div class="col-md-3" style="padding:0px">
   <div class="form-group row" style="margin:5px">
      <label class="col-md-3 col-form-label " ><b>Comments:</b></label>
      <textarea class="col-md-9 disabled" rows="4">{shipment.comments}</textarea >
   </div>
</div>
<div class="col-md-1 pull-right" style="padding:0px">
   <button id="{id}-edit-button" class="btn btn-primary btn-lg disabled" style="margin-left:10px;height:90px;">Edit</button>
</div>
</div>
<div class="panel panel-default">
   <div class="panel-body">
      <div class="col-md-2" style="padding:0px">
         <div class="form-group row" style="margin:5px">
            <label class="col-md-3 col-form-label" ><b>From:</b></label>
            <label class="col-md-9" style="font-weight: normal">{shipment.sendingLabContactVO.cardName}</label>
         </div>
         <div class="form-group row" style="margin:5px">
            <label class="col-md-3 col-form-label" ><b>Return address:</b></label>
            <label class="col-md-9" style="font-weight: normal">
            {?shipment.returnLabContactVO} 
            {shipment.returnLabContactVO.cardName}
            {:else}
            NO RETURN
            {/shipment.returnLabContactVO}
            </label>
         </div>
      </div>
      <div class="col-md-2" style="padding:0px">
         {?shipment.returnLabContactVO}
         <table class="table small-padding-rows borderless" style="margin:0px">
            <tr>
               <td colspan="2" class='column_parameter_value'>Return details</td>
            </tr>
            <tr>
               <td class='column_parameter_value'>Courier company:</td>
               <td>{shipment.returnLabContactVO.defaultCourrierCompany}</td>
            </tr>
            <tr>
               <td class='column_parameter_value'>Courier account:</td>
               <td>{shipment.returnLabContactVO.courierAccount}</td>
            </tr>
            <tr>
               <td class='column_parameter_value'>Billing reference:</td>
               <td>{shipment.returnLabContactVO.billingReference}</td>
            </tr>
         </table>
         {/shipment.returnLabContactVO}
      </div>
      <div class="form-group row" style="margin:0px">
         <span  style='font-size:12px; color:red' >
         According to the A-form for this experiment, you are allowed to have {.nbReimbDewars}  parcels reimbursed by the ESRF. Please use the Reimburse button to select/unselect the parcels to be reimbursed. 
         </span >                 
      </div>
      <div class="form-group row" style="margin:0px">
         <span  style='font-size:12px; color:black' >        
         Your FedEx Reference for this shipment: <kbd style="background-color:#207a7a;">{.fedexCode}</kbd>
         </span >   
      </div>
   </div>
</div>

!}