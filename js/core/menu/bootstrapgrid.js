/**
* Given a dustjs template and some data, it returns a panel containing a bootstrap grid
*
* @class BootstrapGrid
* @return 
*/
function BootstrapGrid(args) {
    this.id = BUI.id();
    this.data = {};
    this.width = 300;
    this.height = 300;
    this.template = "";
    if (args) {
        if (args.width) {
            this.width = args.width;
        }
        if (args.height) {
            this.height = args.height;
        }
        if (args.template) {
            this.template = args.template;
        }
    }
    
    this.data.id = this.id;

    this.rowSelected = new Event(this);
}

/**
* Returns an EXT.panel.Panel containing the html of the grid and sets the click listeners
*
* @method getPanel
* @return 
*/
BootstrapGrid.prototype.getPanel = function () {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        width : this.width,
        autoScroll:true,
        autoHeight :true,
        maxHeight: this.height,
        title : this.data.header,
        items : [{html : this.getHTML()}]
    });

    this.panel.on('boxready', function() {
        _this.setClickListeners();
    });

    return this.panel;
};

/**
* Sets the click listeners
*
* @method setClickListeners
* @return 
*/
BootstrapGrid.prototype.setClickListeners = function () {
    var _this = this;

    $('#bootstrap-table-' + this.id).unbind('click').on('click', '.clickable-row', function(event) {
        $(this).addClass('active-step').siblings().removeClass('active-step');
        _this.rowSelected.notify(event.target.innerText);
    });

};

/**
* Selects a row given its value
*
* @method selectRowByValue
* @return 
*/
BootstrapGrid.prototype.selectRowByValue = function (value) {
    var rowIndex = this.data.values.indexOf(value);
    if (rowIndex >= 0) {
        $("#row-" + rowIndex + "-" + this.id).addClass('active-step').siblings().removeClass('active-step');
        this.rowSelected.notify($("#row-" + rowIndex + "-" + this.id).innerText);
    }
};

/**
* Deselects all rows
*
* @method deselectAll
* @return 
*/
BootstrapGrid.prototype.deselectAll = function () {
    $('#bootstrap-table-' + this.id).find('.clickable-row').removeClass("active-step");
};

/**
* Loads and returns the html code of the grid
*
* @method getPanel
* @return 
*/
BootstrapGrid.prototype.getHTML = function () {
    var html = "";
	dust.render(this.template, this.data, function(err, out){
		html = out;
	});

    return "<div id='bootstrap-grid-" + this.id + "'>" + html + "</div>";
};

/**
* Loads the data of the grid
*
* @method load
* @return 
*/
BootstrapGrid.prototype.load = function (data) {
    this.data = data;
    this.data.id = this.id;
    if ($("#bootstrap-grid" + this.id).length) {
        this.panel.setTitle(data.header);
        $("#bootstrap-grid" + this.id).html(this.getHTML());
        this.setClickListeners();
    }
};