

function AddressWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Macromolecules";
	this.closable = false;

}

AddressWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;


AddressWelcomeMainView.prototype.getOptions = function() {
	var html =  "<ul><li>Define beforehand an experiment</li>";
	html = html + "<li>Send your samples by courier</li>";
	return html + "</ul>";
};



AddressWelcomeMainView.prototype.getContainer = function() {
	return  Ext.createWidget('panel',
			{
				plain : true,
				margin : '20',
				layout : 'fit',
				items : [
					{
						tabConfig : {
							title : 'Welcome'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
//							height : 700,
							padding : 10,
							margin : 0,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="landing-title" ><h2>Manage Shipping Addresses on ISPyB</h2></div>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : '<div class="landing-text">A buffer is the matched solution which in a sample is suspended</div><br/>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : '<div class="landing-text">You should define a macromolecule on ISPyB if you want:</div>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : this.getOptions(),
							        	 margin : '0 0 0 40'
							         },
							         
							         {
							        	 html : '<br/><div class="landing-text">If your macromolecule is not in the list showed on the left you can create a new one</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	xtype : 'container',
							        	layout : 'hbox',
							        	cls : 'option-bar-menu',
							        	items :[
							        	    
										         {
										        	 xtype : 'button',
										        	 cls : 'square-option',
										        	 maxWidth : 200,
										        	 minWidth : 200,
										        	 margin : '0 0 0 150',
										        	 height : 100,
										        	 text : '<div class="square-option-text"; >Add a new Address</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/buffer/add';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


AddressWelcomeMainView.prototype.load = function() {
	
};
