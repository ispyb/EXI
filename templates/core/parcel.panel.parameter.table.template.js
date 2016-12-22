<table class="table valign-middle-rows small-padding-rows" style="height:{height}px;margin:0px;font-size: 9px;">
    <tr>
        {!<td rowspan="4" style="background-color:#ddd;width:25px;"><span style="font-size: 10px;">#{dewar.index}</span></td>!}
        <td >Code: </td>
        <td class="column_parameter_value">{dewar.code}</td>
    </tr>
    <tr valign="middle">
        <td>Status: </td>
        <td class="column_parameter_value">{dewar.dewarStatus}</td>
    </tr>
    <tr valign="middle">
        <td>Storage: </td>
        <td class="column_parameter_value">{dewar.storageLocation}</td>
    </tr>
    {!{?dewar.comments}
    <tr valign="middle">
        <td>Comments: </td>
        <td class="column_parameter_value">{dewar.comments}</td>
    </tr>  
    {/dewar.comments} !}         
</table>