
<table class="table">                    
    <tr>
        <td>Detector Type</td>
        <td  class='column_parameter_value'> 
            {.Detector_detectorType}
        </td>
    </tr>
    <tr>
        <td>Detector Model</td>
        <td  class='column_parameter_value'>{.Detector_detectorModel}</td>
    </tr>
    <tr>
        <td>Manufacturer</td>
        <td  class='column_parameter_value'>{.Detector_detectorManufacturer}</td>
    </tr>
    {!<tr>
        <td>Mode</td>
        <td  class='column_parameter_value'>{.Detector_detectorMode}</td>
    </tr>!}
    <tr>
        <td>Pixel Size Hor (Vert)</td>
        <td  class='column_parameter_value'>
        {@multiply key="Detector_detectorPixelSizeHorizontal" parameter=1000 /} ({@multiply key="Detector_detectorPixelSizeVertical" parameter=1000 /})  &mu;m</td>
    </tr>
</table>       
              