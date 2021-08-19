<table style='border : 1px solid #000000;'>
    {#energyScans}
        <tr>
            <td colspan="4" style='border : 1px solid #000000;background-color:#E0E0E0;'>
                <h1 class="panel-title" style='color:#337ab7;'>
                    <span style='font-size:12px;'>   {.startTime}</span>
                </h1>
            </td>
        </tr>    
        <tr>
            <td style="width:10%;">
                <div style='font-size:30px;'>{.element}</div>
            </td>
            <td style="width:30%;">
                <table class="table table-condensed">
                    <tr>
                        <td>Start Time</td>
                        <td class='column_parameter_value'>{.startTime}</td>
                    </tr>
                    <tr>
                        <td>Protein</td>
                        <td class='column_parameter_value'>{.acronym}</td>
                    </tr>
                    <tr>
                        <td>Sample</td>
                        <td class='column_parameter_value'>{.name}</td>
                    </tr>
                    <tr>
                        <td>Fluorescence Detector</td>
                        <td class='column_parameter_value'>{.fluorescenceDetector}</td>
                    </tr>
                    <tr>
                        <td style='width:150px;'>Energy Scan Range</td>
                        <td class='column_parameter_value'>{.startEnergy} kev - {.endEnergy} kev</td>
                    </tr>
                    <tr>
                        <td>Edge Energy (theoretical)</td>
                        <td class='column_parameter_value'>{.edgeEnergy} kev</td>
                    </tr>
                    <tr>
                        <td>Flux @100%</td>
                        <td class='column_parameter_value'>{.flux} ph/sec</td>
                    </tr>
                    <tr>
                        <td>Transmission</td>
                        <td class='column_parameter_value'>{.transmissionFactor} %</td>
                    </tr>

                    <tr>
                        <td style='width:150px;'>Beam Size Hor</td>
                        <td class='column_parameter_value'>{.beamSizeHorizontal} micrometer</td>
                    </tr>
                    <tr>
                        <td>Beam Size Vert</td>
                        <td class='column_parameter_value'>{.beamSizeVertical} micrometer</td>
                    </tr>
                    <tr>
                        <td>Exposure Time</td>
                        <td class='column_parameter_value'>{@decimal key="exposureTime" decimals=3 /} sec</td>
                    </tr>
                    <tr>
                        <td>Filename</td>
                        <td class='column_parameter_value'>{.filename}</td>
                    </tr>
                </table>
            </td>


            <td style="width:30%;">
                <table class="table table-condensed">
                    <tr>
                        <td >Peak Energy</td>
                        <td class='column_parameter_value'>{@decimal key="peakEnergy" decimals=3 /} keV</td>
                    </tr>
                    <tr>
                        <td >Pk f'</td>
                        <td class='column_parameter_value'>{@decimal key="peakFPrime" decimals=2 /} &#275;</td>
                    </tr>

                    <tr>
                        <td >Pk f''</td>
                        <td class='column_parameter_value'>{@decimal key="peakFDoublePrime" decimals=2 /} &#275;</td>
                    </tr>

                    <tr>
                        <td >Inflection Energy</td>
                        <td class='column_parameter_value'>{@decimal key="inflectionEnergy" decimals=2 /} kev</td>
                    </tr>
                    <tr>
                        <td >Ip f'</td>
                        <td class='column_parameter_value'>{@decimal key="inflectionFPrime" decimals=2 /} &#275; </td>
                    </tr>
                    <tr>
                        <td >Ip f''</td>
                        <td class='column_parameter_value'>{@decimal key="inflectionFDoublePrime" decimals=2 /} &#275; </td>
                    </tr>

                    <tr>
                        <td >Remote Energy</td>
                        <td class='column_parameter_value'>{@decimal key="remoteEnergy" decimals=3 /} keV</td>
                    </tr>
                    <tr>
                        <td >Remote f'</td>
                        <td class='column_parameter_value'>{@decimal key="remoteFPrime" decimals=2 /} &#275;</td>
                    </tr>
                    <tr>
                        <td >Remote f''</td>
                        <td class='column_parameter_value'>{@decimal key="remoteFDoublePrime" decimals=2 /} &#275;</td>
                    </tr>

                </table>
            </td>

            <td style="width:30%;">
                <img  alt="Image not found"  src='{.choochURL}' crossOrigin="Anonymous" width="200" height="200" style="width:200pt;height:200pt;"/>
            </td>
        

        </tr>
    {/energyScans}
</table>