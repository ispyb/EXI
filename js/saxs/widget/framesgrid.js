function FramesGrid (args) {
    this.id = BUI.id();
    this.selectedFrames = [];

    this.onSelectionChange = new Event(this);
}

FramesGrid.prototype.getPanel = function () {
    return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : true
	}
};

FramesGrid.prototype.load = function (frames) {
    if (frames) {
        this.frames = frames;
        this.frames.id = this.id;

        var html = "";
        dust.render("frames.grid.template",frames,function (err,out){
            html += out;
        });

        $("#" + this.id).html(html);

        this.setClickListeners();
    }
};

FramesGrid.prototype.setClickListeners = function () {
    var _this = this;
    $('#' + this.id + '-frames-table').unbind('click').on('click', '.frame-cell-element', function(event) {
        var fileName = event.target.id;
        if (event.shiftKey && _this.selectedFrames.length > 0){
            var last = _this.getFileName(_this.selectedFrames[_this.selectedFrames.length-1].filePath);
            if (last != fileName) {
                var lastIndex = _this.frames.indexOf(_this.getFrameByFileName(last));
                var currentIndex = _this.frames.indexOf(_this.getFrameByFileName(fileName));
                var begin = Math.min(lastIndex, currentIndex);
                var end = Math.max(lastIndex, currentIndex);
                _this.deselectAll();
                for (var i = begin ; i <= end ; i++) {
                    _this.select(_this.getFileName(_this.frames[i].filePath));
                }
            }
        } else {
            if (event.ctrlKey) {
                if (_this.selectedFrames.indexOf(_this.getFrameByFileName(fileName)) >= 0) {
                    _this.deselect(fileName);
                } else {
                    _this.select(fileName);
                }
            } else {
                if (_this.selectedFrames.length == 1 && _this.getFileName(_this.selectedFrames[0].filePath) == fileName) {
                    _this.deselect(fileName);
                } else {
                    _this.deselectAll();
                    _this.select(fileName);
                }
            }
        }
        _this.onSelectionChange.notify(_this.parseSelected());
    });
}

FramesGrid.prototype.select = function (fileName) {
    this.selectedFrames.push(this.getFrameByFileName(fileName));
    $("#" + fileName).addClass('x-grid-item-selected');
}

FramesGrid.prototype.deselect = function (fileName) {
    var _this = this;
    _.remove(this.selectedFrames,function(o) {return _this.getFileName(o.filePath) == fileName});
    $("#" + fileName).removeClass('x-grid-item-selected');
}

FramesGrid.prototype.deselectAll = function () {
    this.selectedFrames = [];
    $(".frame-cell-element").removeClass("x-grid-item-selected");
}

FramesGrid.prototype.getFileName = function (filePath) {
    var withExtension = filePath.substring(filePath.lastIndexOf('/')+1);
    return withExtension.substring(0,withExtension.indexOf("."));
}

FramesGrid.prototype.getFrameByFileName = function (fileName) {
    var _this = this;
    return _.filter(this.frames,function (o) {return _this.getFileName(o.filePath) == fileName})[0];
};

FramesGrid.prototype.parseSelected = function () {
    var parsed = {
                    average         : [],
                    bufferaverage   : [],
                    frame           : [],
                    sampleaverage   : [],
                    subtracted      : []
                };
    for (var i = 0 ; i < this.selectedFrames.length ; i++) {
        var frame = this.selectedFrames[i];
        switch (frame.type) {
            case 'Frame':
                parsed.frame.push(frame.frameId);
                break;
            case 'Subtraction':
                parsed.subtracted.push(frame.frameId);
                break;
            case 'BufferAverage':
                parsed.bufferaverage.push(frame.frameId);
                break;
            case 'SampleAverage':
                parsed.sampleaverage.push(frame.frameId);
                break;
        }
    }
    return parsed;
}