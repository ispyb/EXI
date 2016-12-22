<table id="{id}-frames-table" class="table table-hover small-padding-rows">
    {#.}
        <tr>
            <td id={@fileName /} class="frame-cell-element" style="cursor:pointer">
                <span class="unselectable-text" style="pointer-events:none;">{@fileName /}</span>{?.discarded}<span class="unselectable-text" style="color:red;pointer-events:none;"> (discarded)</span>{/.discarded}
            </td>
        <tr>
    {/.}
</table>