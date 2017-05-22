<table class="table">                    
    <tr>
        <td>Res. (corner)</td>
        <td  class='column_parameter_value'>{@decimal key="DataCollection_resolution" decimals=2 /} &#8491; ({@decimal key="DataCollection_resolutionAtCorner" decimals=2 /} &#8491;)</td>
    </tr>
    <tr>
        <td>En. (Wave.)</td>
        <td  class='column_parameter_value'>{@wavelengthToEnergy key="DataCollection_wavelength" /} keV ({@decimal key="DataCollection_wavelength" decimals=4 /} &#8491;)</td>
    </tr>
    <tr>
        <td>{.DataCollection_rotationAxis} range</td>
        <td  class='column_parameter_value'>{@decimal key="DataCollection_axisRange" decimals=2 /} &deg;</td>
    </tr>
    
    <tr>
        <td>{.DataCollection_rotationAxis} start 
        
            {@ne key=DataCollectionGroup_experimentType value="Characterization"}                
                (total)
            {/ne}
        </td>                                                           
        <td  class='column_parameter_value'>{@decimal key="DataCollection_axisStart" decimals=2 /} &deg; 
        
            {@ne key=DataCollectionGroup_experimentType value="Characterization"}                
                ({@decimal key="DataCollection_axisTotal" decimals=0 /}&deg;)
            {/ne}
         </td>
    </tr>
    <tr>
        <td>Exposure Time</td>
        <td  class='column_parameter_value'>{.DataCollection_exposureTime} s</td>
    </tr> 
    <tr>
      <td>Flux start</td>
      <td class='column_parameter_value'>{.DataCollection_flux} ph/sec</td>
   </tr>
    <tr>
        <td>Flux end</td>
        <td  class='column_parameter_value'>{.DataCollection_flux_end} ph/sec</td>
    </tr>
</table>