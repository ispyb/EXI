
<table class="table">                    
    <tr>
        <td>Number of passes</td>
        <td  class='column_parameter_value'> 
            {.DataCollection_numberOfPasses}
        </td>
    </tr>
    <tr>
        <td>Detector Distance</td>
        <td  class='column_parameter_value'>{.DataCollection_detectorDistance} mm</td>
    </tr>
   
    <tr>
        <td>X Beam</td>
        <td  class='column_parameter_value'>{.DataCollection_xBeam}</td>
    </tr>
    <tr>
        <td>Y Beam</td>
        <td  class='column_parameter_value'>{.DataCollection_yBeam}</td>
    </tr>
     <tr>
        <td>Kappa Start</td>
        <td  class='column_parameter_value'>
            {@eq key=DataCollection_kappaStart type="number" value=-9999}
                N/A
            {:else}
                {.DataCollection_kappaStart}
            {/eq}
        </td>
    </tr>
     <tr>
        <td>Phi Start</td>
        <td  class='column_parameter_value'>
            {@eq key=DataCollection_phiStart type="number" value=-9999}
                N/A
            {:else}
                {.DataCollection_phiStart}
            {/eq}
        </td>
    </tr>
</table>       
              