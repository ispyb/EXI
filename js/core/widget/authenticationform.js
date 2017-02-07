function AuthenticationForm(){
    this.singleSite =false;
    this.siteURL = null;
    this.icon = null;
	this.onAuthenticate = new Event(this);
}
AuthenticationForm.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'Login',
	    height: 250,
	    closable :  false,
	    width: 450,
	    modal : true,
	    layout: 'fit',
	    items: [
	            this.getPanel()
        ]}
	);
	this.window.show();
};

AuthenticationForm.prototype.getAuthenticationForm = function(){         
     if (ExtISPyB.sites){
        if (ExtISPyB.sites.length > 1){
             var sites = Ext.create('Ext.data.Store', {
                fields: ['name', 'url', 'exiUrl'],
                data : ExtISPyB.sites
            });
            
            return    {
                        xtype: 'container',
                        layout: 'vbox',
                        items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'User',
                            name: 'user',
                            margin : '10 0 0 10',
                            allowBlank: false
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Password',
                            margin : '10 0 0 10',
                            name: 'password',
                            allowBlank: false,
                            inputType : 'password'
                        },{
                            xtype : 'combo',
                            fieldLabel: 'Choose site',
                            name: 'site',
                            store : sites,
                            allowBlank: false,
                            valueField : 'url',
                            displayField : 'name',
                            margin : '10 0 0 10'
	                    }    
                        ]
                    }
        }
     }
    
    
     
    return    {
                xtype: 'container',
                layout: 'vbox',
                items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'User',
                    name: 'user',
                    margin : '30 0 0 10',
                    allowBlank: false
                }, 
                {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    margin : '10 0 0 10',
                    name: 'password',
                    allowBlank: false,
                    inputType : 'password'
                }    
                ]
  };                  
     
};


AuthenticationForm.prototype.getIconForm = function(){    
        if (this.singleSite)
                    return {
                            xtype   : 'image',
                            src     : this.site.icon,
                            width   : 75,
                            height  : 75,
                            margin  : '30 0 0 10'
                            
                        };
};


AuthenticationForm.prototype.getPanel = function(){
	var _this = this;
   

    if (ExtISPyB.sites){
        if (ExtISPyB.sites.length == 1){                                         
            /** Only a single site so we can show the icon */
            this.singleSite = true;
            this.siteURL = ExtISPyB.sites[0].url;  
            this.site = ExtISPyB.sites[0];
            this.icon = ExtISPyB.sites[0].icon;                                                            
        }
    }
    
	return Ext.create('Ext.form.Panel', {
	    bodyPadding: 5,
	    width: 370,
	    layout: 'vbox',       
	    defaults: {
	        anchor: '90%'
	    },
	    // The fields
	    defaultType: 'textfield',
	    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                    this.getIconForm(),              
                                    this.getAuthenticationForm()]
                        }                                           
        ],
	    buttons: [ {
	        text: 'Login',
	        formBind: true,
	        disabled: true,
	        handler: function() {
	        	var form = this.up('form').getForm();	        	
	        	var exiUrl;
	        	var properties = null;
                
                 if (!_this.singleSite){
                    _this.siteURL = form.getFieldValues().site;
                }
                
	        	for (var i =0; i< ExtISPyB.sites.length; i++){
	        		if (ExtISPyB.sites[i].url == _this.siteURL){
	        			properties = ExtISPyB.sites[i];
	        		}	        		
	        	}
               
                
	        	_this.onAuthenticate.notify({
	        		user : form.getFieldValues().user, 
	        		password : form.getFieldValues().password, 
	        		site : _this.siteURL,
	        		exiUrl : properties.exiUrl,
	        		properties : properties
	        	});

	        }
	    }]
	});
};




