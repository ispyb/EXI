/**
* AddressListView displays the address (labcontact information) as list on the navigation panels
*
* @class AddressListView
* @constructor
*/
function AddressListView(){
	this.title = "Addresses";
	this.sorters = [{property : 'cardName', direction: 'ASC'}];
	ListView.call(this);
}

AddressListView.prototype.getPanel = ListView.prototype.getPanel;
AddressListView.prototype.load = ListView.prototype.load;
AddressListView.prototype.getFields = ListView.prototype.getFields;
AddressListView.prototype.getColumns = ListView.prototype.getColumns;

AddressListView.prototype.getFilter = function(value){
	return [{property : "cardName", value : value, anyMatch : true}];
};

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
AddressListView.prototype.getRow = function(record){
	var html = "";
	dust.render("address.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};



