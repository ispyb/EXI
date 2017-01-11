

function PuckWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Macromolecules";
	this.closable = false;

}

PuckWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
PuckWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

PuckWelcomeMainView.prototype.getOptions = function() {
	var html =  "<ul><li>Define beforehand an experiment</li>";
	html = html + "<li>Send your samples by courier</li>";
	return html + "</ul>";
};



PuckWelcomeMainView.prototype.getContainer = function() {
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
							        	 html : '<div class="landing-title" ><h2>Pucks on ISPyB</h2></div>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : '<div class="landing-text">A puck is...</div><br/>',
							        	 margin : '0 0 0 40'
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
										        	 text : '<div class="square-option-text"; >Add a new Puck</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/mx/puck/add';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


PuckWelcomeMainView.prototype.load = function() {
	
};
