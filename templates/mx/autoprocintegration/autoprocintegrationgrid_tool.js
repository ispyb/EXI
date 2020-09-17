
{!
    {@eq key=v_datacollection_summary_phasing_anomalous value="true" type="boolean"}
    <span style='font-weight:bold; font-size:12px;'>{.v_datacollection_processingPrograms}</span><br/>
    <span style='font-weight:bold;font-size:12x;'>{.v_datacollection_summary_phasing_autoproc_space_group}</span><br/>
    <span style='color:#F9B720;background-color:#9C7606;'>ANOMALOUS</span>
{:else}
     <span style='font-weight:bold; font-size:12px;'>{.v_datacollection_processingPrograms}</span><br/>
    <span style='font-weight:bold;font-size:12x;'>{.v_datacollection_summary_phasing_autoproc_space_group}</span>
   
{/eq}

!}

