<div class="container-fluid">
    {#pucks}
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <table class='table-sm table-condensed '>
            <tbody>
                <tr>
                    <td  style='padding:0 15px 0 15px;'>Container Code:</td>
                    <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.containerCode}</td>
                </tr>
                <tr>
                    <td  style='padding:0 15px 0 15px;'>Container Id:</td>
                    <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.containerId}</td>
                </tr>
                <tr>
                    <td  style='padding:0 15px 0 15px;'>Sample Changer Location:</td>
                    <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.sampleChangerLocation}</td>
                </tr>
            </tbody>
            </table>
        </div>
        
        <div class="col-xs-6 col-md-6">
            <table class='table-sm table-condensed '>
            <thead>
                <tr>
                    <th  colspan=2 style='padding:0 15px 0 15px;'> </th>
                </tr>
            </thead>
            <tbody>
                {#.cells}
                {@ne key="{.state}" value="EMPTY"}
                <tr>
                    <td  style='padding:0 15px 0 15px;'>Location:</td>
                    <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.location}</td>
                </tr>
                <tr>
                    <td  style='padding:0 15px 0 15px;'>Sample name:</td>
                    <td  style='padding:0 15px 0 15px;' class='column_parameter_value'>{.sample_name}</td>
                </tr>
                {/ne}
                {/.cells}
            </tbody>
            </table>
        </div>
    </div>
    <hr>
   {/pucks}
</div>