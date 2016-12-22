<div class="container-fluid">
    <div class="row">
        <div class="col-md-4">
            <table class="table">
                <thead>
                    <tr>
                        <th class="text-center" colspan="2">Protein</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Protein acronym</td>
                        <td class='column_parameter_value'>{crystalVO.proteinVO.acronym}</td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td class='column_parameter_value'>{.name}</td>
                    </tr>
                    <tr>
                        <td>Comments</td>
                        <td class='column_parameter_value'>{.comments}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="container-fluid" >
        <div class="row">
            <div class="col-md-10" style="padding:0;">
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>A</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellA}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>B</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellB}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>C</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellC}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>&#945</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellAlpha}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>&#946</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellBeta}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-1" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>&#947</th></tr></thead>
                        <tbody><tr><td>{.crystalVO.cellGamma}</td></tr></tbody>
                    </table>
                </div>
                <div class="col-md-6" style="padding:0;">
                    <table class="table">
                        <thead><tr><th>PDB</th></tr></thead>
                        <tbody><tr><td></td></tr></tbody>
                    </table>
                </div>
            </div>
        </div>
        {!<table class="table text-center">
            <thead>
                <tr>
                    <th class="text-center">A</span></th>
                    <th class="text-center">B</span></th>
                    <th class="text-center">C</span></th>
                    <th class="text-center">&#945</span></th>
                    <th class="text-center">&#946</span></th>
                    <th class="text-center">&#947</span></th>
                    <th class="text-center">PDB</span></th>
                </tr>
            </thead>
            <tbody>
                    <tr>
                        <td>{.crystalVO.cellA}</td>
                        <td>{.crystalVO.cellB}</td>
                        <td>{.crystalVO.cellC}</td>
                        <td>{.crystalVO.cellAlpha}</td>
                        <td>{.crystalVO.cellBeta}</td>
                        <td>{.crystalVO.cellGamma}</td>
                    </tr>
                </tbody>
        </table>!}
    </div>
</div>