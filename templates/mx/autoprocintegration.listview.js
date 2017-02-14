<table> 
	<tr><td style='color:#207a7a;font-weight:bold;'>{.v_datacollection_processingPrograms}</td></tr>
	<tr><td>{.v_datacollection_summary_phasing_autoproc_space_group}</td></tr>
	<tr>
		<td>
			{@eq key=v_datacollection_summary_phasing_anomalous type="boolean" value="true"}
				<kbd style="FONT-FAMILY:helvetica, arial, verdana, sans-serif;background-color:#337ab7;margin-right:5px;">ANOM</kbd>
			{/eq}
			{?label}
				{@eq key=label value="BEST"}
					<kbd style="background-color:green">{.label}</kbd>
				{:else}
					<kbd style="background-color:orange">{.label}</kbd>
				{/eq}
			{/label}
		</td>
	</tr>
</table>