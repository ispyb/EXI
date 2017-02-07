<table> 
	<tr><td style='color:#207a7a;font-weight:bold;'>{.Shipping_shippingName}</td></tr>
	<tr><td>{.formattedCreationDate}</td></tr>
	<tr><td>{.stats.dewars} parcels ({.stats.samples} Samples)</td></tr>
	<tr><td {@eq key=Shipping_shippingStatus value="processing"}style='color:#ff7f00;font-weight:bold;' {/eq}>{.Shipping_shippingStatus}</td></tr>
</table>