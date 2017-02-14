function PuckLegend(args){
    this.id = BUI.id();
    this.width = 200;
    this.height = 10;
    this.style = "horizontal";
    var cy = "30.5%";
    var fontSize = "0.55vw";
    var rad = "7%";
    var tOffset = "50%"; //Text offset

    if (args) {
        if (args.width) {
            this.width = args.width;
        }
        if (args.height) {
            this.height = args.height;
        }
        if (args.cy) {
            cy = args.cy;
        }
        if (args.tOffset) {
            tOffset = args.tOffset;
        }
        if (args.style) {
            this.style = args.style;
        }
        if (args.rad) {
            rad = args.rad;
        }
        if (args.fontSize) {
            fontSize = args.fontSize;
        }
    }
    
    var circles = [];
    if (this.style == "horizontal") {
        circles.push({cx : "7%", cy : cy, r : rad, cls : "cell_empty", text : "EMPTY"});
        circles.push({cx : "27%", cy : cy, r : rad, cls : "cell_collected", text : "COLLECTED"});
        circles.push({cx : "47%", cy : cy, r : rad, cls : "cell_filled", text : "FILLED"});
        circles.push({cx : "67%", cy : cy, r : rad, cls : "cell_selected", text : "SELECTED"});
} else if (this.style == "vertical") {
        circles.push({cy : "7%", cx : cy, r : rad, cls : "cell_empty", text : "EMPTY"});
        circles.push({cy : "27%", cx : cy, r : rad, cls : "cell_collected", text : "COLLECTED"});
        circles.push({cy : "47%", cx : cy, r : rad, cls : "cell_filled", text : "FILLED"});
        circles.push({cy : "67%", cx : cy, r : rad, cls : "cell_selected", text : "SELECTED"});
    }

    this.data = {
                    id          : this.id,
                    circles     : circles,
                    tOffset     : tOffset,
                    fontSize    : fontSize
                };
}

PuckLegend.prototype.getPanel = function () {
	var html = "";
	dust.render("puck.legend.template", this.data, function(err, out){
		html = out;
	});
	
	return {
				html : html,
                width : this.width,
                height : this.height
			};
};
