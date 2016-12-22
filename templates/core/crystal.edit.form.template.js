<div style="padding:20px;">
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Name:</label>
        <div class="col-md-10">
            <input id="{id}-name" class="form-control" type="text" value="{name}">
        </div>
    </div>
    <div class="form-group row">
        <label class="col-md-2 col-form-label">Space Group:</label>
        <div class="col-md-10">
            <select id="{id}-space-group" class="form-control">
                {#spaceGroups}
                <option value={.} {@eq key="{.}" value="{spaceGroup}"}selected{/eq}>{.}</option>
                {/spaceGroups}
            </select>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-md-6">
            <div class="form-group row">
                <label class="col-md-2 col-form-label">A:</label>
                <div class="col-md-10">
                    <input id="{id}-cellA" class="form-control" type="text" value="{cellA}">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">B:</label>
                <div class="col-md-10">
                    <input id="{id}-cellB" class="form-control" type="text" value="{cellB}">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">C:</label>
                <div class="col-md-10">
                    <input id="{id}-cellC" class="form-control" type="text" value="{cellC}">
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#945:</label>
                <div class="col-md-10">
                    <input id="{id}-cellAlpha" class="form-control" type="text" value="{cellAlpha}">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#946:</label>
                <div class="col-md-10">
                    <input id="{id}-cellBeta" class="form-control" type="text" value="{cellBeta}">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-md-2 col-form-label">&#947:</label>
                <div class="col-md-10">
                    <input id="{id}-cellGamma" class="form-control" type="text" value="{cellGamma}">
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <label class="col-md-2 col-form-label "><b>Comments:</b></label>
        <div class="col-md-10">
            <textarea id="{id}-comments" class="form-control" rows="3">{comments}</textarea>
        </div>
    </div>
</div>