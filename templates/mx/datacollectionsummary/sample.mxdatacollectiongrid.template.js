
<table class="table">
    <tr>
        <td>Protein</td>
        <td  class='column_parameter_value'>{.Protein_acronym}</td>
    </tr> 
     <tr>
        <td>Sample</td>
        <td  class='column_parameter_value'>{.BLSample_name}</td>
    </tr> 
    <tr>
        <td>Shipment</td>
        <td  class='column_parameter_value'><a href='#/shipping/{Shipping_shippingId}/main' target='_blank'>{.Shipping_shippingName}</a></td>
    </tr>
    <tr>
        <td>Parcel</td>
        <td  class='column_parameter_value'>{.Dewar_code}</td>
    </tr> 
     <tr>
        <td> Container / Position </td>
        <td  class='column_parameter_value'><a href='#/shipping/{Shipping_shippingId}/{Shipping_shippingStatus}/containerId/{Container_containerId}/edit' target='_blank'> {.Container_code} </a>/ {.BLSample_location} </td>
    </tr> 
     <tr>
        <td> Sample barcode</td>
        <td  class='column_parameter_value'> {.barCode}</td>
    </tr>                   
    <tr>
        <td>Beamline location</td>
        <td  class='column_parameter_value'> {.Container_beamlineLocation}</td>
    </tr>
    <tr>
        <td>Sample changer location</td>
        <td  class='column_parameter_value'>{.Container_sampleChangerLocation}</td>
    </tr>
    <tr>
        <td>Sample comments</td>
        <td  class='column_parameter_value' ><span id="comments_{.BLSample_blSampleId}" onmouseover="javascript:$(this).linkify();">{.BLSample_comments}</span></td>
    </tr>
</table>       
              