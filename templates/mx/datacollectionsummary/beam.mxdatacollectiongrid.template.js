<table class="table">                    
    <tr>
        <td>Focusing optics</td>
        <td  class='column_parameter_value'>{BeamLineSetup_focusingOptic}</td>
    </tr>
    <tr>
        <td>Monochromator type</td>
        <td  class='column_parameter_value'>{BeamLineSetup_monochromatorType}</td>
    </tr>
    <tr>
        <td>Beam shape</td>
        <td  class='column_parameter_value'>{DataCollection_beamShape}</td>
    </tr>   
    <tr>
        <td>Beam size at Sample Hor (Vert)</td>
        <td  class='column_parameter_value'>
                                            {?beamSizeAtSampleX}
                                            {@multiply key="beamSizeAtSampleX" parameter=1000 /} ({@multiply key="beamSizeAtSampleY" parameter=1000 /}) &mu;m{/beamSizeAtSampleX}
        </td>
    </tr>
     <tr>
        <td>Beam divergence Hor (Vert)</td>
        <td  class='column_parameter_value'>{BeamLineSetup_beamDivergenceHorizontal} ({BeamLineSetup_beamDivergenceVertical}) &mu;rad</td>
    </tr>
    <tr>
        <td>Polarisation</td>
        <td  class='column_parameter_value'>{BeamLineSetup_polarisation}</td>
    </tr>
</table>    