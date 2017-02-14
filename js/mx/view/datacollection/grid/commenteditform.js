function CommentEditForm(args) {
    this.id = BUI.id();

    this.targetId = null;
    this.templateData = {id : this.id};
    this.mode = "DATACOLLECTIONGROUP";

    if (args) {
        if (args.mode) {
            this.mode = args.mode;
        }
    }

    this.onSave = new Event(this);
}

CommentEditForm.prototype.show = function(){
    var _this = this;
    
    var html = "";
    dust.render("comment.edit.form.template", this.templateData, function(err,out){
        html = out;
    });

    $("body").append(html);
    $("#" + this.id + "-save").unbind('click').click(function(sender){
        _this.save();
    });
    $("#" + this.id + "-modal").on('hidden.bs.modal', function(){
        $(this).remove();
    });
    
    $("#" + this.id + "-modal").modal();
};


CommentEditForm.prototype.load = function (targetId, comments) {
    this.targetId = targetId;
    this.templateData.comments = comments;
}

CommentEditForm.prototype.save = function(){
    var _this = this;
    var comment = $("#" + this.id + "-comments").val();

    var onSuccess = function (sender) {
        _this.onSave.notify(comment);
    }
    if (this.mode == "DATACOLLECTIONGROUP"){
        EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollectionGroup.saveComments(this.targetId,comment);
    } else {
        EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.saveComments(this.targetId,comment);
    }
}