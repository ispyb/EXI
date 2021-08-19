function AuthenticationForm(){
    this.singleSite =false;
    this.siteURL = null;
    this.icon = null;
    this.loginMessage = "";
   
	this.onAuthenticate = new Event(this);
}

AuthenticationForm.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'Login',
	    height: 250,
	    closable :  true,
	    width: 480,
	    modal : true,
	    layout: 'fit',
	    items: [
	            this.getPanel()
        ]}
	);
	this.window.show();
};

AuthenticationForm.prototype.getAuthenticationForm = function(){   
    
    var _this = this;
    var margin =  '30 0 0 10';
    this.loginMessage = ExtISPyB.loginMessage;
     if (ExtISPyB.sites){
        if (ExtISPyB.sites.length > 1){
            margin = '10 0 0 10';
        }
     }

    var items =  [{
                            xtype: 'textfield',
                            fieldLabel: 'User',
                            name: 'user',
                            margin :margin,
                            allowBlank: false
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Password',
                            margin : '10 0 0 10',
                            name: 'password',
                            allowBlank: false,
                            inputType : 'password',
                            enableKeyEvents : true,
                            listeners: {
                                specialkey: function (field, e) {
                                    if (field.getValue() != 'null') {
                                        if (e.getKey() === e.ENTER) {
                                        _this.authenticate(this.up('form').getForm());
                                        }
                                    }
                                }
                            }
      }];  
     if (ExtISPyB.sites){
        if (ExtISPyB.sites.length > 1){
            var sites = Ext.create('Ext.data.Store', {
                fields: ['name', 'url', 'exiUrl'],
                data : ExtISPyB.sites
            });

            items.push({
                            xtype : 'combo',
                            fieldLabel: 'Choose site',
                            name: 'site',
                            store : sites,
                            allowBlank: false,
                            valueField : 'url',
                            displayField : 'name',
                            margin : '10 0 0 10',
                            listeners: {
                                select: function (field, e) {                                                                         
                                            _this.authenticate(this.up('form').getForm());                                                                          
                                }
                            }
	                    } );           
        }
     }
             
     return    {
                        xtype: 'container',
                        layout: 'vbox',                      
                        items: items
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

AuthenticationForm.prototype.authenticate = function(form){
    var _this = this;
    var exiUrl;
    var properties = null;
    
    if (!this.singleSite){
        this.siteURL = form.getFieldValues().site;
    }
    
    for (var i =0; i< ExtISPyB.sites.length; i++){
        if (ExtISPyB.sites[i].url == this.siteURL){
            properties = ExtISPyB.sites[i];
        }	        		
    }           
        
    this.onAuthenticate.notify({
        user : form.getFieldValues().user, 
        password : form.getFieldValues().password, 
        site : this.siteURL,
        exiUrl : properties.exiUrl,
        properties : properties
    });
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
	    width: 400,
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
                                    this.getAuthenticationForm()
									]
                        }                                           
        ],
       
	    buttons: [ 
		        this.loginMessage,
                {
                    text: 'Login',
                    formBind: true,
                    disabled: true,
                    handler: function() {                             	
                        _this.authenticate(this.up('form').getForm());
	            }
	    }
		]
	});
};




