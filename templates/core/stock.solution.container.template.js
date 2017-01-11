<div id='{.id}' style='height:{height}px;{?enableClick}cursor:pointer;{/enableClick}'>
    <div id='{.id}-img' pointer-events='none' class='stock-solution' style="height:{height}px;">
        {?fillPanel}
        <b>&bull;</b> {@eq key=code value=""}
                            &nbsp;-
                        {:else}
                            {code}
                        {/eq}<br/>
        <b>&bull;</b> {macromoleculeAcronym}<br/>
        <b>&bull;</b> {buffer}
        {/fillPanel}
    </div>
</div>