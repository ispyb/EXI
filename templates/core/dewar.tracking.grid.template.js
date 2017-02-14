<div class="container-fluid">
    <div class="row">
        <div class="col-xs-12 col-md-12">
            <table class="table small-padding-rows table-striped table-hover align-middle-header align-middle-rows valign-middle-header valign-middle-rows border-header border-grid-light">
                <thead>
                <tr>
                    <th>Dewar</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Location</th>
                </tr>
                </thead>

                {#.dewars}
                    <tr>
                        <td width="15%" style="text-align:left;" rowspan="{.nTracking}">
                            Name: <b>{.code}</b> <br />
                            Barcode: <b>{.barCode}</b> <br />
                            Outbound courier: <b></b> <br />
                            Outbound tracking number: <b>{.trackingNumberFromSynchrotron}</b> <br />
                            Return courier: <b>{.returnCourier}</b> <br />
                            Return tracking number: <b>{.trackingNumberToSynchrotron}</b> <br />
                        </td>
                    </tr>
                    {#.trackingData}
                    <tr>
                        <td width="25%">
                            {@formatDate date=DewarTransportHistory_arrivalDate format="DD-MM-YYYY h:mm" /}
                        </td>
                        <td width="25%">
                            {?DewarTransportHistory_dewarStatus}
                                <kbd style='background-color:#CCCCCC;color:blue;'>{@uppercase key="DewarTransportHistory_dewarStatus" /}</kbd>
                            {/DewarTransportHistory_dewarStatus}
                        </td>
                        <td width="25%">
                            {.DewarTransportHistory_storageLocation}
                        </td>
                    </tr>
                    {/.trackingData}
                    <tr class="division-row">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                {/.dewars}
            </table>
        </div>
    </div>
</div>