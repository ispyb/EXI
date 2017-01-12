<select id="{id}-{containerId}" class="beamlines-select" style="pointer-events:none" disabled>
    {#beamlines}
    <option value={containerId} {@eq key="{.}" value="{selected}"}selected{/eq}>{.}</option>
    {/beamlines}
</select>