<div id='{.id}' style='height:{height}px;{?enableClick}cursor:pointer;{/enableClick}'>
    <div id='{.id}-img' pointer-events='none' class='stock-solution' style="height:{height}px;">
        {?fillPanel}
            <table class="table">
                <tr valign="middle">
                    <td style="border-bottom:1px solid;"><b>
                        {@eq key=code value=""}
                            &nbsp;-
                        {:else}
                            {code}
                        {/eq}</b>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span id='{id}-samples'>{nSamples}</span>
                        <span style="font-size:9px;"> Samples</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span id='{id}-measured'>{nMeasured}</span>
                        <span style="font-size:8px;"> Measured</span>
                    </td>
                </tr>
            </table>
        {/fillPanel}
    </div>
</div>